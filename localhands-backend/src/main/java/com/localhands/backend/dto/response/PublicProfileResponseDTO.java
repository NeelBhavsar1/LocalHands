package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PublicProfileResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String bio;
    private List<String> roles;
    private ProfilePhotoResponseDTO profilePhoto;
    private List<ListingResponseDTO> listings;
    private List<ReviewResponseDTO> reviews;
}
