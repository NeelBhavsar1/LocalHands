package com.localhands.backend.controller;

import com.localhands.backend.dto.request.SendMessageRequestDTO;
import com.localhands.backend.dto.response.ConversationPreviewResponseDTO;
import com.localhands.backend.dto.response.ConversationResponseDTO;
import com.localhands.backend.dto.response.MessageResponseDTO;
import com.localhands.backend.security.UserPrincipal;
import com.localhands.backend.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(@AuthenticationPrincipal UserPrincipal user, @RequestBody SendMessageRequestDTO request) {
        MessageResponseDTO message = messageService.sendMessage(
                user.getId(),
                request.getRecipientId(),
                request.getListingId(),
                request.getMessage());

        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversation")
    public ResponseEntity<ConversationResponseDTO> getConversation(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam Long otherUserId,
            @RequestParam Long listingId
    ) {
        ConversationResponseDTO messages =  messageService.getConversation(
                user.getId(),
                otherUserId,
                listingId);

        return ResponseEntity.ok(messages);
    }

    @GetMapping("/inbox")
    public ResponseEntity<List<ConversationPreviewResponseDTO>> getInbox(@AuthenticationPrincipal UserPrincipal user) {
        List<ConversationPreviewResponseDTO> inbox = messageService.getInbox(user.getId());

        return ResponseEntity.ok(inbox);
    }
}
