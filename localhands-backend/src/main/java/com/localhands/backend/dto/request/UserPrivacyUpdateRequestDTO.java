package com.localhands.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPrivacyUpdateRequestDTO {
    private boolean publicProfile;
    private boolean messagesAllowed;
}
