package com.localhands.backend.util;

import org.springframework.http.ResponseCookie;

public class CookieUtil {
    public static ResponseCookie clearCookie(String name) {
        return ResponseCookie.from(name, "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .domain(".projectlocalhands.com")
                .path("/")
                .maxAge(0)
                .build();
    }
}
