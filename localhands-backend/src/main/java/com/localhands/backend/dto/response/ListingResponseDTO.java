package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponseDTO {
    private Long listingId;
    private String name;
    private String description;
    private double latitude;
    private double longitude;
    private Instant creationTime;
    private Instant updatedTime;
    private List<CategoryResponseDTO> categories;
    private List<ListingPhotoResponseDTO> photos;
    private List<ReviewResponseDTO> reviews;
    private ListingSellerResponseDTO seller;
}
