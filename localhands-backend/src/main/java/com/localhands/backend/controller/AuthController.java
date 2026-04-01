package com.localhands.backend.controller;

import com.localhands.backend.dto.request.PasswordResetCodeRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.service.AuthService;
import com.localhands.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshAccessToken(@CookieValue(value = "refreshToken", required = false) String token) {
        try {
            if (token == null) {
                throw new AppException("Refresh token missing.", HttpStatus.UNAUTHORIZED);
            }

            CookieResponseDTO cookies = userService.generateNewTokenCookies(token);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                    .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                    .body("Created new refresh and access tokens.");
        } catch (AppException ex) {
            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();

            ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(0)
                    .sameSite("Strict")
                    .build();

            return ResponseEntity.status(ex.getStatus())
                    .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                    .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                    .body(ex.getMessage());
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Successfully set password reset code to " + email);
    }

    @PostMapping("/verify-password-reset-code")
    public ResponseEntity<String> verifyPasswordResetCode(@RequestBody PasswordResetCodeRequestDTO passwordResetCodeRequestDTO) {
        authService.verifyPasswordResetCode(passwordResetCodeRequestDTO.getEmail(), passwordResetCodeRequestDTO.getCode());
        return ResponseEntity.ok("Password reset code has been successfully verified.");
    }
}
