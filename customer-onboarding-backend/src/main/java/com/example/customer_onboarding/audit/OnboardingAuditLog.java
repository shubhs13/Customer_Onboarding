package com.example.customer_onboarding.audit;

import java.time.LocalDateTime;

import com.example.customer_onboarding.workflow.OnboardingStage;
import com.example.customer_onboarding.workflow.OnboardingStatus;
import com.example.customer_onboarding.workflow.UserRole;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingAuditLog {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long onboardingId;

    @Enumerated(EnumType.STRING)
    private OnboardingStage stage;

    @Enumerated(EnumType.STRING)
    private OnboardingStatus status;

    @Enumerated(EnumType.STRING)
    private UserRole actionBy;

    private String action; // APPROVED / REJECTED

    private LocalDateTime actionAt;


}
