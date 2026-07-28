package com.hrms.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityItemResponse {
    private String type; // DOCUMENT_UPLOADED, ONBOARDING_COMPLETED, PENDING_SUMMARY
    private String title;
    private String description;
    private LocalDateTime timestamp;
}