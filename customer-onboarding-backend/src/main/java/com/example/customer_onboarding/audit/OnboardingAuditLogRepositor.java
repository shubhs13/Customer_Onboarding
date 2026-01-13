package com.example.customer_onboarding.audit;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OnboardingAuditLogRepositor
    extends JpaRepository<OnboardingAuditLog, Long> {
    
}