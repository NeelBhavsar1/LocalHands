package com.localhands.backend.service;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.dto.response.PublicProfileResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {
    public ListingResponseDTO createListing(Long userId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public List<ListingResponseDTO> getListingsByUserId(Long userId);

    public ListingResponseDTO getListingById(long requesterId, long listingId);

    public List<ListingResponseDTO> getListingsWithinRadius(Long requesterId, double lat, double lon, double radius);

    public List<ListingResponseDTO> searchForListingsWithLocation(Long requesterId, String searchInput, double latitude, double longitude);

    public List<ListingResponseDTO> searchForListings(Long requesterId, String searchInput);

    public ListingResponseDTO updateListing(Long userId, long listingId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public void deleteListingById(long userId, long listingId);

    public void deleteListingsByUserId(Long userId);
}
