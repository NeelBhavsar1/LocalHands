package com.localhands.backend.mapper;

import com.localhands.backend.dto.response.ReviewResponseDTO;
import com.localhands.backend.entity.Review;

public class ReviewMapper {

    public static ReviewResponseDTO mapToReviewResponseDTO(Review review, Long requesterId) {

        Long reviewerId = review.getUser().getId();
        boolean isOwner = reviewerId.equals(requesterId);
        boolean isPublicProfile = review.getUser().isPublicProfile();

        boolean canSeeFullProfile = isPublicProfile || isOwner;

        return new ReviewResponseDTO(
                review.getId(),
                review.getRating(),
                review.getReviewBody(),
                review.getCreationTime(),
                review.getListing().getId(),
                reviewerId,
                canSeeFullProfile
                        ? review.getUser().getFirstName() + " " + review.getUser().getLastName()
                        : "Private Account",
                canSeeFullProfile &&
                        review.getUser().getProfilePhotos() != null &&
                        !review.getUser().getProfilePhotos().isEmpty()
                        ? review.getUser().getProfilePhotos().getFirst().getUrl()
                        : null
        );
    }
}
