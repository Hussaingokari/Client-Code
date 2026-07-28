package com.hrms.dto;

import lombok.Data;

@Data
public class DocumentUploadRequest {
    private Long onboardingId;
    private String documentKey;   // e.g. AADHAR_CARD, PAN_CARD, etc.
    private String fileName;
    private String fileUrl;       // absolute URL, already resolved on the frontend
}