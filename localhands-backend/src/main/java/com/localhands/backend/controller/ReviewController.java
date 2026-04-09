package com.localhands.backend.controller;

import com.localhands.backend.dto.request.ReviewRequestDTO;
import com.localhands.backend.dto.request.UpdateReviewRequestDTO;
import com.localhands.backend.dto.response.ReviewResponseDTO;
import com.localhands.backend.security.UserPrincipal;
import com.localhands.backend.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> addReview(@AuthenticationPrincipal UserPrincipal user, @RequestBody ReviewRequestDTO reviewRequestDTO) {
        ReviewResponseDTO review = reviewService.addReview(user.getId(), reviewRequestDTO);
        return ResponseEntity.ok(review);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsBelongingToUser(@AuthenticationPrincipal UserPrincipal user) {
        List<ReviewResponseDTO> reviews = reviewService.getReviewsByUserId(user.getId());
        return ResponseEntity.ok(reviews);
    }

    @PutMapping
    public ResponseEntity<ReviewResponseDTO> updateReview(@AuthenticationPrincipal UserPrincipal user, @RequestBody UpdateReviewRequestDTO updateReviewRequestDTO) {
        ReviewResponseDTO review = reviewService.updateReview(user.getId(), updateReviewRequestDTO);
        return ResponseEntity.ok(review);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteReview(@AuthenticationPrincipal UserPrincipal user, @RequestParam Long reviewId) {
        reviewService.deleteReviewById(user.getId(), reviewId);
        return ResponseEntity.ok("Review deleted successfully.");
    }
}
