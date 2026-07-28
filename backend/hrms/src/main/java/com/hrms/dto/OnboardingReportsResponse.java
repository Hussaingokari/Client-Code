package com.hrms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
public class OnboardingReportsResponse {
    private long totalEmployees;
    private long approvedDocs;
    private long pendingDocs;
    private long rejectedDocs;

    private Map<String, Long> employeesByDepartment;

    private long notStarted;
    private long inProgress;
    private long completed;
}