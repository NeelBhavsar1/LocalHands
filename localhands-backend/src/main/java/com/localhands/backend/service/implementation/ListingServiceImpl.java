package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.ListingRequestDTO;
import com.localhands.backend.dto.response.CategoryResponseDTO;
import com.localhands.backend.dto.response.ListingResponseDTO;
import com.localhands.backend.entity.*;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.ListingMapper;
import com.localhands.backend.repository.ListingCategoryRepository;
import com.localhands.backend.repository.ListingRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.service.FileStorageService;
import com.localhands.backend.service.ListingService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ListingServiceImpl implements ListingService {

    private UserRepository userRepository;
    private ListingRepository listingRepository;
    private FileStorageService fileStorageService;
    private ListingCategoryRepository listingCategoryRepository;

    @Override
    @Transactional
    public ListingResponseDTO createListing(Long userId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts) {

        if (requestDTO.getWorkType() != ListingWorkType.IN_PERSON && requestDTO.getWorkType() != ListingWorkType.ONLINE) {
            throw new AppException("Work type must be in person or online.", HttpStatus.BAD_REQUEST);
        }

        if (photoFiles.size() != altTexts.size()) {
            throw new AppException("Mismatch between photos and alt texts.", HttpStatus.BAD_REQUEST);
        }

        if (requestDTO.getCategoryIds() == null || requestDTO.getCategoryIds().isEmpty()) {
            throw new AppException("At least one category is required.", HttpStatus.BAD_REQUEST);
        }

        Listing listing = ListingMapper.mapToListing(requestDTO);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Could not find user with id: " + userId, HttpStatus.NOT_FOUND));

        listing.setUser(user);

        List<ListingCategory> categories = listingCategoryRepository.findByIdIn(requestDTO.getCategoryIds());

        if (categories.size() != requestDTO.getCategoryIds().size()) {
            throw new AppException("One or more categories are invalid.", HttpStatus.BAD_REQUEST);
        }

        listing.setCategories(new HashSet<>(categories));

        List<ListingPhoto> photos = new ArrayList<>();
        List<String> savedFileUrls = new ArrayList<>();

        try {
            for (int i = 0; i < photoFiles.size(); i++) {
                MultipartFile photoFile = photoFiles.get(i);
                String altText = altTexts.get(i);

                String url = fileStorageService.save(photoFile, "uploads/listing-images/");
                savedFileUrls.add(url);

                ListingPhoto photo = new ListingPhoto();
                photo.setUrl(url);
                photo.setAltText(altText);
                photo.setListing(listing);

                photos.add(photo);
            }

            listing.setPhotos(photos);

            Listing savedListing = listingRepository.save(listing);

            return ListingMapper.mapToListingResponseDTO(savedListing, userId);

        } catch (Exception e) {
            for (String url : savedFileUrls) {
                fileStorageService.delete(url);
            }

            throw new AppException("Failed to create listing.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<ListingResponseDTO> getListingsByUserId(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new AppException("User not found.", HttpStatus.NOT_FOUND);
        }

        return listingRepository.findByUserIdOrderByCreationTimeDesc(userId)
                .stream()
                .map(lis -> ListingMapper.mapToListingResponseDTO(lis, userId))
                .collect(Collectors.toList());
    }

    @Override
    public ListingResponseDTO getListingById(long requesterId, long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException("Listing not found with id: " + listingId, HttpStatus.NOT_FOUND));

        Long ownerId = listing.getUser().getId();
        boolean isPublic = listing.getUser().isPublicProfile();

        if (!isPublic && !ownerId.equals(requesterId)) {
            throw new AppException("This listing is private.", HttpStatus.FORBIDDEN);
        }

        return ListingMapper.mapToListingResponseDTO(listing, requesterId);
    }

    @Override
    public List<ListingResponseDTO> searchForPublicListings(
            Long requesterId,
            String searchInput,
            Double latitude,
            Double longitude,
            Double radius,
            List<Long> categoryIds,
            ListingWorkType workType
    ) {
        String search = (searchInput == null || searchInput.isBlank()) ? null : searchInput;

        boolean hasLocation = latitude != null && longitude != null && radius != null;

        boolean hasCategories = categoryIds != null && !categoryIds.isEmpty();
        List<Long> categories = hasCategories ? categoryIds : List.of(-1L);

        List<String> workTypes;

        if (!hasLocation) {
            workTypes = List.of("ONLINE");
        } else if (workType == ListingWorkType.BOTH) {
            workTypes = List.of("ONLINE", "IN_PERSON");
        } else {
            workTypes = List.of(workType.name());
        }

        List<Listing> listings = listingRepository.searchListings(
                requesterId,
                search,
                latitude,
                longitude,
                radius,
                categories,
                hasCategories,
                workTypes
        );

        return listings.stream()
                .map(l -> ListingMapper.mapToListingResponseDTO(l, requesterId))
                .toList();
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        return listingCategoryRepository.findAll()
                .stream()
                .map(cat -> new CategoryResponseDTO(
                        cat.getId(),
                        cat.getCategory().name()
                ))
                .toList();
    }

    @Override
    @Transactional
    public ListingResponseDTO updateListing(Long userId, long listingId, ListingRequestDTO requestDTO, List<MultipartFile> photoFiles, List<String> altTexts) {

        if (requestDTO.getWorkType() != ListingWorkType.IN_PERSON && requestDTO.getWorkType() != ListingWorkType.ONLINE) {
            throw new AppException("Work type must be in person or online.", HttpStatus.BAD_REQUEST);
        }

        if (photoFiles != null && !photoFiles.isEmpty()) {
            if (altTexts == null || altTexts.size() != photoFiles.size()) {
                throw new AppException("Alt texts must match provided photos.", HttpStatus.BAD_REQUEST);
            }
        }

        if (requestDTO.getCategoryIds() == null || requestDTO.getCategoryIds().isEmpty()) {
            throw new AppException("At least one category is required.", HttpStatus.BAD_REQUEST);
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException("Listing not found with id: " + listingId, HttpStatus.NOT_FOUND));

        if (listing.getUser() == null || !listing.getUser().getId().equals(userId)) {
            throw new AppException("User is not the owner of this listing.", HttpStatus.FORBIDDEN);
        }

        List<ListingCategory> categories = listingCategoryRepository.findByIdIn(requestDTO.getCategoryIds());

        if (categories.size() != requestDTO.getCategoryIds().size()) {
            throw new AppException("One or more categories are invalid.", HttpStatus.BAD_REQUEST);
        }

        listing.getCategories().clear();
        listing.getCategories().addAll(categories);

        List<String> savedFileUrls = new ArrayList<>();

        try {
            listing.setName(requestDTO.getName());
            listing.setDescription(requestDTO.getDescription());
            listing.setLocation(
                    ListingMapper.createPoint(requestDTO.getLongitude(), requestDTO.getLatitude())
            );
            listing.setWorkType(requestDTO.getWorkType());

            if (photoFiles != null && !photoFiles.isEmpty()) {
                for (ListingPhoto photo : listing.getPhotos()) {
                    fileStorageService.delete(photo.getUrl());
                }

                listing.getPhotos().clear();

                for (int i = 0; i < photoFiles.size(); i++) {
                    MultipartFile photoFile = photoFiles.get(i);
                    String altText = altTexts.get(i);

                    String url = fileStorageService.save(photoFile, "uploads/listing-images/");
                    savedFileUrls.add(url);

                    ListingPhoto photo = new ListingPhoto();
                    photo.setUrl(url);
                    photo.setAltText(altText);
                    photo.setListing(listing);

                    listing.getPhotos().add(photo);
                }
            }

            Listing savedListing = listingRepository.save(listing);

            return ListingMapper.mapToListingResponseDTO(savedListing, userId);

        } catch (Exception e) {
            for (String url : savedFileUrls) {
                fileStorageService.delete(url);
            }

            throw new AppException("Failed to update listing.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deleteListingById(long userId, long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException("Listing not found with id: " + listingId, HttpStatus.NOT_FOUND));

        if (listing.getUser() == null || !listing.getUser().getId().equals(userId)) {
            throw new AppException("User is not the owner of this listing.", HttpStatus.FORBIDDEN);
        }

        for (ListingPhoto photo : listing.getPhotos()) {
            fileStorageService.delete(photo.getUrl());
        }

        listingRepository.delete(listing);
    }

    @Override
    public void deleteListingsByUserId(Long userId) {
        List<Listing> listings = listingRepository.findByUserIdOrderByCreationTimeDesc(userId);

        for (Listing listing : listings) {
            for (ListingPhoto photo : listing.getPhotos()) {
                fileStorageService.delete(photo.getUrl());
            }

            listingRepository.delete(listing);
        }
    }
}
