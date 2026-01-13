package com.example.customer_onboarding.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handelNotFoud(ResourceNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).
            body(errorResponse(ex.getMessage(),HttpStatus.NOT_FOUND));
    }

    @ExceptionHandler(InvalidWorkflowActionException.class)
    public ResponseEntity<?> handelInvalidWorkflow(InvalidWorkflowActionException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).
            body(errorResponse(ex.getMessage(),HttpStatus.BAD_REQUEST ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handelGeneric(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).
            body(errorResponse("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR));
    }

    private Map<String,Object> errorResponse(String message, HttpStatus status){
        return Map.of(
            "timestamp: ",LocalDateTime.now(),
            "status:",status.value(),
            "error:",status.getReasonPhrase(),
            "message:",message
        );
    } 
}
