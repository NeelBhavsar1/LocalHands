package com.localhands.backend.mapper;

import com.localhands.backend.dto.response.ListingPhotoResponseDTO;
import com.localhands.backend.entity.ListingPhoto;

public class ListingPhotoMapper {

    public static ListingPhotoResponseDTO mapToListingPhotoResponseDTO(ListingPhoto listingPhoto) {
        return new ListingPhotoResponseDTO(
                listingPhoto.getId(),
                listingPhoto.getUrl(),
                listingPhoto.getAltText()
        );
    }
}
