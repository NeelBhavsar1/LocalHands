package com.localhands.backend.service;

import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;

public interface CleanupServices {
    void cleanupExpiredTokens();

    void cleanupUnusedListingImages();
}
