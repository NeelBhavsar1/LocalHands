package com.localhands.backend.service.implementation;

import com.localhands.backend.repository.*;
import com.localhands.backend.service.CleanupServices;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CleanupServicesImpl implements CleanupServices {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    private final RefreshTokenRepository refreshTokenRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final PasswordResetCodeRepository passwordResetCodeRepository;
    private final NewEmailTokenRepository newEmailTokenRepository;
    private final ProfilePhotoRepository profilePhotoRepository;
    private final UserRepository userRepository;

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @Override
    public void cleanupExpiredTokens() {
        refreshTokenRepository.deleteAllExpiredSince(Instant.now());
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @Override
    public void cleanupExpiredPasswordResetCodes() {
        passwordResetCodeRepository.deleteAllExpiredSince(Instant.now());
    }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @Override
    public void cleanupNewEmailTokens() { newEmailTokenRepository.deleteAllExpiredSince(Instant.now()); }

    @Scheduled(fixedRate = 3600000)
    @Transactional
    @Override
    public void deleteUsersWithExpiredActivationTokens() { userRepository.deleteUsersWithExpiredActivationTokens(Instant.now()); }

    @Profile("prod")
    @Scheduled(fixedRate = 86400000)
    @Override
    public void cleanupUnusedProfilePhotos() {

        Set<String> validKeys = profilePhotoRepository.findAllUrls()
                .stream()
                .map(url -> url != null && url.startsWith("/") ? url.substring(1) : url)
                .collect(Collectors.toSet());

        String continuationToken = null;

        do {
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix("profile-pictures/")
                    .continuationToken(continuationToken)
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(request);

            response.contents().forEach(obj -> {
                String key = obj.key();

                if (!validKeys.contains(key)) {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build());

                    System.out.println("Deleted unused S3 profile image: " + key);
                }
            });

            continuationToken = response.nextContinuationToken();

        } while (continuationToken != null);
    }

    @Profile("prod")
    @Scheduled(fixedRate = 86400000)
    @Override
    public void cleanupUnusedListingImages() {

        Set<String> validKeys = listingPhotoRepository.findAllUrls()
                .stream()
                .map(url -> url != null && url.startsWith("/") ? url.substring(1) : url)
                .collect(Collectors.toSet());

        String continuationToken = null;

        do {
            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix("listing-images/")
                    .continuationToken(continuationToken)
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(request);

            response.contents().forEach(obj -> {
                String key = obj.key(); // listing-images/file.jpg

                if (!validKeys.contains(key)) {
                    s3Client.deleteObject(DeleteObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .build());

                    System.out.println("Deleted unused S3 listing image: " + key);
                }
            });

            continuationToken = response.nextContinuationToken();

        } while (continuationToken != null);
    }
}
