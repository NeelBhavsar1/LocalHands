package com.localhands.backend.service.implementation;

import com.localhands.backend.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageServiceImpl implements FileStorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Override
    public String save(MultipartFile file, String uploadDir) {
        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            if (!uploadDir.endsWith("/")) {
                uploadDir += "/";
            }

            String key = uploadDir + fileName;

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));

            return "/" + key;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to S3.");
        }
    }

    @Override
    public void delete(String url) {
        try {
            if (url == null || url.isBlank()) {
                return;
            }

            String key = url.startsWith("/") ? url.substring(1) : url;

            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(request);

        } catch (Exception e) {
            System.out.println("Failed to delete file in S3: " + url);
        }
    }
}
