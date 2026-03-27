package com.localhands.backend.controller;

import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.request.UserUpdateRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.security.UserPrincipal;
import com.localhands.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

        private final UserService userService;
        private final UserAuthProvider userAuthProvider;

        // Blacklist of refresh tokens as random UUIDs in db rather than JWTS.
        // Cross origin behaviour and role based access urls in securityconfig.
        // Make a refresh endpoint and make sure blacklist is checked.
        // Delete logging.
        // Forgot password functionality, and change email confirmation.
        // Registering or logging on with JWTS still there/signed in?
        // Editing listing to now tie to user.

        @PostMapping("/register")
        public ResponseEntity<String> registerUser(@RequestBody UserRegisterRequestDTO requestDTO) {
                CookieResponseDTO cookies = userService.registerUser(requestDTO);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                                .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                                .body("Registered and logged in to new account.");
        }

        @PostMapping("/login")
        public ResponseEntity<String> loginUser(@RequestBody UserLoginRequestDTO requestDTO) {
                CookieResponseDTO cookies = userService.loginUser(requestDTO);

                return ResponseEntity.ok()
        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .maxAge(0)
                .sameSite("Strict")
                .build();

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
=======

        @PostMapping("/logout")
        public ResponseEntity<String> logout() {
                ResponseCookie refreshCookie = ResponseCookie.from("refreshJWT", "")
                                .httpOnly(true)
                                .secure(true)
                                .path("/api/auth/refresh")
                                .maxAge(0)
                                .sameSite("Strict")
                                .build();

                ResponseCookie accessCookie = ResponseCookie.from("accessJWT", "")
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(0)
                                .sameSite("Strict")
                                .build();
>>>>>>> Stashed changes

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .body("Logged out successfully.");
        }

        @GetMapping
        public ResponseEntity<UserInfoResponseDTO> getUserByJWT(@AuthenticationPrincipal UserPrincipal user) {
                UserInfoResponseDTO userInfo = userService.getUserInfoById(user.getId());

                return ResponseEntity.ok(userInfo);
        }

        @PutMapping
        public ResponseEntity<String> updateUser(@AuthenticationPrincipal UserPrincipal user,
                        @RequestBody UserUpdateRequestDTO requestDTO) {
                CookieResponseDTO cookies = userService.updateUser(user.getId(), requestDTO);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                                .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                                .body("Updated user account successfully.");
        }

        @DeleteMapping
        public ResponseEntity<String> deleteUser(@AuthenticationPrincipal UserPrincipal user) {
                userService.deleteUser(user.getId());

                ResponseCookie refreshCookie = ResponseCookie.from("refreshJWT", "")
                                .httpOnly(true)
                                .secure(true)
                                .path("/api/auth/refresh")
                                .maxAge(0)
                                .sameSite("Strict")
                                .build();

                ResponseCookie accessCookie = ResponseCookie.from("accessJWT", "")
                                .httpOnly(true)
                                .secure(true)
                                .path("/")
                                .maxAge(0)
                                .sameSite("Strict")
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                                .body("Deleted account successfully.");
        }
}
