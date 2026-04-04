package com.localhands.backend.service;

import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserProfileUpdateRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.request.UserAccountUpdateRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    CookieResponseDTO generateNewTokenCookies(String refreshToken);

    CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO);

    CookieResponseDTO loginUser (UserLoginRequestDTO loginDto);

    void logout(String refreshToken);

    UserInfoResponseDTO getUserInfoById(Long userId);

    CookieResponseDTO updateUserAccount(Long userId, UserAccountUpdateRequestDTO updateDTO);

    void confirmEmail(String token);

    void updateUserProfile(Long userId, UserProfileUpdateRequestDTO updateDTO, MultipartFile photo);

    void deleteUser(Long userId);
}
