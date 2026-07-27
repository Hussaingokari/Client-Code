package com.hrms.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class OnboardingDashboardResponse {
    private long totalEmployees;
    private long pendingOnboarding;
    private long completedOnboarding;
    private long pendingDocVerifications;
    private List<ActivityItemResponse> recentActivity;
}