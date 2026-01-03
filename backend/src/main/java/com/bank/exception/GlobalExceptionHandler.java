package com.bank.exception;


import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final HttpServletRequest request;

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<Object> handleAuthException(
            AuthException exception) {
        return getObjectResponseEntity(exception, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(BankException.class)
    public ResponseEntity<Object> handleBankException(
            BankException exception) {
        return getObjectResponseEntity(exception, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<Object> handleInsufficientBalanceException(
            InsufficientBalanceException exception) {
        return getObjectResponseEntity(exception, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(
            MethodArgumentNotValidException exception) {
        return getObjectResponseEntity(exception,  HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolation(
            ConstraintViolationException exception) {
        return getObjectResponseEntity(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Object> handleIllegalState(
            IllegalStateException exception) {
        return getObjectResponseEntity(exception, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNoSuchElementException(
            NoSuchElementException exception) {
        return getObjectResponseEntity(exception, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFoundException(
            UsernameNotFoundException exception) {
        return getObjectResponseEntity(exception, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentialsException(
            BadCredentialsException exception) {
        return getObjectResponseEntity(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDeniedException(
            AccessDeniedException exception) {
        return getObjectResponseEntity(exception, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<Object> handleSignatureException(
            SignatureException exception) {
        return getObjectResponseEntity(exception, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<Object> handleMalformedJwtException(
            MalformedJwtException exception) {
        return getObjectResponseEntity(exception, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(UnsupportedJwtException.class)
    public ResponseEntity<Object> handleUnsupportedJwtException(
            UnsupportedJwtException exception) {
        return getObjectResponseEntity(exception, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(
            Exception exception) {
        return getObjectResponseEntity(exception, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @NonNull
    private ResponseEntity<Object> getObjectResponseEntity(Exception exception, HttpStatus httpStatus) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", httpStatus.value());
        body.put("error", httpStatus.getReasonPhrase());
        body.put("message", exception.getMessage());
        body.put("path", request.getServletPath());

        return new ResponseEntity<>(body, httpStatus);
    }
}
