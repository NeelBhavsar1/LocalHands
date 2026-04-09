package com.localhands.backend.repository;

import com.localhands.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = """
        SELECT u.*
        FROM users u
        WHERE (
            LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE LOWER(CONCAT('%', :searchInput, '%'))
        )
        AND (
            u.public_profile = true
            OR (:requesterId IS NOT NULL AND u.id = :requesterId)
        )
        ORDER BY RAND()
        LIMIT 20
    """, nativeQuery = true)
    List<User> searchPublicProfiles(
            @Param("requesterId") Long requesterId,
            @Param("searchInput") String searchInput
    );

    @Modifying
    @Query("""
        DELETE FROM User u
        WHERE u.id IN (
            SELECT t.user.id FROM ActivateAccountToken t
            WHERE t.expiryDate < :now
        )
    """)
    void deleteUsersWithExpiredActivationTokens(@Param("now") Instant now);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
