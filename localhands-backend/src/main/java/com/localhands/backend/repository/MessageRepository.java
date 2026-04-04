package com.localhands.backend.repository;

import com.localhands.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
        SELECT m FROM Message m
        WHERE m.listing.id = :listingId
        AND (
            (m.sender.id = :user1 AND m.recipient.id = :user2)
            OR
            (m.sender.id = :user2 AND m.recipient.id = :user1)
        )
        ORDER BY m.sentTime ASC
    """)
    List<Message> findConversation(Long listingId, Long user1, Long user2);

    @Query("""
        SELECT m FROM Message m
        WHERE m.sender.id = :userId OR m.recipient.id = :userId
        ORDER BY m.sentTime DESC
    """)
    List<Message> findAllUserMessages(Long userId);

}
