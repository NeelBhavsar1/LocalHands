package com.localhands.backend.config;

import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.security.JwtAuthFilter;
import com.localhands.backend.security.UserAuthProvider;
import com.localhands.backend.security.UserAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
    private final UserAuthProvider userAuthProvider;
    private final UserRepository userRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {})
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(new JwtAuthFilter(userAuthProvider, userRepository), BasicAuthenticationFilter.class)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(userAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/listings").hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT, "/api/listings").hasRole("SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/api/listings").hasRole("SELLER")
                        .requestMatchers(HttpMethod.GET, "/api/listings/me").hasRole("SELLER")
                        .anyRequest().authenticated()
                )
                .build();
    }
}
