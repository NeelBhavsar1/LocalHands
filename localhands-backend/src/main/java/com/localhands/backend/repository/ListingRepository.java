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
        WHERE (
            u.public_profile = true OR u.id = :requesterId
        )
        AND EXISTS (
            SELECT 1
            FROM listing_categories lc2
            WHERE lc2.listing_id = l.id
            AND lc2.category_id IN (:categoryIds)
        )
        HAVING distance <= :radius
        ORDER BY distance
    """, nativeQuery = true)
    List<Listing> findWithinRadiusWithCategories(
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
        WHERE (
            u.public_profile = true OR u.id = :requesterId
        )
        HAVING distance <= :radius
        ORDER BY distance
    """, nativeQuery = true)
    List<Listing> findWithinRadiusWithoutCategories(
            @Param("requesterId") Long requesterId,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );

    @Query(value = """
        SELECT DISTINCT l.*, 
            ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        AND EXISTS (
            SELECT 1
            FROM listing_categories lc2
            WHERE lc2.listing_id = l.id
            AND lc2.category_id IN (:categoryIds)
        )
        ORDER BY distance
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchWithLocationWithCategories(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("categoryIds") List<Long> categoryIds
    );

    @Query(value = """
        SELECT DISTINCT l.*, 
            ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        ORDER BY distance
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchWithLocationWithoutCategories(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("lat") double lat,
            @Param("lon") double lon
    );

    @Query(value = """
        SELECT DISTINCT l.*
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        AND EXISTS (
            SELECT 1
            FROM listing_categories lc2
            WHERE lc2.listing_id = l.id
            AND lc2.category_id IN (:categoryIds)
        )
        ORDER BY l.id DESC
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchWithoutLocationWithCategories(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("categoryIds") List<Long> categoryIds
    );

    @Query(value = """
        SELECT DISTINCT l.*
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        ORDER BY l.id DESC
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchWithoutLocationWithoutCategories(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput
    );

    List<Listing> findByUserIdOrderByCreationTimeDesc(Long userId);
}
