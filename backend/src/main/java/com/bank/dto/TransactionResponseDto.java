package com.bank.dto;


import java.time.LocalDate;

public interface TransactionResponseDto {

    Long getTransactionId();
    LocalDate getTransactionDate();
    String getReferenceNumber();
    TransactionType getTransactionType();
    String getRemarks();
    String getFromAccountNumber();
    String getToAccountNumber();
    Long getFromCustomerId();
    String getFromCustomerName();
    String getFromMobileNo();
    Long getToCustomerId();
    String getToCustomerName();
    String getToMobileNo();

    Double getDebitAmount();
    Double getCreditAmount();
    Double getFromAcRunningBalance();
    Double getToAcRunningBalance();




}
