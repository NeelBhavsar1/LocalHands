package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.*;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.PublicProfileResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.dto.response.UserProfileUpdateResponseDTO;
import com.localhands.backend.entity.*;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.UserMapper;
import com.localhands.backend.repository.*;
import com.localhands.backend.security.UserAuthProvider;
import com.localhands.backend.service.EmailSenderService;
import com.localhands.backend.service.FileStorageService;
import com.localhands.backend.service.ListingService;
import com.localhands.backend.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ListingService listingService;
    private final UserAuthProvider userAuthProvider;
    private final FileStorageService fileStorageService;
    private final EmailSenderService emailSenderService;
    private final NewEmailTokenRepository newEmailTokenRepository;
    private final ActivateAccountTokenRepository activateAccountTokenRepository;

    private final String baseUrl;

    public UserServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            ListingService listingService,
            UserAuthProvider userAuthProvider,
            FileStorageService fileStorageService,
            EmailSenderService emailSenderService,
            NewEmailTokenRepository newEmailTokenRepository,
            @Value("${app.cors.allowed-origin}") String baseUrl,
            ActivateAccountTokenRepository activateAccountTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.listingService = listingService;
        this.userAuthProvider = userAuthProvider;
        this.fileStorageService = fileStorageService;
        this.emailSenderService = emailSenderService;
        this.newEmailTokenRepository = newEmailTokenRepository;
        this.baseUrl = baseUrl;
        this.activateAccountTokenRepository = activateAccountTokenRepository;
    }

    private ResponseCookie generateRefreshTokenCookie(String token, Instant now, Instant expiration) {
        long maxAge = Duration.between(now, expiration).getSeconds();

        return ResponseCookie.from("refreshToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    private ResponseCookie generateAccessTokenCookie(String token, Instant now) {
        Instant expiration = userAuthProvider.getExpiration(token);
        long maxAge = Duration.between(now, expiration).getSeconds();

        return ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(
                    digest.digest(token.getBytes(StandardCharsets.UTF_8))
            );
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Hash algorithm not available.", e);
        }
    }

    @Override
    public CookieResponseDTO generateNewTokenCookies(String refreshToken) {
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(hashToken(refreshToken))
                .orElseThrow(() -> new AppException("Invalid refresh token.", HttpStatus.UNAUTHORIZED));

        if (tokenEntity.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException("Refresh token expired.", HttpStatus.UNAUTHORIZED);
        }

        User user = tokenEntity.getUser();

        Instant now = Instant.now();

        String newRefreshToken = userAuthProvider.createRefreshToken();
        String accessToken = userAuthProvider.createAccessToken(user.getId(), user.getRoles(), now);

        Duration remainingDuration = Duration.between(now, tokenEntity.getExpiryDate());

        if (remainingDuration.isNegative() || remainingDuration.isZero()) {
            throw new AppException("Refresh token expired.", HttpStatus.UNAUTHORIZED);
        }

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(hashToken(newRefreshToken));
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiryDate(now.plus(remainingDuration));

        user.getRefreshTokens().removeIf(t ->
                t.getToken().equals(tokenEntity.getToken())
        );

        user.getRefreshTokens().add(refreshTokenEntity);

        userRepository.save(user);

        ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
        ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

        return new CookieResponseDTO(refreshCookie, accessCookie);
    }

    @Override
    public CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new AppException("Account already exists.", HttpStatus.BAD_REQUEST);
        }

        if (registerDTO.getDateOfBirth() == null || registerDTO.getDateOfBirth().isAfter(LocalDate.now().minusYears(18))) {
            throw new AppException("You must be 18 or older.", HttpStatus.BAD_REQUEST);
        }

        if (registerDTO.getPassword() == null || registerDTO.getPassword().length() < 8) {
            throw new AppException("Password must be at least 8 characters long.", HttpStatus.BAD_REQUEST);
        }

        User user = UserMapper.mapToUser(registerDTO);

        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        Role customerRole = roleRepository.findByRoleName(RoleName.BUYER)
                .orElseThrow(() -> new AppException("Couldn't assign user role.", HttpStatus.INTERNAL_SERVER_ERROR));

        user.getRoles().add(customerRole);

        if (registerDTO.isServiceProvider()) {
            Role sellerRole = roleRepository.findByRoleName(RoleName.SELLER)
                    .orElseThrow(() -> new AppException("Couldn't assign user role.", HttpStatus.INTERNAL_SERVER_ERROR));

            user.getRoles().add(sellerRole);
        }

        User savedUser = userRepository.save(user);

        Instant now = Instant.now();

        String newRefreshToken = userAuthProvider.createRefreshToken();
        String accessToken = userAuthProvider.createAccessToken(savedUser.getId(), savedUser.getRoles(), now);

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(hashToken(newRefreshToken));
        refreshTokenEntity.setUser(savedUser);
        refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(registerDTO.isRememberMe() ? 30 : 1)));

        savedUser.getRefreshTokens().add(refreshTokenEntity);

        ActivateAccountToken activationToken = new ActivateAccountToken();

        String token = UUID.randomUUID().toString();

        activationToken.setActivationToken(hashToken(token));
        activationToken.setExpiryDate(Instant.now().plus(Duration.ofDays(7)));
        activationToken.setUser(savedUser);

        savedUser.getActivationTokens().add(activationToken);

        String message = """
            <html>
                <body>
                    <p>Hello %s, welcome to LocalHands!</p>
        
                    <p>Please confirm your email address by clicking the button below:</p>
        
                    <p><a href="%s">Confirm Email</a></p>
        
                    <p>This link will expire in 7 days. If you don’t confirm your email, your account will be automatically removed.</p>
        
                    <p>If this was not you, please click <a href="%s">here</a>.</p>
        
                    <p>Thanks,<br/>The LocalHands Team</p>
                </body>
            </html>
        """.formatted(savedUser.getFirstName(), baseUrl + "/activate-account?token=" + token, baseUrl + "/deactivate-account?token=" + token);

        emailSenderService.sendEmail(
                savedUser.getEmail(),"LocalHands Account Activation Confirmation", message);

        userRepository.save(savedUser);

        ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
        ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

        return new CookieResponseDTO(refreshCookie, accessCookie);
    }

    @Override
    public CookieResponseDTO loginUser(UserLoginRequestDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new AppException("Account does not exist. Consider signing up.", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            Instant now = Instant.now();

            String newRefreshToken = userAuthProvider.createRefreshToken();
            String accessToken = userAuthProvider.createAccessToken(user.getId(), user.getRoles(), now);

            RefreshToken refreshTokenEntity = new RefreshToken();
            refreshTokenEntity.setToken(hashToken(newRefreshToken));
            refreshTokenEntity.setUser(user);
            refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(loginDTO.isRememberMe() ? 30 : 1)));

            user.getRefreshTokens().add(refreshTokenEntity);

            userRepository.save(user);

            ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
            ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

            return new CookieResponseDTO(refreshCookie, accessCookie);
        }

        throw new AppException("Invalid password.", HttpStatus.UNAUTHORIZED);
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(hashToken(refreshToken));
    }

    @Override
    public UserInfoResponseDTO getUserInfoById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        return UserMapper.mapToUserInfoResponseDTO(user);
    }

    @Override
    public PublicProfileResponseDTO getPublicProfileById(Long requesterId, Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new AppException("User not found with id: " + targetUserId, HttpStatus.NOT_FOUND));

        if (!user.isPublicProfile() && !targetUserId.equals(requesterId)) {
            throw new AppException("This profile is private.", HttpStatus.FORBIDDEN);
        }

        return UserMapper.mapToPublicProfileResponseDTO(user, requesterId);
    }

    @Override
    public List<PublicProfileResponseDTO> searchForPublicProfiles(Long requesterId, String searchInput) {

        if (searchInput == null || searchInput.trim().length() < 3) {
            return List.of();
        }

        return userRepository.searchPublicProfiles(requesterId, searchInput)
                .stream()
                .map(profile -> UserMapper.mapToPublicProfileResponseDTO(profile, requesterId))
                .toList();
    }

    @Override
    public CookieResponseDTO updateUserAccount(Long userId, String refreshToken, UserAccountUpdateRequestDTO updateDTO) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        if (refreshToken == null) {
            throw new AppException("Missing refresh token.", HttpStatus.UNAUTHORIZED);
        }

        if (userRepository.existsByEmail(updateDTO.getEmail()) && !updateDTO.getEmail().equals(user.getEmail())) {
            throw new AppException("Account with updated email already exists.", HttpStatus.BAD_REQUEST);
        }

        if (updateDTO.getDateOfBirth() == null || updateDTO.getDateOfBirth().isAfter(LocalDate.now().minusYears(18))) {
            throw new AppException("You must be 18 or older.", HttpStatus.BAD_REQUEST);
        }

        if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {

            if (updateDTO.getExistingPassword() == null || updateDTO.getExistingPassword().isEmpty()) {
                throw new AppException("Current password is required to set a new password.", HttpStatus.BAD_REQUEST);
            }

            if (updateDTO.getNewPassword().length() < 8) {
                throw new AppException("New password must be at least 8 characters long.", HttpStatus.BAD_REQUEST);
            }

            if (!passwordEncoder.matches(updateDTO.getExistingPassword(), user.getPassword())) {
                throw new AppException("Invalid current password.", HttpStatus.UNAUTHORIZED);
            }

            user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        }

        user.setFirstName(updateDTO.getFirstName());
        user.setLastName(updateDTO.getLastName());
        user.setDateOfBirth(updateDTO.getDateOfBirth());

        if (!user.getEmail().equals(updateDTO.getEmail())) {

            NewEmailToken emailToken = new NewEmailToken();

            String token = UUID.randomUUID().toString();

            emailToken.setEmailToken(hashToken(token));
            emailToken.setNewEmail(updateDTO.getEmail());
            emailToken.setExpiryDate(Instant.now().plus(Duration.ofMinutes(10)));
            emailToken.setUser(user);

            user.getNewEmailTokens().clear();
            user.getNewEmailTokens().add(emailToken);

            String message = """
                <html>
                    <body>
                        <p>Hello %s,</p>
            
                        <p>Please confirm your new email address by clicking on the button below:</p>
            
                        <p><a href="%s">Confirm Email</a></p>
            
                        <p>It expires in 10 minutes.</p>
            
                        <p>After confirming, your new email will replace your old one.</p>
            
                        <p>If this was not you, please ignore this email.</p>
            
                        <p>Thanks,<br/>The LocalHands Team</p>
                    </body>
                </html>
            """.formatted(user.getFirstName(), baseUrl + "/confirm-email?token=" + token);

            emailSenderService.sendEmail(
                    updateDTO.getEmail(),"LocalHands Confirmation of New Email", message);
        }

        Role buyerRole = roleRepository.findByRoleName(RoleName.BUYER)
                .orElseThrow(() -> new AppException("Buyer role not found.", HttpStatus.INTERNAL_SERVER_ERROR));

        Role sellerRole = roleRepository.findByRoleName(RoleName.SELLER)
                .orElseThrow(() -> new AppException("Seller role not found.", HttpStatus.INTERNAL_SERVER_ERROR));

        user.getRoles().clear();
        user.getRoles().add(buyerRole);

        if (updateDTO.isServiceProvider()) {
            user.getRoles().add(sellerRole);
        } else {
            user.getRoles().removeIf(role -> role.getRoleName() == RoleName.SELLER);

            listingService.deleteListingsByUserId(user.getId());
        }

        Instant now = Instant.now();

        String newRefreshToken = userAuthProvider.createRefreshToken();
        String accessToken = userAuthProvider.createAccessToken(user.getId(), user.getRoles(), now);

        String hashed = hashToken(refreshToken);

        RefreshToken currentToken = user.getRefreshTokens().stream()
                .filter(t -> t.getToken().equals(hashed))
                .findFirst()
                .orElseThrow(() -> new AppException("Session not found.", HttpStatus.UNAUTHORIZED));

        Instant oldExpiry = currentToken.getExpiryDate();

        if (oldExpiry.isBefore(now)) {
            throw new AppException("Session expired.", HttpStatus.UNAUTHORIZED);
        }

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(hashToken(newRefreshToken));
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiryDate(oldExpiry);

        user.getRefreshTokens().removeIf(token ->
                token.getToken().equals(hashed)
        );

        user.getRefreshTokens().add(refreshTokenEntity);

        userRepository.save(user);

        ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
        ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

        return new CookieResponseDTO(refreshCookie, accessCookie);
    }

    @Override
    @Transactional
    public void confirmEmail(String token) {

        NewEmailToken emailToken = newEmailTokenRepository.findByEmailToken(hashToken(token))
                .orElseThrow(() -> new AppException("Invalid or expired token.", HttpStatus.UNAUTHORIZED));

        if (emailToken.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException("Token has expired.", HttpStatus.UNAUTHORIZED);
        }

        if (userRepository.existsByEmail(emailToken.getNewEmail())) {
            throw new AppException("The new email has now been taken.", HttpStatus.UNAUTHORIZED);
        }

        User user = emailToken.getUser();

        user.setEmail(emailToken.getNewEmail());

        newEmailTokenRepository.delete(emailToken);

        userRepository.save(user);
    }

    @Override
    public void resendActivationEmail(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found.", HttpStatus.NOT_FOUND));

        if (user.getActivationTokens().isEmpty()) {
            throw new AppException("Account is already activated.", HttpStatus.BAD_REQUEST);
        }

        ActivateAccountToken activationToken = new ActivateAccountToken();

        Instant expiry = user.getActivationTokens().get(0).getExpiryDate();

        user.getActivationTokens().clear();

        String token = UUID.randomUUID().toString();

        activationToken.setActivationToken(hashToken(token));
        activationToken.setExpiryDate(expiry);
        activationToken.setUser(user);

        user.getActivationTokens().add(activationToken);

        String message = """
            <html>
                <body>
                    <p>Hello %s,</p>

                    <p>We are resending this email so you can confirm your account:</p>
        
                    <p><a href="%s">Confirm Email</a></p>
        
                    <p>This link will expire 7 days after your initial account creation. If you don’t confirm your email, your account will be automatically removed.</p>
        
                    <p>If this was not you, please click <a href="%s">here</a>.</p>
        
                    <p>Thanks,<br/>The LocalHands Team</p>
                </body>
            </html>
        """.formatted(user.getFirstName(), baseUrl + "/activate-account?token=" + token, baseUrl + "/deactivate-account?token=" + token);

        userRepository.save(user);

        emailSenderService.sendEmail(
                user.getEmail(),"LocalHands Account Activation Confirmation (Resend)", message);
    }

    @Override
    @Transactional
    public void activateAccount(String token) {

        ActivateAccountToken activationToken = activateAccountTokenRepository.findByActivationToken(hashToken(token))
                .orElseThrow(() -> new AppException("Invalid or expired token.", HttpStatus.UNAUTHORIZED));

        if (activationToken.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException("Token has expired.", HttpStatus.UNAUTHORIZED);
        }

        activateAccountTokenRepository.delete(activationToken);
    }

    @Override
    @Transactional
    public void deactivateAccount(String token) {
        ActivateAccountToken activationToken = activateAccountTokenRepository.findByActivationToken(hashToken(token))
                .orElseThrow(() -> new AppException("Invalid or expired token.", HttpStatus.UNAUTHORIZED));

        User user = activationToken.getUser();

        activateAccountTokenRepository.delete(activationToken);

        deleteUser(user.getId());
    }

    @Override
    @Transactional
    public UserProfileUpdateResponseDTO updateUserProfile(Long userId, UserProfileUpdateRequestDTO updateDTO, MultipartFile photo) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        boolean shouldReset = updateDTO.isResetProfilePhoto();
        boolean hasNewPhoto = photo != null && !photo.isEmpty();

        if (shouldReset && hasNewPhoto) {
            throw new AppException("Cannot reset and upload a photo at the same time.", HttpStatus.BAD_REQUEST);
        }

        String savedFileUrl = null;

        try {
            user.setBio(updateDTO.getBio());

            if (shouldReset || hasNewPhoto) {
                for (ProfilePhoto existingPhoto : user.getProfilePhotos()) {
                    fileStorageService.delete(existingPhoto.getUrl());
                }

                user.getProfilePhotos().clear();
            }

            if (hasNewPhoto) {
                savedFileUrl = fileStorageService.save(photo, "uploads/profile-pictures/");

                ProfilePhoto profilePhoto = new ProfilePhoto();

                profilePhoto.setUrl(savedFileUrl);
                profilePhoto.setAltText("Image of " + user.getFirstName() + ".");
                profilePhoto.setUser(user);

                user.getProfilePhotos().add(profilePhoto);
            }

            userRepository.save(user);

            String finalPhotoUrl = user.getProfilePhotos().isEmpty()
                    ? null
                    : user.getProfilePhotos().get(0).getUrl();

            return new UserProfileUpdateResponseDTO(finalPhotoUrl, user.getBio());

        } catch (Exception e) {

            if (savedFileUrl != null) {
                fileStorageService.delete(savedFileUrl);
            }

            throw new AppException("Failed to update user profile.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void updateUserPrivacy(Long userId, UserPrivacyUpdateRequestDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        user.setPublicProfile(updateDTO.isPublicProfile());
        user.setMessagesEnabled(updateDTO.isMessagesAllowed());

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        for (ProfilePhoto photo : user.getProfilePhotos()) {
            fileStorageService.delete(photo.getUrl());
        }

        listingService.deleteListingsByUserId(userId);

        userRepository.deleteById(userId);
    }

}
