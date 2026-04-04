package com.localhands.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;

public interface CleanupServices {
    void cleanupExpiredTokens();

    void cleanupExpiredPasswordResetCodes();

    public void cleanupNewEmailTokens();

    public void cleanupUnusedProfilePhotos();

    void cleanupUnusedListingImages();
}
