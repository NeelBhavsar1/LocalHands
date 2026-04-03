package com.localhands.backend.controller;

import com.localhands.backend.dto.request.PasswordResetCodeRequestDTO;
import com.localhands.backend.dto.request.PasswordResetRequestDTO;
import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.service.AuthService;
import com.localhands.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            @RequestBody UserRegisterRequestDTO requestDTO
    )
    {
        CookieResponseDTO cookies = userService.registerUser(requestDTO);

        if (refreshToken != null) {
            userService.logout(refreshToken);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                .body("Registered and logged in to new account.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(
            @CookieValue(value = "refreshToken", required = false) String refreshToken,
            @RequestBody UserLoginRequestDTO requestDTO
    )
    {
        CookieResponseDTO cookies = userService.loginUser(requestDTO);

        if (refreshToken != null) {
            userService.logout(refreshToken);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                .body("Logged in to account.");
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {

        if (refreshToken != null) {
            userService.logout(refreshToken);
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("refreshToken").toString())
                .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("accessToken").toString())
                .body("Logged out successfully.");
    }

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

            return ResponseEntity.status(ex.getStatus())
                    .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("refreshToken").toString())
                    .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("accessToken").toString())
                    .body(ex.getMessage());
        }
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<String> confirmEmail(@RequestParam String token) {
        userService.confirmEmail(token);
        return ResponseEntity.ok("Email confirmed successfully.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Successfully sent password reset code to " + email);
    }

    @PostMapping("/verify-password-reset-code")
    public ResponseEntity<String> verifyPasswordResetCode(@RequestBody PasswordResetCodeRequestDTO passwordResetCodeRequestDTO) {
        String token = authService.verifyPasswordResetCode(passwordResetCodeRequestDTO.getEmail(), passwordResetCodeRequestDTO.getCode());
        return ResponseEntity.ok(token);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetRequestDTO passwordResetRequestDTO) {
        authService.resetPassword(passwordResetRequestDTO.getEmail(), passwordResetRequestDTO.getToken(), passwordResetRequestDTO.getPassword());
        return ResponseEntity.ok("Successfully set new password.");
    }
}
