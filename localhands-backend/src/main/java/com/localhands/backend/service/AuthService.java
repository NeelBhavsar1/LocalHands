package com.localhands.backend.service;

public interface AuthService {
    public void sendPasswordResetEmail(String email);

    public void verifyPasswordResetCode(String email, String code);
}
