package com.localhands.backend.mapper;

import com.localhands.backend.dto.response.ProfilePhotoResponseDTO;
import com.localhands.backend.entity.ProfilePhoto;

public class ProfilePhotoMapper {

    public static ProfilePhotoResponseDTO mapToProfilePhotoResponseDTO(ProfilePhoto profilePhoto) {
        return new ProfilePhotoResponseDTO(
                profilePhoto.getId(),
                profilePhoto.getUrl(),
                profilePhoto.getAltText()
        );
    }
}
