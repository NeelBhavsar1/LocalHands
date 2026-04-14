package com.localhands.backend.service;

public interface CleanupServices {
    public void cleanupExpiredTokens();

    public void cleanupExpiredPasswordResetCodes();

    public void cleanupNewEmailTokens();

    public void deleteUsersWithExpiredActivationTokens();

    public void cleanupUnusedProfilePhotos();

    public void cleanupUnusedListingImages();
}
