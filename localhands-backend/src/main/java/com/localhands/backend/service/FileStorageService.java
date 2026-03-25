package com.localhands.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {
    public String save(MultipartFile file);

    public void delete(String url);
}
