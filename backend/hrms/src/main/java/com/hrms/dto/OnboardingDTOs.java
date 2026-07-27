package com.hrms.dto;

import com.hrms.entity.Onboarding.OnboardingStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class OnboardingDTOs {

    @Data
    public static class UpdateRequest {
        private Boolean offerLetterSigned;
        private Boolean idProofSubmitted;
        private Boolean educationDocsSubmitted;
        private Boolean bankDetailsSubmitted;
        private Boolean emailCreated;
        private Boolean systemAccessGiven;
        private String remarks;
        private OnboardingStatus status;
    }

    @Data
    public static class Response {
        private Long id;
        private Long employeeId;
        private String employeeName;
        private String employeeCode;
        private String department;
        private LocalDate joiningDate;
        private OnboardingStatus status;
        private int completionPercent;
        private String employeeEmail;
        private String employeePhone;
        private String employeeDesignation;
        private java.time.LocalDate employeeDateOfBirth;
        // Checklist
        private Boolean offerLetterSigned;
        private Boolean idProofSubmitted;
        private Boolean educationDocsSubmitted;
        private Boolean bankDetailsSubmitted;

        private Boolean emailCreated;
        private Boolean systemAccessGiven;
        private String remarks;
        private String assignedHrName;
        private LocalDateTime createdAt;
    }
}