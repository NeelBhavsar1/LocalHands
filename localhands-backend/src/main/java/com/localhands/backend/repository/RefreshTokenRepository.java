package com.localhands.backend.repository;

import com.localhands.backend.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    void deleteByToken(String token);

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate < :now")
    void deleteAllExpiredSince(@Param("now") Instant now);

    Optional<RefreshToken> findByToken(String token);

}
