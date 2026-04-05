package com.localhands.backend.repository;

import com.localhands.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Arrays;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(value = """
        SELECT l.*, ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE (
            u.public_profile = true OR u.id = :requesterId
        )
        HAVING distance <= :radius
        ORDER BY distance
    """, nativeQuery = true)
    List<Listing> findPublicListingsWithinRadiusOrderByDistance(
            @Param("requesterId") Long requesterId,
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );

    @Query(value = """
        SELECT l.*, ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
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
    List<Listing> searchPublicListingsWithLocation(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput,
            @Param("lat") double lat,
            @Param("lon") double lon
    );

    @Query(value = """
        SELECT l.*
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        ORDER BY RAND()
        LIMIT 20
    """, nativeQuery = true)
    List<Listing> searchPublicListings(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput
    );

    List<Listing> findByUserIdOrderByCreationTimeDesc(Long userId);
}
