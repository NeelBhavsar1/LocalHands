package com.localhands.backend.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.localhands.backend.entity.Role;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.*;

@RequiredArgsConstructor
@Component
public class UserAuthProvider {

    @Value("${security.jwt.token.secret-key:secret-key}")
    private String secretKey;

    @PostConstruct
    protected void init() {
        secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
    }

    public String createAccessToken(Long userId, Set<Role> roles, Instant now) {

        Instant expiry = now.plus(Duration.ofMinutes(15));

        List<String> roleNames = roles
                .stream()
                .map(role -> role.getRoleName().name())
                .toList();

        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        return JWT.create()
                .withSubject(userId.toString())
                .withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expiry))
                .withClaim("roles", roleNames)
                .sign(algorithm);
    }

    public String createRefreshToken() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] randomBytes = new byte[64];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    public Authentication validateToken(String token) {

        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        JWTVerifier verifier = JWT.require(algorithm).build();
        DecodedJWT decoded = verifier.verify(token);

        Long userId = Long.parseLong(decoded.getSubject());

        List<String> roles = decoded.getClaim("roles").asList(String.class);

        List<GrantedAuthority> authorities = roles != null
                ? roles.stream()
                    .map(role -> (GrantedAuthority) new SimpleGrantedAuthority("ROLE_" + role))
                    .toList()
                : List.of();

        UserPrincipal user = new UserPrincipal(userId);

        return new UsernamePasswordAuthenticationToken(user, null, authorities);
    }

    public Instant getExpiration(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secretKey);
        DecodedJWT decodedJWT = JWT.require(algorithm)
                .build()
                .verify(token);

        Date expiration = decodedJWT.getExpiresAt();
        return expiration.toInstant();
    }
}
