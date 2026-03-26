package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseCookie;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CookieResponseDTO {
    private ResponseCookie refreshCookie;
    private ResponseCookie accessCookie;
}
