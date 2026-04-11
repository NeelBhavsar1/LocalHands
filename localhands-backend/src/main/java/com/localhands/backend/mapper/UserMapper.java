package com.localhands.backend.mapper;

import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.response.*;
import com.localhands.backend.entity.User;

import java.util.stream.Collectors;

public class UserMapper {

    public static User mapToUser(UserRegisterRequestDTO requestDTO) {

        User user = new User();

        user.setFirstName(requestDTO.getFirstName());
        user.setLastName(requestDTO.getLastName());
        user.setDateOfBirth(requestDTO.getDateOfBirth());
        user.setEmail(requestDTO.getEmail());

        return user;
    }

    public static UserInfoResponseDTO mapToUserInfoResponseDTO(User user) {
        return new UserInfoResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getDateOfBirth(),
                user.getEmail(),
                user.getBio(),
                user.getRoles()
                        .stream()
                        .map(role -> role.getRoleName().name())
                        .toList(),
                user.getProfilePhotos().isEmpty()
                        ? null
                        : ProfilePhotoMapper.mapToProfilePhotoResponseDTO(user.getProfilePhotos().get(0)),
                user.isPublicProfile(),
                user.isMessagesEnabled(),
                user.getActivationTokens().isEmpty()
        );
    }

    public static PublicProfileResponseDTO mapToPublicProfileResponseDTO(User user, Long requesterId) {
        return new PublicProfileResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getBio(),
                user.getRoles()
                        .stream()
                        .map(role -> role.getRoleName().name())
                        .toList(),
                user.getProfilePhotos().isEmpty()
                        ? null
                        : ProfilePhotoMapper.mapToProfilePhotoResponseDTO(user.getProfilePhotos().get(0)),
                user.getListings()
                        .stream()
                        .map(lis -> ListingMapper.mapToListingResponseDTO(lis, requesterId))
                        .collect(Collectors.toList()),
                user.getReviews()
                        .stream()
                        .map(rev -> ReviewMapper.mapToReviewResponseDTO(rev, requesterId))
                        .collect(Collectors.toList())
        );
    }

    public static ListingSellerResponseDTO mapToListingSellerResponseDTO(User user) {
        return new ListingSellerResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getProfilePhotos().isEmpty()
                        ? null
                        : ProfilePhotoMapper.mapToProfilePhotoResponseDTO(user.getProfilePhotos().get(0))
        );
    }
}
