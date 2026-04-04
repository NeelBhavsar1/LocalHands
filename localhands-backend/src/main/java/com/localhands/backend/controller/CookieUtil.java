package com.localhands.backend.controller;

import org.springframework.http.ResponseCookie;

public class CookieUtil {
    public static ResponseCookie clearCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
    }
}
