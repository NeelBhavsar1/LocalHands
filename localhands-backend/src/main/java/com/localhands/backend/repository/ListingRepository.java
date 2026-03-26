package com.localhands.backend.repository;

import com.localhands.backend.entity.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    @Query(value = """
    SELECT *, ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) AS distance
    FROM listings l
    WHERE ST_Distance_Sphere(l.location, ST_SRID(POINT(:lon, :lat), 4326)) <= :radius
    ORDER BY distance
    """, nativeQuery = true)
    List<Listing> findListingsWithinRadiusOrderByDistance(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radius") double radius
    );

    List<Listing> findByUserId(Long userId);
}
