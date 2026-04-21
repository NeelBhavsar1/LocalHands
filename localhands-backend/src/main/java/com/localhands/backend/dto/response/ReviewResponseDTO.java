package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long id;
    private int rating;
    private String reviewBody;
    private Instant creationTime;

    private Long listingId;
    private String listingName;

    private Long userId;
    private String userName;
    private String userProfilePhoto;
}
