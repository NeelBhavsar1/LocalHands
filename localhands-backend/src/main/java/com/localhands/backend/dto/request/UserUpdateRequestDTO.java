package com.localhands.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String existingPassword;
    private String newPassword;
    private boolean isServiceProvider;
}
