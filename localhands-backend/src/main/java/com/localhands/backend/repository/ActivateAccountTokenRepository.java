package com.localhands.backend.repository;

import com.localhands.backend.entity.ActivateAccountToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface ActivateAccountTokenRepository extends JpaRepository<ActivateAccountToken, Long> {

    Optional<ActivateAccountToken> findByActivationToken(String token);

    @Modifying
    @Query("""
        DELETE FROM ActivateAccountToken a
        WHERE a.expiryDate < :now
    """)
    void deleteAllExpiredSince(@Param("now") Instant now);
}
