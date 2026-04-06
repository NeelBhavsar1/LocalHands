package com.localhands.backend.repository;

import com.localhands.backend.entity.ActivateAccountToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActivateAccountTokenRepository extends JpaRepository<ActivateAccountToken, Long> {

    Optional<ActivateAccountToken> findByActivationToken(String token);

}
