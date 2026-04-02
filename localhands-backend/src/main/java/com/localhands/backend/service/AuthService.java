package com.localhands.backend.service;

public interface AuthService {
    public void sendPasswordResetEmail(String email);

    public String verifyPasswordResetCode(String email, String code);

    public void resetPassword(String email, String token, String password);
}
