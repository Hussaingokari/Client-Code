package com.hrms.controller;

import com.hrms.dto.DocumentUploadRequest;
import com.hrms.entity.OnboardingDocument;
import com.hrms.service.OnboardingDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/onboarding-documents")
@RequiredArgsConstructor
public class OnboardingDocumentController {

    private final OnboardingDocumentService documentService;

    @PostMapping
    public ResponseEntity<OnboardingDocument> registerDocument(
            @RequestBody DocumentUploadRequest request) {
        OnboardingDocument saved = documentService.registerDocument(request);
        return ResponseEntity.ok(saved);
    }
}