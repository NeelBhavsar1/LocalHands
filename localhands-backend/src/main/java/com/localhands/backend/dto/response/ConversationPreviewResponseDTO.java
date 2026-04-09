package com.localhands.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationPreviewResponseDTO {
    private Long listingId;
    private String listingTitle;
    private Long otherUserId;
    private String otherUserName;
    private String lastMessage;
    private Instant lastMessageTime;
    private String otherUserProfilePicture;
}
