package com.bank.dto;


import java.time.LocalDate;

public interface TransactionResponseDto {

    Long getTransactionId();
    LocalDate getTransactionDate();
    String getReferenceNumber();
    TransactionType getTransactionType();
    String getRemarks();
    String getAccountNumber();
    Long getCustomerId();
    String getCustomerName();
    String getMobileNo();
    Double getDebitAmount();
    Double getCreditAmount();
    Double getRunningBalance();




}
