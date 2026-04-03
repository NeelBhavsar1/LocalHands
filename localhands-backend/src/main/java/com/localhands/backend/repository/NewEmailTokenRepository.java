package com.localhands.backend.repository;

import com.localhands.backend.entity.NewEmailToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface NewEmailTokenRepository extends JpaRepository<NewEmailToken, Long> {

    @Modifying
    @Query("DELETE FROM NewEmailToken t WHERE t.expiryDate < :now")
    void deleteAllExpiredSince(@Param("now") Instant now);

    Optional<NewEmailToken> findByEmailToken(String token);

}
