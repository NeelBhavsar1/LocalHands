package com.localhands.backend.controller;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.CategoryResponseDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.security.UserPrincipal;
import com.localhands.backend.service.ListingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private ListingService listingService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponseDTO> createListing (
            @AuthenticationPrincipal UserPrincipal user,
            @RequestPart("listing") ListingRequestDTO listingRequestDTO,
            @RequestPart("photos") List<MultipartFile> photos,
            @RequestParam("altTexts") List<String> altTexts
    ) {
        ListingResponseDTO listingResponseDTO = listingService.createListing(user.getId(), listingRequestDTO, photos, altTexts);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<List<ListingResponseDTO>> getListingsBelongingToUser(@AuthenticationPrincipal UserPrincipal user) {
        List<ListingResponseDTO> listingResponseDTOs = listingService.getListingsByUserId(user.getId());
        return ResponseEntity.ok(listingResponseDTOs);
    }

    @GetMapping("/id")
    public ResponseEntity<ListingResponseDTO> getPublicListingById(@AuthenticationPrincipal UserPrincipal user, @RequestParam Long listingId) {
        ListingResponseDTO listingResponseDTO = listingService.getListingById(user.getId(), listingId);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @GetMapping("/radius")
    public ResponseEntity<List<ListingResponseDTO>> getPublicListingsWithinRadius(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam double radius,
            @RequestParam List<Long> categoryIds
    ) {
        List<ListingResponseDTO> listingResponseDTOs = listingService.getListingsWithinRadius(user.getId(), latitude, longitude, radius, categoryIds);
        return ResponseEntity.ok(listingResponseDTOs);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ListingResponseDTO>> searchPublicListings(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam String searchInput,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam List<Long> categoryIds
    ) {
        List<ListingResponseDTO> listingResponseDTOs;

        if (latitude != null && longitude != null) {
            listingResponseDTOs = listingService.searchForListingsWithLocation(user.getId(), searchInput, latitude, longitude, categoryIds);
        } else {
            listingResponseDTOs = listingService.searchForListings(user.getId(), searchInput, categoryIds);
        }

        return ResponseEntity.ok(listingResponseDTOs);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategories() {
        List<CategoryResponseDTO> categories = listingService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponseDTO> updateListing (
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam("listingId") Long listingId,
            @RequestPart("listing") ListingRequestDTO listingRequestDTO,
            @RequestPart("photos") List<MultipartFile> photos,
            @RequestParam("altTexts") List<String> altTexts
    ) {
        ListingResponseDTO listingResponseDTO = listingService.updateListing(user.getId(), listingId, listingRequestDTO, photos, altTexts);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteListingById(@AuthenticationPrincipal UserPrincipal user, @RequestParam Long listingId) {
        listingService.deleteListingById(user.getId(), listingId);
        return ResponseEntity.ok("Listing deleted successfully.");
    }
}
