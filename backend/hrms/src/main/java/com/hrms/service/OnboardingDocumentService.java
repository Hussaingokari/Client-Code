package com.hrms.service;

import com.hrms.dto.DocumentUploadRequest;
import com.hrms.dto.OnboardingDocumentAdminResponse;
import com.hrms.entity.Employee;
import com.hrms.entity.Notification.NotificationType;
import com.hrms.entity.Onboarding;
import com.hrms.entity.OnboardingDocument;
import com.hrms.enums.DocumentStatus;
import com.hrms.repository.EmployeeRepository;
import com.hrms.repository.OnboardingDocumentRepository;
import com.hrms.repository.OnboardingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OnboardingDocumentService {

        private final OnboardingDocumentRepository documentRepository;
        private final OnboardingRepository onboardingRepository;
        private final EmployeeRepository employeeRepository;
        private final NotificationService notificationService;

        @Transactional
        public OnboardingDocument registerDocument(DocumentUploadRequest request) {
                Onboarding onboarding = onboardingRepository.findById(request.getOnboardingId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Onboarding not found: " + request.getOnboardingId()));

                OnboardingDocument document = documentRepository
                                .findFirstByOnboardingIdAndDocumentKey(request.getOnboardingId(), request.getDocumentKey())
                                .orElse(OnboardingDocument.builder()
                                                .onboarding(onboarding)
                                                .documentKey(request.getDocumentKey())
                                                .build());

                document.setFileName(request.getFileName());
                document.setFileUrl(request.getFileUrl());
                document.setStatus(DocumentStatus.UNDER_REVIEW);
                document.setUploadedAt(LocalDateTime.now());
                document.setRejectionRemarks(null);
                document.setReviewedAt(null);
                document.setReviewedByHr(null);

                OnboardingDocument saved = documentRepository.save(document);

                Employee employee = onboarding.getEmployee();
                notificationService.notifyAllAdmins(
                                "New Document Uploaded",
                                employee.getFirstName() + " " + employee.getLastName()
                                                + " uploaded " + request.getDocumentKey().replace("_", " ")
                                                + ". Please review.",
                                NotificationType.DOCUMENT_UPLOADED,
                                "OnboardingDocument",
                                saved.getId());

                return saved;
        }

        @Transactional(readOnly = true)
        public List<OnboardingDocumentAdminResponse> getByStatus(DocumentStatus status) {
                return documentRepository.findByStatusOrderByUploadedAtDesc(status)
                                .stream()
                                .map(OnboardingDocumentAdminResponse::from)
                                .toList();
        }

        @Transactional(readOnly = true)
        public Map<String, Long> getStatusCounts() {
                return Map.of(
                                "pending", documentRepository.countByStatus(DocumentStatus.UNDER_REVIEW),
                                "approved", documentRepository.countByStatus(DocumentStatus.APPROVED),
                                "rejected", documentRepository.countByStatus(DocumentStatus.REJECTED));
        }

        @Transactional
        public OnboardingDocument approveDocument(Long documentId, String hrEmail) {
                OnboardingDocument doc = documentRepository.findById(documentId)
                                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

                Employee hr = employeeRepository.findByEmail(hrEmail)
                                .orElseThrow(() -> new IllegalArgumentException("HR user not found: " + hrEmail));

                doc.setStatus(DocumentStatus.APPROVED);
                doc.setReviewedAt(LocalDateTime.now());
                doc.setReviewedByHr(hr);
                doc.setRejectionRemarks(null);

                OnboardingDocument saved = documentRepository.save(doc);

                Employee employee = doc.getOnboarding().getEmployee();
                notificationService.createAndSend(
                                employee,
                                "Document Approved",
                                "Your " + doc.getDocumentKey().replace("_", " ") + " has been approved.",
                                NotificationType.DOCUMENT_APPROVED,
                                "OnboardingDocument",
                                saved.getId());

                return saved;
        }

        @Transactional
        public OnboardingDocument rejectDocument(Long documentId, String hrEmail, String remarks) {
                OnboardingDocument doc = documentRepository.findById(documentId)
                                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + documentId));

                Employee hr = employeeRepository.findByEmail(hrEmail)
                                .orElseThrow(() -> new IllegalArgumentException("HR user not found: " + hrEmail));

                doc.setStatus(DocumentStatus.REJECTED);
                doc.setReviewedAt(LocalDateTime.now());
                doc.setReviewedByHr(hr);
                doc.setRejectionRemarks(remarks);

                OnboardingDocument saved = documentRepository.save(doc);

                Employee employee = doc.getOnboarding().getEmployee();
                notificationService.createAndSend(
                                employee,
                                "Document Rejected",
                                "Your " + doc.getDocumentKey().replace("_", " ") + " was rejected: " + remarks,
                                NotificationType.DOCUMENT_REJECTED,
                                "OnboardingDocument",
                                saved.getId());

                return saved;
        }
}