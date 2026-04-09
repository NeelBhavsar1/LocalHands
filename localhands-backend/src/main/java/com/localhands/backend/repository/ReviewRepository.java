package com.localhands.backend.repository;

import com.localhands.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByUserIdAndListingId(Long userId, Long listingId);

    List<Review> findByUserIdOrderByCreationTimeDesc(Long userId);

}
