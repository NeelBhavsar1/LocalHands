package com.localhands.backend.repository;

import com.localhands.backend.entity.PasswordResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate < :now")
    void deleteAllExpiredSince(@Param("now") Instant now);

}
