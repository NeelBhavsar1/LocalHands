package com.localhands.backend.service;

import com.localhands.backend.dto.response.ConversationPreviewResponseDTO;
import com.localhands.backend.dto.response.ConversationResponseDTO;
import com.localhands.backend.dto.response.MessageResponseDTO;

import java.util.List;

public interface MessageService {
    public MessageResponseDTO sendMessage(Long senderId, Long recipientId, Long listingId, String message);

    public ConversationResponseDTO getConversation(Long currentUserId, Long otherUserId, Long listingId);

    public List<ConversationPreviewResponseDTO> getInbox(Long userId);
}
