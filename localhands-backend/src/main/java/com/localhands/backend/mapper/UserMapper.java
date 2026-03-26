package com.localhands.backend.mapper;

import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.response.UserAuthenticationResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.entity.User;

public class UserMapper {

    public static User mapToUser(UserRegisterRequestDTO requestDTO) {

        User user = new User();

        user.setFirstName(requestDTO.getFirstName());
        user.setLastName(requestDTO.getLastName());
        user.setEmail(requestDTO.getEmail());

        return user;
    }

    public static UserInfoResponseDTO mapToUserInfoResponseDTO(User user) {
        return new UserInfoResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRoles()
                        .stream()
                        .map(role -> role.getRoleName().name())
                        .toList());
    }
}
