package com.localhands.backend.service;

import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.request.UserUpdateRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;

public interface UserService {
    CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO);

    CookieResponseDTO loginUser (UserLoginRequestDTO loginDto);

    UserInfoResponseDTO getUserInfoById(Long userId);

    CookieResponseDTO updateUser(Long userId, UserUpdateRequestDTO updateDTO);

    void deleteUser(Long userId);
}
