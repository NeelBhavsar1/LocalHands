package com.localhands.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;

public interface CleanupServices {
    public void cleanupExpiredTokens();

    public void cleanupExpiredPasswordResetCodes();

    public void cleanupNewEmailTokens();

    public void deleteUsersWithExpiredActivationTokens();

    public void cleanupUnusedProfilePhotos();

    public void cleanupUnusedListingImages();
}
