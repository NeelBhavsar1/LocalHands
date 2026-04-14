package com.localhands.backend.mapper;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.CategoryResponseDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.entity.Listing;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.geom.PrecisionModel;

import java.util.stream.Collectors;

public class ListingMapper {

    public static final GeometryFactory geometryFactory = new GeometryFactory();

    public static Listing mapToListing(ListingRequestDTO requestDTO) {

        Listing listing = new Listing();

        listing.setName(requestDTO.getName());
        listing.setDescription(requestDTO.getDescription());
        listing.setLocation(createPoint(requestDTO.getLongitude(), requestDTO.getLatitude()));
        listing.setWorkType(requestDTO.getWorkType());

        return listing;
    }

    public static ListingResponseDTO mapToListingResponseDTO(Listing listing, Long requesterId) {
        Point point = listing.getLocation();

        return new ListingResponseDTO (
                listing.getId(),
                listing.getName(),
                listing.getDescription(),
                point.getY(),
                point.getX(),
                listing.getCreationTime(),
                listing.getUpdatedTime(),
                listing.getCategories()
                        .stream()
                        .map(cat -> new CategoryResponseDTO(
                                cat.getId(),
                                cat.getCategory().name()
                        ))
                        .toList(),
                listing.getWorkType(),
                listing.getPhotos()
                        .stream()
                        .map(ListingPhotoMapper::mapToListingPhotoResponseDTO)
                        .collect(Collectors.toList()),
                listing.getReviews()
                        .stream()
                        .map(rev -> ReviewMapper.mapToReviewResponseDTO(rev, requesterId))
                        .toList(),
                UserMapper.mapToListingSellerResponseDTO(listing.getUser())
        );
    }

    public static Point createPoint(Double lon, Double lat) {
        if (lon == null || lat == null) return null;

        GeometryFactory gf = new GeometryFactory(new PrecisionModel(), 4326); // ✅ SRID set

        Point point = gf.createPoint(new Coordinate(lon, lat));
        point.setSRID(4326); // ✅ (extra safety, but optional if factory has SRID)

        return point;
    }
}
