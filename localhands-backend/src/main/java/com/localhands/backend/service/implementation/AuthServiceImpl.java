package com.localhands.backend.service.implementation;

import com.localhands.backend.entity.PasswordResetCode;
import com.localhands.backend.entity.User;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.service.AuthService;
import com.localhands.backend.service.EmailSenderService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

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
        String resetCode = String.valueOf(random.nextInt(1000000));

        for (int i = 0; i < 6 - resetCode.length(); i++) {
            resetCode = "0" + resetCode;
        }

        PasswordResetCode passwordResetCode = new PasswordResetCode();
        passwordResetCode.setCode(passwordEncoder.encode(resetCode));
        passwordResetCode.setExpiryDate(Instant.now().plus(Duration.ofMinutes(10)));
        passwordResetCode.setUser(user);

        user.getPasswordResetCodes().clear();
        user.getPasswordResetCodes().add(passwordResetCode);

        userRepository.save(user);

        String message = "Hello, the code to reset your password is:\n\n" +
                resetCode +
                "\n\nIt expires in 10 minutes." +
                "\n\nIf this was not you, please ignore this email." +
                "\n\nThanks,\nThe LocalHands Team";

        emailSenderService.sendEmail(
                email,"LocalHands Password Reset Request", message);
    }

    @Override
    @Transactional
    public void verifyPasswordResetCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED));

        if (user.getPasswordResetCodes().isEmpty()) {
            throw new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED);
        }

        PasswordResetCode resetCode = user.getPasswordResetCodes().getFirst();

        if (resetCode.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException("Code expired.", HttpStatus.UNAUTHORIZED);
        }

        if (!passwordEncoder.matches(code, resetCode.getCode())) {
            throw new AppException("Failed to verify code.", HttpStatus.UNAUTHORIZED);
        }

        user.getPasswordResetCodes().clear();
        userRepository.save(user);
    }
}
