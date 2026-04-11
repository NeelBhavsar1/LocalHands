package com.localhands.backend.repository;

import com.localhands.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(value = """
        SELECT DISTINCT l.*, 
            CASE 
                WHEN :lat IS NOT NULL AND :lon IS NOT NULL
                THEN ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326))
                ELSE NULL
            END AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN listing_categories lc ON l.id = lc.listing_id
        WHERE 
            (u.public_profile = true OR u.id = :requesterId)
    
            AND (:searchInput IS NULL 
                OR LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
                OR LOWER(l.description) LIKE LOWER(CONCAT('%', :searchInput, '%'))
            )
    
            AND (l.work_type IN (:workTypes))
    
            AND (
                :hasCategories = false
                OR lc.category_id IN (:categoryIds)
            )
    
            AND (
                :lat IS NULL OR :lon IS NULL OR :radius IS NULL
                OR ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) <= :radius
            )
    
        ORDER BY 
            CASE 
                WHEN :lat IS NULL OR :lon IS NULL THEN l.id
                ELSE distance
            END
    """, nativeQuery = true)
    List<Listing> searchListings(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("lat") Double lat,
            @Param("lon") Double lon,
            @Param("radius") Double radius,
            @Param("categoryIds") List<Long> categoryIds,
            @Param("hasCategories") boolean hasCategories,
            @Param("workTypes") List<String> workTypes
    );

    List<Listing> findByUserIdOrderByCreationTimeDesc(Long userId);
}
