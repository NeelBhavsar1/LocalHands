package com.localhands.backend.service.implementation;

import com.localhands.backend.repository.*;
import com.localhands.backend.service.CleanupServices;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CleanupServicesImpl implements CleanupServices {

    private final RefreshTokenRepository refreshTokenRepository;
    private final ListingPhotoRepository listingPhotoRepository;
    private final PasswordResetCodeRepository passwordResetCodeRepository;
    private final NewEmailTokenRepository newEmailTokenRepository;
    private final ProfilePhotoRepository profilePhotoRepository;

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

    @Scheduled(fixedRate = 86400000)
    @Override
    public void cleanupUnusedProfilePhotos() {

        try {
            Path uploadPath = Paths.get("uploads/profile-pictures/");

            if (!Files.exists(uploadPath)) {
                return;
            }

            List<Path> files = Files.list(uploadPath).toList();

            List<String> urls = profilePhotoRepository.findAllUrls();

            Set<String> validFiles = urls.stream()
                    .map(url -> url.replace("/uploads/profile-pictures/", ""))
                    .collect(Collectors.toSet());

            for (Path file : files) {
                String fileName = file.getFileName().toString();

                if (!validFiles.contains(fileName)) {
                    try {
                        Files.deleteIfExists(file);
                        System.out.println("Deleted unused file: " + fileName);
                    } catch (IOException e) {
                        System.out.println("Failed to delete file: " + fileName);
                    }
                }
            }

        } catch (IOException e) {
            System.out.println("Failed to scan directory.");
        }
    }

    @Scheduled(fixedRate = 86400000)
    @Override
    public void cleanupUnusedListingImages() {

        try {
            Path uploadPath = Paths.get("uploads/listing-images/");

            if (!Files.exists(uploadPath)) {
                return;
            }

            List<Path> files = Files.list(uploadPath).toList();

            List<String> urls = listingPhotoRepository.findAllUrls();

            Set<String> validFiles = urls.stream()
                    .map(url -> url.replace("/uploads/listing-images/", ""))
                    .collect(Collectors.toSet());

            for (Path file : files) {
                String fileName = file.getFileName().toString();

                if (!validFiles.contains(fileName)) {
                    try {
                        Files.deleteIfExists(file);
                        System.out.println("Deleted unused file: " + fileName);
                    } catch (IOException e) {
                        System.out.println("Failed to delete file: " + fileName);
                    }
                }
            }

        } catch (IOException e) {
            System.out.println("Failed to scan directory.");
        }
    }
}
