package com.localhands.backend.controller;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.service.ListingService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private ListingService listingService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponseDTO> createListing (
            @RequestPart("listing") ListingRequestDTO listingRequestDTO,
            @RequestPart("photos") List<MultipartFile> photos,
            @RequestParam("altTexts") List<String> altTexts
    ) {
        ListingResponseDTO listingResponseDTO = listingService.createListing(listingRequestDTO, photos, altTexts);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @GetMapping
    public ResponseEntity<ListingResponseDTO> getListingById(@RequestParam Long listingId) {
        ListingResponseDTO listingResponseDTO = listingService.getListing(listingId);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @GetMapping("/radius")
    public ResponseEntity<List<ListingResponseDTO>> getListingsWithinRadius(@RequestParam double latitude, @RequestParam double longitude, @RequestParam double radius) {
        List<ListingResponseDTO> listingResponseDTO = listingService.getListingsWithinRadius(latitude, longitude, radius);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @PutMapping(consumes = "multipart/form-data")
    public ResponseEntity<ListingResponseDTO> updateListing (
            @RequestPart("listing") ListingRequestDTO listingRequestDTO,
            @RequestPart("photos") List<MultipartFile> photos,
            @RequestParam("altTexts") List<String> altTexts,
            @RequestParam("listingId") Long listingId
    ) {
        ListingResponseDTO listingResponseDTO = listingService.updateListing(listingId, listingRequestDTO, photos, altTexts);
        return ResponseEntity.ok(listingResponseDTO);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteListingById(@RequestParam Long listingId) {
        listingService.deleteListing(listingId);
        return ResponseEntity.ok("Listing deleted successfully");
    }
}
