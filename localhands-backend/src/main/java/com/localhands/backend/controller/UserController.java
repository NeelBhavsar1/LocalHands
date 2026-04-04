package com.localhands.backend.controller;

import com.localhands.backend.dto.request.*;
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
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponseDTO> getPrivateUserInfo(@AuthenticationPrincipal UserPrincipal user) {
        UserInfoResponseDTO userInfo = userService.getUserInfoById(user.getId());

        return ResponseEntity.ok(userInfo);
    }

    @PutMapping("/account")
    public ResponseEntity<String> updateUserAccountInfo(@AuthenticationPrincipal UserPrincipal user, @RequestBody UserAccountUpdateRequestDTO requestDTO) {
        CookieResponseDTO cookies = userService.updateUserAccount(user.getId(), requestDTO);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookies.getRefreshCookie().toString())
                .header(HttpHeaders.SET_COOKIE, cookies.getAccessCookie().toString())
                .body("Updated user account successfully.");
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateUserProfileInfo (
            @AuthenticationPrincipal UserPrincipal user,
            @RequestPart("bio") UserProfileUpdateRequestDTO requestDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        userService.updateUserProfile(user.getId(), requestDTO, photo);
        return ResponseEntity.ok("Updated user profile successfully.");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteUser(@AuthenticationPrincipal UserPrincipal user) {
        userService.deleteUser(user.getId());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("refreshToken").toString())
                .header(HttpHeaders.SET_COOKIE, CookieUtil.clearCookie("accessToken").toString())
                .body("Deleted account successfully.");
    }
}
