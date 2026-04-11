package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String bio;
    private List<String> roles;
    private ProfilePhotoResponseDTO profilePhoto;
    private boolean publicProfile;
    private boolean messagesEnabled;
    private boolean emailConfirmed;
}
