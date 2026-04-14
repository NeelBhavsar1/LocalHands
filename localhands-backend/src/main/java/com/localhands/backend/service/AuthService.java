package com.localhands.backend.service;

import com.localhands.backend.dto.request.UserAccountUpdateRequestDTO;
import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;

public interface AuthService {
    public CookieResponseDTO generateNewTokenCookies(String refreshToken);

    public CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO);

    public CookieResponseDTO loginUser (UserLoginRequestDTO loginDto);

    public void logout(String refreshToken);

    public CookieResponseDTO updateUserAccount(Long userId, String refreshToken, UserAccountUpdateRequestDTO updateDTO);

    public void resendActivationEmail(Long userId);

    public void activateAccount(String token);

    public void deactivateAccount(String token);

    public void sendPasswordResetEmail(String email);

    public String verifyPasswordResetCode(String email, String code);

    public void resetPassword(String email, String token, String password);
}
