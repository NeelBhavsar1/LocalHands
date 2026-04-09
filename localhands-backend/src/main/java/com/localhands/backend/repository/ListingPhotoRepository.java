package com.localhands.backend.repository;

import com.localhands.backend.entity.ListingPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ListingPhotoRepository extends JpaRepository<ListingPhoto, Long> {

    @Query("SELECT p.url FROM ListingPhoto p")
    List<String> findAllUrls();

}
