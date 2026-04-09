package com.localhands.backend.repository;

import com.localhands.backend.entity.ListingCategory;
import com.localhands.backend.entity.ListingCategoryName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListingCategoryRepository extends JpaRepository<ListingCategory, Long> {

    boolean existsByCategory(ListingCategoryName listingCategoryName);

    List<ListingCategory> findByIdIn(List<Long> categoryIds);
}
