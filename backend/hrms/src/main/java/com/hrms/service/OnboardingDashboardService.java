package com.hrms.service;

import com.hrms.dto.ActivityItemResponse;
import com.hrms.dto.OnboardingDashboardResponse;
import com.hrms.dto.OnboardingReportsResponse;
import com.hrms.entity.Onboarding;
import com.hrms.entity.OnboardingDocument;
import com.hrms.enums.DocumentStatus;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.OnboardingDocumentRepository;
import com.hrms.repository.OnboardingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OnboardingDashboardService {

        private final EmployeeRepository employeeRepository;
        private final OnboardingRepository onboardingRepository;
        private final OnboardingDocumentRepository documentRepository;

        private static final Map<String, String> DOC_LABELS = Map.ofEntries(
                        Map.entry("OFFER_LETTER", "Offer Letter"),
                        Map.entry("AADHAR_CARD", "Aadhaar Card"),
                        Map.entry("PAN_CARD", "PAN Card"),
                        Map.entry("SSC_CERTIFICATE", "SSC Certificate"),
                        Map.entry("INTER_DIPLOMA_CERTIFICATE", "Inter/Diploma Certificate"),
                        Map.entry("DEGREE_CERTIFICATE", "Degree Certificate"),
                        Map.entry("BANK_PASSBOOK", "Bank Passbook"));

        @Transactional(readOnly = true)
        public OnboardingDashboardResponse getDashboard() {
                long totalEmployees = employeeRepository.count();
                long pendingOnboarding = onboardingRepository.countByStatusNot(Onboarding.OnboardingStatus.COMPLETED);
                long completedOnboarding = onboardingRepository.countByStatus(Onboarding.OnboardingStatus.COMPLETED);
                long pendingDocVerifications = documentRepository.countByStatus(DocumentStatus.UNDER_REVIEW);

                List<ActivityItemResponse> activity = new ArrayList<>();

                if (pendingDocVerifications > 0) {
                        List<OnboardingDocument> recentPending = documentRepository.findTop5ByOrderByUploadedAtDesc()
                                        .stream()
                                        .filter(d -> d.getStatus() == DocumentStatus.UNDER_REVIEW)
                                        .toList();
                        if (!recentPending.isEmpty()) {
                                activity.add(ActivityItemResponse.builder()
                                                .type("PENDING_SUMMARY")
                                                .title("Pending Verification")
                                                .description(pendingDocVerifications + " document"
                                                                + (pendingDocVerifications == 1 ? "" : "s") + " "
                                                                + (pendingDocVerifications == 1 ? "is" : "are")
                                                                + " awaiting your review.")
                                                .timestamp(recentPending.get(0).getUploadedAt())
                                                .build());
                        }
                }

                for (Onboarding o : onboardingRepository
                                .findTop5ByStatusOrderByUpdatedAtDesc(Onboarding.OnboardingStatus.COMPLETED)) {
                        activity.add(ActivityItemResponse.builder()
                                        .type("ONBOARDING_COMPLETED")
                                        .title("Onboarding Completed")
                                        .description(o.getEmployee().getFirstName() + " "
                                                        + o.getEmployee().getLastName()
                                                        + " has completed all onboarding steps.")
                                        .timestamp(o.getUpdatedAt())
                                        .build());
                }

                for (OnboardingDocument d : documentRepository.findTop5ByOrderByUploadedAtDesc()) {
                        String label = DOC_LABELS.getOrDefault(d.getDocumentKey(), d.getDocumentKey());
                        activity.add(ActivityItemResponse.builder()
                                        .type("DOCUMENT_UPLOADED")
                                        .title("New Document Uploaded")
                                        .description(d.getOnboarding().getEmployee().getFirstName() + " "
                                                        + d.getOnboarding().getEmployee().getLastName()
                                                        + " uploaded " + label + ". Please review.")
                                        .timestamp(d.getUploadedAt())
                                        .build());
                }

                List<ActivityItemResponse> sorted = activity.stream()
                                .sorted(Comparator.comparing(ActivityItemResponse::getTimestamp,
                                                Comparator.nullsLast(Comparator.reverseOrder())))
                                .limit(10)
                                .toList();

                return OnboardingDashboardResponse.builder()
                                .totalEmployees(totalEmployees)
                                .pendingOnboarding(pendingOnboarding)
                                .completedOnboarding(completedOnboarding)
                                .pendingDocVerifications(pendingDocVerifications)
                                .recentActivity(sorted)
                                .build();
        }

        @Transactional(readOnly = true)
        public OnboardingReportsResponse getReports() {
                long totalEmployees = employeeRepository.count();

                Map<String, Long> byDept = new LinkedHashMap<>();
                for (String dept : employeeRepository.findAllDepartments()) {
                        byDept.put(dept, employeeRepository.countByDepartment(dept));
                }

                long notStarted = totalEmployees - onboardingRepository.count();
                long inProgress = onboardingRepository.countByStatus(Onboarding.OnboardingStatus.IN_PROGRESS);
                long completed = onboardingRepository.countByStatus(Onboarding.OnboardingStatus.COMPLETED);

                return OnboardingReportsResponse.builder()
                                .totalEmployees(totalEmployees)
                                .approvedDocs(documentRepository.countByStatus(DocumentStatus.APPROVED))
                                .pendingDocs(documentRepository.countByStatus(DocumentStatus.UNDER_REVIEW))
                                .rejectedDocs(documentRepository.countByStatus(DocumentStatus.REJECTED))
                                .employeesByDepartment(byDept)
                                .notStarted(notStarted)
                                .inProgress(inProgress)
                                .completed(completed)
                                .build();
        }
}