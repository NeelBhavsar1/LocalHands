package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.UserAccountUpdateRequestDTO;
import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.entity.*;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.UserMapper;
import com.localhands.backend.repository.ActivateAccountTokenRepository;
import com.localhands.backend.repository.RefreshTokenRepository;
import com.localhands.backend.repository.RoleRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.security.UserAuthProvider;
import com.localhands.backend.service.AuthService;
import com.localhands.backend.service.EmailSenderService;
import com.localhands.backend.service.ListingService;
import com.localhands.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static com.localhands.backend.util.TokenUtil.hashToken;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ListingService listingService;
    private final ActivateAccountTokenRepository activateAccountTokenRepository;
    private final UserService userService;
    private final UserAuthProvider userAuthProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailSenderService emailSenderService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.cors.allowed-origin}")
    private String baseUrl;


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

    @Override
    @Transactional
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

        userRepository.save(savedUser);

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
    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(hashToken(refreshToken));
    }


    @Override
    @Transactional
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

        String message = null;

        if (!user.getEmail().equals(updateDTO.getEmail())) {

            NewEmailToken emailToken = new NewEmailToken();

            String token = UUID.randomUUID().toString();

            emailToken.setEmailToken(hashToken(token));
            emailToken.setNewEmail(updateDTO.getEmail());
            emailToken.setExpiryDate(Instant.now().plus(Duration.ofMinutes(10)));
            emailToken.setUser(user);

            user.getNewEmailTokens().clear();
            user.getNewEmailTokens().add(emailToken);

            userRepository.save(user);

            message = """
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

        RefreshToken currentToken = refreshTokenRepository.findByToken(hashed)
                .orElseThrow(() -> new AppException("Invalid refresh token.", HttpStatus.UNAUTHORIZED));

        if (!currentToken.getUser().getId().equals(userId)) {
            throw new AppException("Invalid session.", HttpStatus.UNAUTHORIZED);
        }

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

        if (message != null) {
            emailSenderService.sendEmail(
                    updateDTO.getEmail(),"LocalHands Confirmation of New Email", message);
        }

        ResponseCookie refreshCookie = generateRefreshTokenCookie(newRefreshToken, now, refreshTokenEntity.getExpiryDate());
        ResponseCookie accessCookie = generateAccessTokenCookie(accessToken, now);

        return new CookieResponseDTO(refreshCookie, accessCookie);
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

        userRepository.save(user);

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

        userService.deleteUser(user.getId());
    }

    @Override
    @Transactional
    public void sendPasswordResetEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return;
        }

        User user = userOptional.get();

        SecureRandom random = new SecureRandom();
        String resetCode = String.format("%06d", random.nextInt(1000000));

        PasswordResetCode passwordResetCode = new PasswordResetCode();
        passwordResetCode.setCode(passwordEncoder.encode(resetCode));
        passwordResetCode.setExpiryDate(Instant.now().plus(Duration.ofMinutes(10)));
        passwordResetCode.setUser(user);

        user.getPasswordResetCodes().clear();
        user.getPasswordResetCodes().add(passwordResetCode);

        userRepository.save(user);

        String message = """
            <html>
                <body>
                    <p>Hello %s,</p>
        
                    <p>The code to reset your password is:</p>
        
                    <p><b>%s</b></p>
        
                    <p>It expires in 10 minutes, so resend another code if you need to.</p>
        
                    <p>If this was not you, please ignore this email.</p>
        
                    <p>Thanks,<br/>The LocalHands Team</p>
                </body>
            </html>
        """.formatted(user.getFirstName(), resetCode);

        emailSenderService.sendEmail(
                email,"LocalHands Password Reset Request", message);
    }

    @Override
    @Transactional(noRollbackFor = AppException.class)
    public String verifyPasswordResetCode(String email, String code) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED));

        if (user.getPasswordResetCodes().isEmpty()) {
            throw new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED);
        }

        boolean failed = false;

        PasswordResetCode resetCode = user.getPasswordResetCodes().getFirst();

        if (resetCode.getAttempts() >= 5) {
            user.getPasswordResetCodes().clear();
            userRepository.save(user);
            throw new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED);
        }

        if (!passwordEncoder.matches(code, resetCode.getCode())) {
            failed = true;
        }

        if (resetCode.getExpiryDate().isBefore(Instant.now())) {
            failed = true;
        }

        if (failed) {
            resetCode.setAttempts(resetCode.getAttempts() + 1);
            userRepository.save(user);
            throw new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED);
        } else {
            String token = UUID.randomUUID().toString();
            resetCode.setResetToken(passwordEncoder.encode(token));

            userRepository.save(user);

            return token;
        }
    }

    @Override
    @Transactional
    public void resetPassword(String email, String token, String password) {

        if (password == null || password.length() < 8) {
            throw new AppException("Password must be at least 8 characters long.", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Failed to reset password.", HttpStatus.UNAUTHORIZED));

        if (user.getPasswordResetCodes().isEmpty()) {
            throw new AppException("Failed to reset password.", HttpStatus.UNAUTHORIZED);
        }

        PasswordResetCode resetCode = user.getPasswordResetCodes().getFirst();

        if (resetCode.getResetToken() == null) {
            throw new AppException("Failed to reset password.", HttpStatus.UNAUTHORIZED);
        }

        if (resetCode.getExpiryDate().isBefore(Instant.now())) {
            user.getPasswordResetCodes().clear();
            userRepository.save(user);
            throw new AppException("Failed to reset password.", HttpStatus.UNAUTHORIZED);
        }

        if (!passwordEncoder.matches(token, resetCode.getResetToken())) {
            throw new AppException("Failed to reset password.", HttpStatus.UNAUTHORIZED);
        }

        user.setPassword(passwordEncoder.encode(password));

        user.getPasswordResetCodes().clear();
        userRepository.save(user);
    }

}
