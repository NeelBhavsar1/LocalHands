package com.localhands.backend.mapper;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.entity.Listing;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;

import java.util.stream.Collectors;

public class ListingMapper {

    public static final GeometryFactory geometryFactory = new GeometryFactory();

    public static Listing mapToListing(ListingRequestDTO requestDTO) {

        Listing listing = new Listing();

        listing.setName(requestDTO.getName());
        listing.setDescription(requestDTO.getDescription());
        listing.setLocation(createPoint(requestDTO.getLongitude(), requestDTO.getLatitude()));

        return listing;
    }

    public static ListingResponseDTO mapToListingResponseDTO(Listing listing) {
        Point point = listing.getLocation();

        return new ListingResponseDTO (
                listing.getId(),
                listing.getName(),
                listing.getDescription(),
                point.getY(),
                point.getX(),
                listing.getCreationTime(),
                listing.getUpdatedTime(),
                listing.getPhotos()
                        .stream()
                        .map(ListingPhotoMapper::mapToListingPhotoResponseDTO)
                        .collect(Collectors.toList()),
                UserMapper.mapToListingSellerResponseDTO(listing.getUser())
        );
    }

    public static Point createPoint(double longitude, double latitude) {
        Point point = geometryFactory.createPoint(new Coordinate(longitude, latitude));

        point.setSRID(4326);

        return point;
    }
}
