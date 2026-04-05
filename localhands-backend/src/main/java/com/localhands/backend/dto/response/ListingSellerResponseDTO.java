package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingSellerResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private ProfilePhotoResponseDTO profilePhoto;
}
