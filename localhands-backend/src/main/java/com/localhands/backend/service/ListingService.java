package com.localhands.backend.service;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ListingService {
    public ListingResponseDTO createListing(ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public ListingResponseDTO getListing(long id);

    public List<ListingResponseDTO> getListingsWithinRadius(double lat, double lon, double radius);

    public ListingResponseDTO updateListing(long id, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts);

    public void deleteListing(long id);
}
