package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.*;
import com.localhands.backend.dto.response.PublicProfileResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.dto.response.UserProfileUpdateResponseDTO;
import com.localhands.backend.entity.*;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.UserMapper;
import com.localhands.backend.repository.*;
import com.localhands.backend.service.FileStorageService;
import com.localhands.backend.service.ListingService;
import com.localhands.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

import static com.localhands.backend.util.TokenUtil.hashToken;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ListingService listingService;
    private final FileStorageService fileStorageService;
    private final NewEmailTokenRepository newEmailTokenRepository;

    @Override
    public UserInfoResponseDTO getUserInfoById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        return UserMapper.mapToUserInfoResponseDTO(user);
    }

    @Override
    public PublicProfileResponseDTO getPublicProfileById(Long requesterId, Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new AppException("User not found with id: " + targetUserId, HttpStatus.NOT_FOUND));

        if (!user.isPublicProfile() && !targetUserId.equals(requesterId)) {
            throw new AppException("This profile is private.", HttpStatus.FORBIDDEN);
        }

        return UserMapper.mapToPublicProfileResponseDTO(user, requesterId);
    }

    @Override
    public List<PublicProfileResponseDTO> searchForPublicProfiles(Long requesterId, String searchInput) {

        if (searchInput == null || searchInput.trim().length() < 3) {
            return List.of();
        }

        return userRepository.searchPublicProfiles(requesterId, searchInput)
                .stream()
                .map(profile -> UserMapper.mapToPublicProfileResponseDTO(profile, requesterId))
                .toList();
    }

    @Override
    @Transactional
    public void confirmEmail(String token) {

        NewEmailToken emailToken = newEmailTokenRepository.findByEmailToken(hashToken(token))
                .orElseThrow(() -> new AppException("Invalid or expired token.", HttpStatus.UNAUTHORIZED));

        if (emailToken.getExpiryDate().isBefore(Instant.now())) {
            throw new AppException("Token has expired.", HttpStatus.UNAUTHORIZED);
        }

        if (userRepository.existsByEmail(emailToken.getNewEmail())) {
            throw new AppException("The new email has now been taken.", HttpStatus.UNAUTHORIZED);
        }

        User user = emailToken.getUser();

        user.setEmail(emailToken.getNewEmail());

        newEmailTokenRepository.delete(emailToken);

        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserProfileUpdateResponseDTO updateUserProfile(Long userId, UserProfileUpdateRequestDTO updateDTO, MultipartFile photo) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        boolean shouldReset = updateDTO.isResetProfilePhoto();
        boolean hasNewPhoto = photo != null && !photo.isEmpty();

        if (shouldReset && hasNewPhoto) {
            throw new AppException("Cannot reset and upload a photo at the same time.", HttpStatus.BAD_REQUEST);
        }

        String savedFileUrl = null;

        try {
            user.setBio(updateDTO.getBio());

            if (shouldReset || hasNewPhoto) {
                for (ProfilePhoto existingPhoto : user.getProfilePhotos()) {
                    fileStorageService.delete(existingPhoto.getUrl());
                }

                user.getProfilePhotos().clear();
            }

            if (hasNewPhoto) {
                savedFileUrl = fileStorageService.save(photo, "uploads/profile-pictures/");

                ProfilePhoto profilePhoto = new ProfilePhoto();

                profilePhoto.setUrl(savedFileUrl);
                profilePhoto.setAltText("Image of " + user.getFirstName() + ".");
                profilePhoto.setUser(user);

                user.getProfilePhotos().add(profilePhoto);
            }

            userRepository.save(user);

            String finalPhotoUrl = user.getProfilePhotos().isEmpty()
                    ? null
                    : user.getProfilePhotos().get(0).getUrl();

            return new UserProfileUpdateResponseDTO(finalPhotoUrl, user.getBio());

        } catch (Exception e) {

            if (savedFileUrl != null) {
                fileStorageService.delete(savedFileUrl);
            }

            throw new AppException("Failed to update user profile.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void updateUserPrivacy(Long userId, UserPrivacyUpdateRequestDTO updateDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        user.setPublicProfile(updateDTO.isPublicProfile());
        user.setMessagesEnabled(updateDTO.isMessagesAllowed());

        userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        for (ProfilePhoto photo : user.getProfilePhotos()) {
            fileStorageService.delete(photo.getUrl());
        }

        listingService.deleteListingsByUserId(userId);

        userRepository.deleteById(userId);
    }

}
