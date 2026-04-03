package com.localhands.backend.repository;

import com.localhands.backend.entity.NewEmailToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NewEmailTokenRepository extends JpaRepository<NewEmailToken, Long> {

    Optional<NewEmailToken> findByEmailToken(String token);

}
