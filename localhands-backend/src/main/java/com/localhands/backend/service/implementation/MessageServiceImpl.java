package com.localhands.backend.service.implementation;

import com.localhands.backend.dto.response.ConversationPreviewResponseDTO;
import com.localhands.backend.dto.response.ConversationResponseDTO;
import com.localhands.backend.dto.response.MessageResponseDTO;
import com.localhands.backend.entity.Listing;
import com.localhands.backend.entity.Message;
import com.localhands.backend.entity.User;
import com.localhands.backend.exception.AppException;
import com.localhands.backend.mapper.MessageMapper;
import com.localhands.backend.repository.ListingRepository;
import com.localhands.backend.repository.MessageRepository;
import com.localhands.backend.repository.UserRepository;
import com.localhands.backend.service.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MessageServiceImpl implements MessageService {

    private MessageRepository messageRepository;
    private ListingRepository listingRepository;
    private UserRepository userRepository;

    @Override
    public MessageResponseDTO sendMessage(Long senderId, Long recipientId, Long listingId, String message) {

        if (senderId.equals(recipientId)) {
            throw new AppException("Cannot message yourself.", HttpStatus.BAD_REQUEST);
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException("Listing not found.", HttpStatus.NOT_FOUND));

        Long listingOwnerId = listing.getUser().getId();

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new AppException("Sender not found.", HttpStatus.NOT_FOUND));

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new AppException("Recipient not found.", HttpStatus.NOT_FOUND));

        if (!sender.isPublicProfile()) {
            throw new AppException("You cannot send messages because your profile is private.", HttpStatus.FORBIDDEN);
        }

        if (!sender.isMessagesEnabled()) {
            throw new AppException("You have disabled messaging in your settings.", HttpStatus.FORBIDDEN);
        }

        if (!recipient.isPublicProfile()) {
            throw new AppException("This user cannot be messaged because their profile is private.", HttpStatus.FORBIDDEN);
        }

        if (!recipient.isMessagesEnabled()) {
            throw new AppException("This user has disabled messages.", HttpStatus.FORBIDDEN);
        }

        boolean currentUserIsOwner = senderId.equals(listingOwnerId);
        boolean otherUserIsOwner = recipientId.equals(listingOwnerId);

        if (!currentUserIsOwner && !otherUserIsOwner) {
            throw new AppException("Invalid conversation for this listing.", HttpStatus.FORBIDDEN);
        }

        Message messageEntity = new Message();
        messageEntity.setMessage(message);
        messageEntity.setSender(sender);
        messageEntity.setRecipient(recipient);
        messageEntity.setListing(listing);

        messageRepository.save(messageEntity);

        return MessageMapper.mapToMessageResponseDTO(messageEntity);
    }

    @Override
    public ConversationResponseDTO getConversation(Long currentUserId, Long otherUserId, Long listingId) {
        
        if (currentUserId.equals(otherUserId)) {
            throw new AppException("Cannot message yourself.", HttpStatus.BAD_REQUEST);
        }
        
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new AppException("Listing not found.", HttpStatus.NOT_FOUND));

        Long listingOwnerId = listing.getUser().getId();

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException("Current user not found.", HttpStatus.NOT_FOUND));

        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new AppException("Other user not found.", HttpStatus.NOT_FOUND));

        boolean currentUserIsOwner = currentUserId.equals(listingOwnerId);
        boolean otherUserIsOwner = otherUserId.equals(listingOwnerId);

        if (!currentUserIsOwner && !otherUserIsOwner) {
            throw new AppException("Invalid conversation for this listing.", HttpStatus.FORBIDDEN);
        }
        
        List<Message> messages = messageRepository.findConversation(
                listingId,
                currentUserId,
                otherUserId
        );

        boolean canMessage = (currentUser.isPublicProfile() &&
                currentUser.isMessagesEnabled() &&
                otherUser.isPublicProfile() &&
                otherUser.isMessagesEnabled());

        boolean canAccessListing = currentUserIsOwner || otherUser.isPublicProfile();

        return new ConversationResponseDTO(
                messages
                        .stream()
                        .map(MessageMapper::mapToMessageResponseDTO)
                        .collect(Collectors.toList()),
                canMessage,
                canAccessListing
        );
    }

    @Override
    public List<ConversationPreviewResponseDTO> getInbox(Long userId) {

        List<Message> messages = messageRepository.findAllUserMessages(userId);

        Map<String, Message> latestMessages = new HashMap<>();

        for (Message m : messages) {

            Long otherUserId = m.getSender().getId().equals(userId)
                    ? m.getRecipient().getId()
                    : m.getSender().getId();

            String key = m.getListing().getId() + "-" + otherUserId;

            Message existing = latestMessages.get(key);

            if (existing == null || m.getSentTime().isAfter(existing.getSentTime())) {
                latestMessages.put(key, m);
            }
        }

        return latestMessages.values()
                .stream()
                .map(m -> {

                    User otherUser = m.getSender().getId().equals(userId)
                            ? m.getRecipient()
                            : m.getSender();

                    Listing listing = m.getListing();

                    return new ConversationPreviewResponseDTO(
                            listing.getId(),
                            listing.getName(),
                            otherUser.getId(),
                            otherUser.getFirstName(),
                            m.getMessage(),
                            m.getSentTime()
                    );
                })
                .sorted((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()))
                .collect(Collectors.toList());
    }
}
