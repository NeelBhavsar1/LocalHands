package com.localhands.backend.service;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.CategoryResponseDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.entity.ListingWorkType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {
    public ListingResponseDTO createListing(Long userId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public List<ListingResponseDTO> getListingsByUserId(Long userId);

    public ListingResponseDTO getListingById(long requesterId, long listingId);

    public List<ListingResponseDTO> searchForPublicListings(Long requesterId, String searchInput, Double latitude, Double longitude, Double radius, List<Long> categoryIds, ListingWorkType workType);

    public List<CategoryResponseDTO> getAllCategories();

    public ListingResponseDTO updateListing(Long userId, long listingId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public void deleteListingById(long userId, long listingId);

    public void deleteListingsByUserId(Long userId);
}
