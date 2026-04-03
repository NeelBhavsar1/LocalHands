package com.localhands.backend.service;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {
    public ListingResponseDTO createListing(Long userId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public List<ListingResponseDTO> getListingsByUserId(Long userId);

    public ListingResponseDTO getListing(long id);

    public List<ListingResponseDTO> getListingsWithinRadius(double lat, double lon, double radius);

    public ListingResponseDTO updateListing(Long userId, long listingId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public void deleteListing(long userId, long listingId);

    public void deleteListingsByUserId(Long userId);
}
