package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.request.UserLoginRequestDTO;
import com.localhands.backend.dto.request.UserRegisterRequestDTO;
import com.localhands.backend.dto.request.UserUpdateRequestDTO;
import com.localhands.backend.dto.response.CookieResponseDTO;
import com.localhands.backend.dto.response.UserInfoResponseDTO;
import com.localhands.backend.entity.Role;
import com.localhands.backend.entity.RoleName;
import com.localhands.backend.entity.User;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.UserMapper;
import com.localhands.backend.repository.RoleRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.security.UserAuthProvider;
import com.localhands.backend.service.ListingService;
import com.localhands.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    ListingService listingService;
    UserAuthProvider userAuthProvider;

    private ResponseCookie generateJWTCookie(String jwt, boolean isRefreshToken) {
        Instant expiration = userAuthProvider.getExpiration(jwt);
        long maxAge = Duration.between(Instant.now(), expiration).getSeconds();

        return ResponseCookie.from(isRefreshToken ? "refreshJWT" : "accessJWT", jwt)
                .httpOnly(true)
                .secure(true)
                .path(isRefreshToken ? "/api/auth/refresh" : "/")
                .maxAge(maxAge)
                .sameSite("Strict")
                .build();
    }

    @Override
    public CookieResponseDTO registerUser(UserRegisterRequestDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new AppException("Account already exists.", HttpStatus.BAD_REQUEST);
        }

        User user = UserMapper.mapToUser(registerDTO);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        Role customerRole = roleRepository.findByRoleName(RoleName.BUYER)
                .orElseThrow(() -> new AppException("Couldn't assign user role.", HttpStatus.INTERNAL_SERVER_ERROR));

        user.getRoles().add(customerRole);

        if (registerDTO.isServiceProvider()) {
            Role sellerRole = roleRepository.findByRoleName(RoleName.SELLER)
                    .orElseThrow(() -> new AppException("Couldn't assign user role.", HttpStatus.INTERNAL_SERVER_ERROR));

            user.getRoles().add(sellerRole);
        }

        userRepository.save(user);

        String refreshJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), true);
        String accessJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), false);

        ResponseCookie refreshCookie = generateJWTCookie(refreshJWT, true);
        ResponseCookie accessCookie = generateJWTCookie(accessJWT, false);

        return new CookieResponseDTO(refreshCookie, accessCookie);
    }

    @Override
    public CookieResponseDTO loginUser(UserLoginRequestDTO loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new AppException("Account does not exist. Consider signing up.", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            String refreshJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), true);
            String accessJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), false);

            ResponseCookie refreshCookie = generateJWTCookie(refreshJWT, true);
            ResponseCookie accessCookie = generateJWTCookie(accessJWT, false);

            return new CookieResponseDTO(refreshCookie, accessCookie);
        }

        throw new AppException("Invalid password.", HttpStatus.UNAUTHORIZED);
    }

    @Override
    public UserInfoResponseDTO getUserInfoById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        return UserMapper.mapToUserInfoResponseDTO(user);
    }

    @Override
    public CookieResponseDTO updateUser(Long userId, UserUpdateRequestDTO updateDTO) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND));

        if (userRepository.existsByEmail(updateDTO.getEmail()) && !updateDTO.getEmail().equals(user.getEmail())) {
            throw new AppException("Account with updated email already exists.", HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(updateDTO.getExistingPassword(), user.getPassword())) {
            user.setFirstName(updateDTO.getFirstName());
            user.setLastName(updateDTO.getLastName());
            user.setEmail(updateDTO.getEmail());
            if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
            }

            Role buyerRole = roleRepository.findByRoleName(RoleName.BUYER)
                    .orElseThrow(() -> new AppException("Buyer role not found.", HttpStatus.INTERNAL_SERVER_ERROR));

            Role sellerRole = roleRepository.findByRoleName(RoleName.SELLER)
                    .orElseThrow(() -> new AppException("Seller role not found.", HttpStatus.INTERNAL_SERVER_ERROR));

            user.getRoles().clear();
            user.getRoles().add(buyerRole);

            if (updateDTO.isServiceProvider()) {
                user.getRoles().add(sellerRole);
            } else {
                user.getRoles().removeIf(role -> role.getRoleName() == RoleName.SELLER);

                listingService.deleteListingsByUserId(user.getId());
            }

            userRepository.save(user);

            String refreshJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), true);
            String accessJWT = userAuthProvider.createToken(user.getId(), user.getRoles(), false);

            ResponseCookie refreshCookie = generateJWTCookie(refreshJWT, true);
            ResponseCookie accessCookie = generateJWTCookie(accessJWT, false);

            return new CookieResponseDTO(refreshCookie, accessCookie);
        } else {
            throw new AppException("Invalid password.", HttpStatus.UNAUTHORIZED);
        }
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new AppException("User not found with id: " + userId, HttpStatus.NOT_FOUND);
        }

        listingService.deleteListingsByUserId(userId);

        userRepository.deleteById(userId);
    }

}
