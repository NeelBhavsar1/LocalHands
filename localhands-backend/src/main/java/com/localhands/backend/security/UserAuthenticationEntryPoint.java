package com.localhands.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.localhands.backend.dto.response.ErrorDTO;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

@Component
public class UserAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {

        String error = (String) request.getAttribute("error");

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if ("TOKEN_EXPIRED".equals(error)) {
            OBJECT_MAPPER.writeValue(
                    response.getOutputStream(),
                    new ErrorDTO("TOKEN_EXPIRED", "Access token expired.")
            );
        } else if ("INVALID_TOKEN".equals(error)) {
            OBJECT_MAPPER.writeValue(
                    response.getOutputStream(),
                    new ErrorDTO("INVALID_TOKEN", "Invalid token.")
            );
        } else if ("USER_NOT_FOUND".equals(error)) {
            OBJECT_MAPPER.writeValue(
                    response.getOutputStream(),
                    new ErrorDTO("USER_NOT_FOUND", "Account no longer exists.")
            );
        } else {
            OBJECT_MAPPER.writeValue(
                    response.getOutputStream(),
                    new ErrorDTO("UNAUTHORIZED", "Authentication required.")
            );
        }
    }
}
