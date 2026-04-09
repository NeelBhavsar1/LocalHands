package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.ReviewRequestDTO;
import com.localhands.backend.dto.request.UpdateReviewRequestDTO;
import com.localhands.backend.dto.response.ReviewResponseDTO;
import com.localhands.backend.entity.Listing;
import com.localhands.backend.entity.Review;
import com.localhands.backend.entity.User;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.ReviewMapper;
import com.localhands.backend.repository.ListingRepository;
import com.localhands.backend.repository.ReviewRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ListingRepository listingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ReviewResponseDTO addReview(Long userId, ReviewRequestDTO reviewRequestDTO) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found.", HttpStatus.NOT_FOUND));

        Listing listing = listingRepository.findById(reviewRequestDTO.getListingId())
                .orElseThrow(() -> new AppException("Listing not found.", HttpStatus.NOT_FOUND));

        if (listing.getUser().getId().equals(userId)) {
            throw new AppException("You cannot review your own listing.", HttpStatus.BAD_REQUEST);
        }

        if (reviewRepository.existsByUserIdAndListingId(userId, listing.getId())) {
            throw new AppException("You have already reviewed this listing.", HttpStatus.BAD_REQUEST);
        }

        if (reviewRequestDTO.getRating() < 1 || reviewRequestDTO.getRating() > 5) {
            throw new AppException("Rating must be between 1 and 5 inclusive.", HttpStatus.BAD_REQUEST);
        }

        Review review = new Review();
        review.setRating(reviewRequestDTO.getRating());
        review.setReviewBody(reviewRequestDTO.getReviewBody());
        review.setUser(user);
        review.setListing(listing);

        Review savedReview = reviewRepository.save(review);

        return ReviewMapper.mapToReviewResponseDTO(savedReview, userId);
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserIdOrderByCreationTimeDesc(userId)
                .stream()
                .map(rev -> ReviewMapper.mapToReviewResponseDTO(rev, userId))
                .toList();
    }

    @Override
    @Transactional
    public ReviewResponseDTO updateReview(Long userId, UpdateReviewRequestDTO reviewRequestDTO) {

        Review review = reviewRepository.findById(reviewRequestDTO.getReviewId())
                .orElseThrow(() -> new AppException("Review not found.", HttpStatus.NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new AppException("You are not allowed to update this review.", HttpStatus.FORBIDDEN);
        }

        if (reviewRequestDTO.getRating() < 1 || reviewRequestDTO.getRating() > 5) {
            throw new AppException("Rating must be between 1 and 5 inclusive.", HttpStatus.BAD_REQUEST);
        }

        review.setRating(reviewRequestDTO.getRating());
        review.setReviewBody(reviewRequestDTO.getReviewBody());

        Review updatedReview = reviewRepository.save(review);

        return ReviewMapper.mapToReviewResponseDTO(updatedReview, userId);
    }

    @Override
    @Transactional
    public void deleteReviewById(Long userId, Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException("Review not found.", HttpStatus.NOT_FOUND));

        if (!review.getUser().getId().equals(userId)) {
            throw new AppException("You are not allowed to delete this review.", HttpStatus.FORBIDDEN);
        }

        reviewRepository.delete(review);
    }
}
