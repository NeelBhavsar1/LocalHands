package com.localhands.backend.security;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.List;
import java.util.Map;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private final UserAuthProvider userAuthProvider;

    public WebSocketAuthInterceptor(UserAuthProvider userAuthProvider) {
        this.userAuthProvider = userAuthProvider;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        String token = extractTokenFromCookies(request);

        try {
            if (token != null) {
                Authentication auth = userAuthProvider.validateToken(token);

                Object principal = auth.getPrincipal();

                if (!(principal instanceof UserPrincipal user) || user.getId() == null) {
                    return false;
                }

                attributes.put("userId", user.getId());

                return true;
            }
        } catch (Exception e) {
            return false;
        }

        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {}

    private String extractTokenFromCookies(ServerHttpRequest request) {
        List<String> cookies = request.getHeaders().get("Cookie");
        if (cookies == null) return null;

        for (String header : cookies) {
            for (String cookie : header.split(";")) {
                cookie = cookie.trim();

                if (cookie.startsWith("accessToken=")) {
                    return cookie.substring("accessToken=".length());
                }
            }
        }

        return null;
    }
}
