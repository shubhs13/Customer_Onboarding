package com.example.customer_onboarding.exception;

public class InvalidWorkflowActionException extends RuntimeException{
    public InvalidWorkflowActionException(String message){
        super(message);
    }
    
}
