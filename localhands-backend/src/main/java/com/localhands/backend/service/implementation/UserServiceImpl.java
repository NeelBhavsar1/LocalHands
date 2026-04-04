package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserProfileUpdateRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.request.UserAccountUpdateRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.entity.*;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.UserMapper;
import com.localhands.backend.repository.NewEmailTokenRepository;
import com.localhands.backend.repository.RefreshTokenRepository;
import com.localhands.backend.repository.RoleRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.security.UserAuthProvider;
import com.localhands.backend.service.EmailSenderService;
import com.localhands.backend.service.FileStorageService;
import com.localhands.backend.service.ListingService;
import com.localhands.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
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
            @Value("${app.cors.allowed-origin}") String baseUrl
    ) {
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

        refreshTokenRepository.delete(tokenEntity);

        User user = tokenEntity.getUser();

        Instant now = Instant.now();

        String newRefreshToken = userAuthProvider.createRefreshToken();
        String accessToken = userAuthProvider.createAccessToken(user.getId(), user.getRoles(), now);

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(hashToken(newRefreshToken));
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(1)));

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
        refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(1)));

        savedUser.getRefreshTokens().add(refreshTokenEntity);

        userRepository.save(savedUser);

        ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
        ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

        return new CookieResponseDTO(refreshCookie, accessCookie);
    }

    @Override
    public CookieResponseDTO loginUser(UserLoginRequestDTO loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new AppException("Account does not exist. Consider signing up.", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            Instant now = Instant.now();

            String newRefreshToken = userAuthProvider.createRefreshToken();
            String accessToken = userAuthProvider.createAccessToken(user.getId(), user.getRoles(), now);

            RefreshToken refreshTokenEntity = new RefreshToken();
            refreshTokenEntity.setToken(hashToken(newRefreshToken));
            refreshTokenEntity.setUser(user);
            refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(1)));

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
    public CookieResponseDTO updateUserAccount(Long userId, UserAccountUpdateRequestDTO updateDTO) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        if (userRepository.existsByEmail(updateDTO.getEmail()) && !updateDTO.getEmail().equals(user.getEmail())) {
            throw new AppException("Account with updated email already exists.", HttpStatus.BAD_REQUEST);
        }

        if (updateDTO.getDateOfBirth() == null || updateDTO.getDateOfBirth().isAfter(LocalDate.now().minusYears(18))) {
            throw new AppException("You must be 18 or older.", HttpStatus.BAD_REQUEST);
        }

        if (!passwordEncoder.matches(updateDTO.getExistingPassword(), user.getPassword())) {
            throw new AppException("Invalid password.", HttpStatus.UNAUTHORIZED);
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

        if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
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

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setToken(hashToken(newRefreshToken));
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiryDate(now.plus(Duration.ofDays(1)));

        user.getRefreshTokens().clear();
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
    @Transactional
    public void updateUserProfile(Long userId, UserProfileUpdateRequestDTO updateDTO, MultipartFile photo) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        String savedFileUrl = null;

        try {
            user.setBio(updateDTO.getBio());

            for (ProfilePhoto existingPhoto : user.getProfilePhotos()) {
                fileStorageService.delete(existingPhoto.getUrl());
            }

            user.getProfilePhotos().clear();

            if (photo != null && !photo.isEmpty()) {
                savedFileUrl = fileStorageService.save(photo, "uploads/profile-pictures/");

                ProfilePhoto profilePhoto = new ProfilePhoto();

                profilePhoto.setUrl(savedFileUrl);
                profilePhoto.setAltText("Image of " + user.getFirstName() + ".");
                profilePhoto.setUser(user);

                user.getProfilePhotos().add(profilePhoto);
            }

            userRepository.save(user);

        } catch (Exception e) {

            if (savedFileUrl != null) {
                fileStorageService.delete(savedFileUrl);
            }

            throw new AppException("Failed to update user profile.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
