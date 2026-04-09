package com.localhands.backend.service;

import com.localhands.backend.dto.request.ReviewRequestDTO;
import com.localhands.backend.dto.request.UpdateReviewRequestDTO;
import com.localhands.backend.dto.response.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {

    ReviewResponseDTO addReview(Long userId, ReviewRequestDTO reviewRequestDTO);

    List<ReviewResponseDTO> getReviewsByUserId(Long userId);

    public ReviewResponseDTO updateReview(Long userId, UpdateReviewRequestDTO reviewRequestDTO);

    void deleteReviewById(Long userId, Long reviewId);

}
