package com.hrms.repository;

import com.hrms.entity.OnboardingDocument;
import com.hrms.enums.DocumentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OnboardingDocumentRepository extends JpaRepository<OnboardingDocument, Long> {

    List<OnboardingDocument> findByOnboardingId(Long onboardingId);

    Optional<OnboardingDocument> findByOnboardingIdAndDocumentKey(Long onboardingId, String documentKey);

    List<OnboardingDocument> findByStatusOrderByUploadedAtDesc(DocumentStatus status);

    long countByStatus(DocumentStatus status);

    List<OnboardingDocument> findTop5ByOrderByUploadedAtDesc();
}