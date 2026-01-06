package com.bank.service;

import com.bank.dto.TransactionRequestDto;
import com.bank.dto.TransactionResponseDto;
import com.bank.dto.TransactionType;
import com.bank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface TransactionService {

    Transaction doTransaction( TransactionRequestDto request);
    TransactionResponseDto getTransactionById( Long id);
    Page<TransactionResponseDto> getPagedAccountStatement(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, TransactionType transactionType, Pageable pageable);
    List<TransactionResponseDto> getAccountStatementList(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, TransactionType transactionType);
}
