package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponseDTO {
    private String listingTitle;
    private String otherUserName;
    private List<MessageResponseDTO> conversation;
    private boolean canSendMessages;
    private boolean canAccessListing;
    private String otherUserProfilePicture;
}
