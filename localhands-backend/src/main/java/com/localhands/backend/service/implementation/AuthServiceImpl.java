package com.localhands.backend.service.implementation;

import com.localhands.backend.entity.PasswordResetCode;
import com.localhands.backend.entity.User;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.service.AuthService;
import com.localhands.backend.service.EmailSenderService;
import org.springframework.transaction.annotation.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private UserRepository userRepository;
    private EmailSenderService emailSenderService;
    private PasswordEncoder passwordEncoder;

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
