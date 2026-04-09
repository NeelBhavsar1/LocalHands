package com.localhands.backend.repository;

import com.localhands.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(value = """
        SELECT DISTINCT l.*, 
            ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN listing_categories lc ON l.id = lc.listing_id
        WHERE (
            u.public_profile = true OR u.id = :requesterId
        )
        AND (
            :categoryIds IS NULL OR lc.category_id IN (:categoryIds)
        )
        HAVING distance <= :radius
        ORDER BY distance
    """, nativeQuery = true)
    List<Listing> findPublicListingsWithinRadiusOrderByDistance(
            @Param("requesterId") Long requesterId,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius,
            @Param("categoryIds") List<Long> categoryIds
    );

    @Query(value = """
        SELECT DISTINCT l.*, 
            ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN listing_categories lc ON l.id = lc.listing_id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        AND (
            :categoryIds IS NULL OR lc.category_id IN (:categoryIds)
        )
        ORDER BY distance
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchPublicListingsWithLocation(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("categoryIds") List<Long> categoryIds
    );

    @Query(value = """
        SELECT DISTINCT l.*
        FROM listings l
        JOIN users u ON l.user_id = u.id
        LEFT JOIN listing_categories lc ON l.id = lc.listing_id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        AND (
            :categoryIds IS NULL OR lc.category_id IN (:categoryIds)
        )
        ORDER BY RAND()
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchPublicListings(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("categoryIds") List<Long> categoryIds
    );

    List<Listing> findByUserIdOrderByCreationTimeDesc(Long userId);
}
