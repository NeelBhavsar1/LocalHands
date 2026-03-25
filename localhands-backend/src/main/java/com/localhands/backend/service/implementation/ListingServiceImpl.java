package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.entity.Listing;
import com.localhands.backend.entity.ListingPhoto;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.ListingMapper;
import com.localhands.backend.repository.ListingRepository;
import com.localhands.backend.service.FileStorageService;
import com.localhands.backend.service.ListingService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ListingServiceImpl implements ListingService {

    private ListingRepository listingRepository;
    private FileStorageService fileStorageService;

    @Override
    @Transactional
    public ListingResponseDTO createListing(ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts) {

        Listing listing = ListingMapper.mapToListing(requestDTO);

        List<ListingPhoto> photos = new ArrayList<>();
        List<String> savedFileUrls = new ArrayList<>();

        try {
            for (int i = 0; i < photoFiles.size(); i++) {
                MultipartFile photoFile = photoFiles.get(i);
                String altText = altTexts.get(i);

                String url = fileStorageService.save(photoFile);
                savedFileUrls.add(url);

                ListingPhoto photo = new ListingPhoto();
                photo.setUrl(url);
                photo.setAltText(altText);
                photo.setListing(listing);

                photos.add(photo);
            }

            listing.setPhotos(photos);

            Listing savedListing = listingRepository.save(listing);

            return ListingMapper.mapToListingResponseDTO(savedListing);

        } catch (Exception e) {
            for (String url : savedFileUrls) {
                fileStorageService.delete(url);
            }

            throw new AppException("Failed to create listing.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ListingResponseDTO getListing(long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new AppException("Listing not found with id: " + id, HttpStatus.NOT_FOUND));

        return ListingMapper.mapToListingResponseDTO(listing);
    }

    @Override
    public List<ListingResponseDTO> getListingsWithinRadius(double lat, double lon, double radius) {
        return listingRepository.findListingsWithinRadiusOrderByDistance(lat, lon, radius)
                .stream()
                .map(ListingMapper::mapToListingResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ListingResponseDTO updateListing(long id, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts) {

        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new AppException("Listing not found with id: " + id, HttpStatus.NOT_FOUND));

        List<String> savedFileUrls = new ArrayList<>();

        try {
            listing.setName(requestDTO.getName());
            listing.setDescription(requestDTO.getDescription());
            listing.setLocation(
                    ListingMapper.createPoint(requestDTO.getLongitude(), requestDTO.getLatitude())
            );

            for (ListingPhoto photo : listing.getPhotos()) {
                fileStorageService.delete(photo.getUrl());
            }

            listing.getPhotos().clear();

            for (int i = 0; i < photoFiles.size(); i++) {
                MultipartFile photoFile = photoFiles.get(i);
                String altText = altTexts.get(i);

                String url = fileStorageService.save(photoFile);
                savedFileUrls.add(url);

                ListingPhoto photo = new ListingPhoto();
                photo.setUrl(url);
                photo.setAltText(altText);
                photo.setListing(listing);

                listing.getPhotos().add(photo);
            }

            Listing savedListing = listingRepository.save(listing);

            return ListingMapper.mapToListingResponseDTO(savedListing);

        } catch (Exception e) {
            for (String url : savedFileUrls) {
                fileStorageService.delete(url);
            }

            throw new AppException("Failed to update listing.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteListing(long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new AppException("Listing not found with id: " + id, HttpStatus.NOT_FOUND));

        for (ListingPhoto photo : listing.getPhotos()) {
            fileStorageService.delete(photo.getUrl());
        }

        listingRepository.delete(listing);
    }
}
