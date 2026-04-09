package com.localhands.backend.mapper;

import com.localhands.backend.dto.response.MessageResponseDTO;
import com.localhands.backend.entity.Message;

public class MessageMapper {

    public static MessageResponseDTO mapToMessageResponseDTO(Message message) {
        return new MessageResponseDTO(
                message.getId(),
                message.getMessage(),
                message.getSentTime(),
                message.getSender().getId(),
                message.getRecipient().getId()
        );
    }
}
