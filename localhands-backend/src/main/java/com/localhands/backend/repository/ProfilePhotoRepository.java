package com.localhands.backend.repository;

import com.localhands.backend.entity.ProfilePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProfilePhotoRepository extends JpaRepository<ProfilePhoto, Long> {

    @Query("SELECT p.url FROM ProfilePhoto p")
    List<String> findAllUrls();

}
