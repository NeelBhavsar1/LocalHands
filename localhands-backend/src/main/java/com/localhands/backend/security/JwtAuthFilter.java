package com.localhands.backend.security;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.localhands.backend.repository.UserRepository;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @Nonnull HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain) throws ServletException, IOException {

        String token = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("accessToken")) {
                    token = cookie.getValue();
                }
            }
        }

        if (token != null) {
            try {
                var auth = userAuthProvider.validateToken(token);

                Object principalObj = auth.getPrincipal();

                if (!(principalObj instanceof UserPrincipal principal)) {
                    SecurityContextHolder.clearContext();
                    request.setAttribute("error", "INVALID_TOKEN");
                } else if (!userRepository.existsById(principal.getId())) {
                    SecurityContextHolder.clearContext();
                    request.setAttribute("error", "USER_NOT_FOUND");
                } else {
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }

            } catch (TokenExpiredException e) {
                SecurityContextHolder.clearContext();
                request.setAttribute("error", "TOKEN_EXPIRED");

            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                request.setAttribute("error", "INVALID_TOKEN");
            }
        }

        filterChain.doFilter(request, response);
    }
}
