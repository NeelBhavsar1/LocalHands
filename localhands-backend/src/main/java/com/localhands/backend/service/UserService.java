package com.localhands.backend.service;

import com.localhands.backend.dto.request.*;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.PublicProfileResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.dto.response.UserProfileUpdateResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {
    public CookieResponseDTO generateNewTokenCookies(String refreshToken);

    public CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO);

    public CookieResponseDTO loginUser (UserLoginRequestDTO loginDto);

    public void logout(String refreshToken);

    public UserInfoResponseDTO getUserInfoById(Long userId);

    public PublicProfileResponseDTO getPublicProfileById(Long requesterId, Long targetUserId);

    public List<PublicProfileResponseDTO> searchForPublicProfiles(Long requesterId, String searchInput);

    public CookieResponseDTO updateUserAccount(Long userId, String refreshToken, UserAccountUpdateRequestDTO updateDTO);

    public void confirmEmail(String token);

    public void resendActivationEmail(Long userId);

    public void activateAccount(String token);

    public void deactivateAccount(String token);

    public UserProfileUpdateResponseDTO updateUserProfile(Long userId, UserProfileUpdateRequestDTO updateDTO, MultipartFile photo);

    public void updateUserPrivacy(Long userId, UserPrivacyUpdateRequestDTO updateDTO);

    public void deleteUser(Long userId);
}
