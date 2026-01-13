package com.example.customer_onboarding.service;
import com.example.customer_onboarding.audit.OnboardingAuditLog;
import com.example.customer_onboarding.audit.OnboardingAuditLogRepositor;
import com.example.customer_onboarding.dto.CustomerOnboardingRequest;
import com.example.customer_onboarding.entity.CustomerOnboarding;
import com.example.customer_onboarding.exception.InvalidWorkflowActionException;
import com.example.customer_onboarding.exception.ResourceNotFoundException;
import com.example.customer_onboarding.repository.CustomerOnboardingRepository;
import com.example.customer_onboarding.workflow.OnboardingStage;
import com.example.customer_onboarding.workflow.OnboardingStatus;
import com.example.customer_onboarding.workflow.UserRole;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerOnboardingService {
    private final CustomerOnboardingRepository repository;
    private final OnboardingAuditLogRepositor auditRepository;

    public CustomerOnboardingService(CustomerOnboardingRepository repository,
        OnboardingAuditLogRepositor auditRepository){
        this.repository = repository;
        this.auditRepository = auditRepository;

    }
    // --------------------------
    // CREATE
    // --------------------------

    public CustomerOnboarding create(CustomerOnboardingRequest request){
        CustomerOnboarding customer = CustomerOnboarding.builder()
        .fullName(request.getFullName())
        .email(request.getEmail())
        .phone(request.getPhone())
        .build();
        return repository.save(customer);
    }
    // --------------------------
    // GET ALL
    // --------------------------
    public List<CustomerOnboarding> getAll(){
        return repository.findAll();
    }
    // --------------------------
    // GET BY ID
    // --------------------------
    public CustomerOnboarding getById(Long id){
        return repository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Customer onboarding not found with id:" + id));
    }
    // --------------------------
    // GET AUDIT LOGS
    // --------------------------
    public List<OnboardingAuditLog> getAuditLogsForCustomer(Long customerId){
        CustomerOnboarding customer = getById(customerId);

        return auditRepository.findAll().stream()
                .filter(log -> log.getOnboardingId().equals(customerId))
                .sorted((a, b) -> a.getActionAt().compareTo(b.getActionAt()))
                .collect(Collectors.toList());
    }
    
    // --------------------------
    // APPROVE
    // --------------------------
    public CustomerOnboarding approve(Long id, UserRole role){
        CustomerOnboarding customer = getById(id);
        if (customer.getOnboardingStatus() == OnboardingStatus.REJECTED) {
            throw new InvalidWorkflowActionException(
                "Rejected onboarding cannot be modified"
            );
        }
        validateRole(customer.getCurrentStage(),role);
        // Move to next stage or mark as approved if final stage
        switch (customer.getCurrentStage()) {
            case OPS_REVIEW -> customer.setCurrentStage(OnboardingStage.MANAGER_APPROVAL);
            case MANAGER_APPROVAL -> customer.setCurrentStage(OnboardingStage.COMPLIANCE_CHECK);
            case COMPLIANCE_CHECK -> {
                customer.setCurrentStage(OnboardingStage.COMPLETED);
                customer.setOnboardingStatus(OnboardingStatus.APPROVED);
            }
        case COMPLETED -> throw new InvalidWorkflowActionException("Customer onboarding is already completed");
    }
    // Set last action tracking fields
    customer.setLastActionBy(role.name());
    customer.setLastActionAt(LocalDateTime.now());
    logAudit(customer, role,"APPROVE");
    return repository.save(customer);
}
    // --------------------------
    // REJECT
    // --------------------------
    public CustomerOnboarding reject(Long id, UserRole role){
        CustomerOnboarding customer = getById(id);
        validateRole(customer.getCurrentStage(), role);
        
        //Reject Immediately
        customer.setCurrentStage(OnboardingStage.COMPLETED);
        customer.setOnboardingStatus(OnboardingStatus.REJECTED);
        // Set last action tracking fields
        customer.setLastActionBy(role.name());
        customer.setLastActionAt(LocalDateTime.now());
        logAudit(customer, role, "REJECTED");
        return repository.save(customer);
    }
    // --------------------------
    // Validate Role
    // --------------------------
    private void validateRole(OnboardingStage stage, UserRole role){
        switch (stage) {
            case OPS_REVIEW -> {
                if(role != UserRole.OPS_USER) 
                    throw new InvalidWorkflowActionException("Only OPS_USER can approve during OPS_REVIEW");
                }
            case MANAGER_APPROVAL -> {
                if(role != UserRole.OPS_MANAGER) 
                    throw new InvalidWorkflowActionException("Only OPS_MANAGER can approve during MANAGER_REVIEW");
            }
            case COMPLIANCE_CHECK -> 
            {
                if(role != UserRole.COMPLIANCE_USER) 
                    throw new InvalidWorkflowActionException("Only COMPLIANCE_USER user can approve during COMPLIANCE_REVIEW");
            }
            case COMPLETED -> {
                throw new InvalidWorkflowActionException("Customer onboarding is already completed");
            }
        }
    }

    //  Add Audit Logging Method
    public void logAudit(CustomerOnboarding customer, UserRole user, String action){
        OnboardingAuditLog log = OnboardingAuditLog.builder().
        onboardingId(customer.getCustomerId()).
        stage(customer.getCurrentStage()).
        status(customer.getOnboardingStatus()).
        actionBy(user).
        action(action).
        actionAt(LocalDateTime.now()).
        build();

        auditRepository.save(log);

    }
    
}
