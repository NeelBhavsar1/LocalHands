package com.localhands.backend.repository;

import com.localhands.backend.entity.Role;
import com.localhands.backend.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {

    boolean existsByRoleName(RoleName roleName);

    Optional<Role> findByRoleName(RoleName roleName);

}
