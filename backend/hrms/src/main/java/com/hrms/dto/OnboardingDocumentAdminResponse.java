package com.hrms.dto;

import com.hrms.entity.OnboardingDocument;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OnboardingDocumentAdminResponse {
    private Long id;
    private Long onboardingId;
    private String documentKey;
    private String status;
    private String fileUrl;
    private String fileName;
    private String rejectionRemarks;
    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;

    private String employeeName;
    private String employeeCode;
    private String department;

    public static OnboardingDocumentAdminResponse from(OnboardingDocument doc) {
        return OnboardingDocumentAdminResponse.builder()
                .id(doc.getId())
                .onboardingId(doc.getOnboarding().getId())
                .documentKey(doc.getDocumentKey())
                .status(doc.getStatus().name())
                .fileUrl(doc.getFileUrl())
                .fileName(doc.getFileName())
                .rejectionRemarks(doc.getRejectionRemarks())
                .uploadedAt(doc.getUploadedAt())
                .reviewedAt(doc.getReviewedAt())
                .employeeName(doc.getOnboarding().getEmployee().getFirstName() + " "
                        + doc.getOnboarding().getEmployee().getLastName())
                .employeeCode(doc.getOnboarding().getEmployee().getEmployeeId())
                .department(doc.getOnboarding().getEmployee().getDepartment())
                .build();
    }
}