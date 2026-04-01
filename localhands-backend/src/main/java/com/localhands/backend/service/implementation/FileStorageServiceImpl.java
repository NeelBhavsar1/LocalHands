package com.localhands.backend.service.implementation;

import com.localhands.backend.service.FileStorageService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@AllArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    @Override
    public String save(MultipartFile file) {
        try {

            String uploadDir = "uploads/listing-images/";

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path = Paths.get(uploadDir + fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            return "/uploads/listing-images/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file.");
        }
    }

    @Override
    public void delete(String url) {
        try {
            Path path = Paths.get("." + url);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            System.out.println("Failed to delete file in " + url);
        }
    }
}
