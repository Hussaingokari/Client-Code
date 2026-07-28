package com.hrms.entity;

import com.hrms.enums.DocumentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "onboarding_id", nullable = false)
    private Onboarding onboarding;

    // e.g. AADHAR_CARD, PAN_CARD, BANK_PASSBOOK, SSC_CERTIFICATE,
    // INTER_DIPLOMA_CERTIFICATE, DEGREE_CERTIFICATE, OFFER_LETTER
    @Column(nullable = false)
    private String documentKey;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DocumentStatus status = DocumentStatus.PENDING;

    private String fileUrl;
    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String rejectionRemarks;

    private LocalDateTime uploadedAt;
    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by_hr_id")
    private Employee reviewedByHr;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}