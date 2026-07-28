package com.hrms.dto;

import com.hrms.entity.OnboardingDocument;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OnboardingDocumentResponse {
    private Long id;
    private String documentKey;
    private String status;
    private String fileUrl;
    private String fileName;
    private String rejectionRemarks;
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;

    public static OnboardingDocumentResponse from(OnboardingDocument doc) {
        return OnboardingDocumentResponse.builder()
                .id(doc.getId())
                .documentKey(doc.getDocumentKey())
                .status(doc.getStatus().name())
                .fileUrl(doc.getFileUrl())
                .fileName(doc.getFileName())
                .rejectionRemarks(doc.getRejectionRemarks())
                .uploadedAt(doc.getUploadedAt())
                .reviewedAt(doc.getReviewedAt())
                .build();
    }
}