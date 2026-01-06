package com.bank.service;

import com.bank.dto.TransactionRequestDto;
import com.bank.dto.TransactionResponseDto;
import com.bank.dto.TransactionType;
import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.exception.BankException;
import com.bank.exception.InsufficientBalanceException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private static final String INACTIVE = "inactive";

    private final TransactionRepository transactionRepository;

    private final AccountRepository accountRepository;


    @Override
    @Transactional
    public Transaction doTransaction(TransactionRequestDto request) {
        try {
            Transaction transaction = null;
            switch (request.getTransactionType()) {
                case DEPOSIT -> transaction = doDeposit(request);
                case WITHDRAWAL -> transaction = doWithdrawal(request);
                case ACCOUNT_TRANSFER -> transaction = doTransfer(request);
            }

            transaction.setTransactionDate(LocalDateTime.now());
            transactionRepository.save(transaction);
            String newReference = "TRX-" + getNewTransactionReference() +  ( transaction.getId() !=null? ("-" +transaction.getId()) : "");
            transaction.setReference(newReference);
            log.info("Transaction successful: {}", transaction.getId());
            return transaction;


        } catch (Exception e) {
            log.error("Transaction operation error: {}", e.getMessage());
            throw new BankException("Transaction operation error: " + e.getMessage());
        }

    }

    @Override
    public TransactionResponseDto getTransactionById(Long id) {
        return transactionRepository.getAccountStatementById(id);
    }

    @Override
    public Page<TransactionResponseDto> getPagedAccountStatement(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, TransactionType transactionType, Pageable pageable) {
        return transactionRepository.getPagedAccountStatement( accountNumber,referenceNumber,  startDate,  endDate, transactionType!=null? transactionType.toString(): null,   pageable);
    }

    @Override
    public List<TransactionResponseDto> getAccountStatementList(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, TransactionType transactionType) {
        return transactionRepository.getAccountStatementList( accountNumber,referenceNumber,  startDate,  endDate, transactionType!=null? transactionType.toString(): null);
    }

    private Transaction doDeposit(TransactionRequestDto request) {
        if (request.getToAccountNumber() == null) {
            throw new BankException(" toAccountNumber is required");
        }

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber()).orElseThrow(() -> new BankException("Account not found by accountNumber: " + request.getToAccountNumber()));

        if (toAccount.getStatus().equalsIgnoreCase(INACTIVE)) {
            throw new BankException("Account is Inactive");
        }

        if (request.getTransactionAmount() > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        Double totalTrx = getTodayTotalTrx(toAccount.getId()) + request.getTransactionAmount();

        if (totalTrx > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        toAccount.setBalance(toAccount.getBalance() + request.getTransactionAmount());
        accountRepository.save(toAccount);

        Transaction transaction = new Transaction();
        transaction.setToAccount(toAccount)
                .setToAcRunningBalance(toAccount.getBalance())
                .setTransactionType(request.getTransactionType())
                .setAmount(request.getTransactionAmount())
                .setRemarks(request.getRemarks());
        return transaction;

    }

    private Transaction doWithdrawal(TransactionRequestDto request) {
        if (request.getFromAccountNumber() == null) {
            throw new BankException("fromAccountNumber is required");
        }
        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber()).orElseThrow(() -> new BankException("Account not found by accountNumber: " + request.getFromAccountNumber()));

        if (fromAccount.getStatus().equalsIgnoreCase(INACTIVE)) {
            throw new BankException("Account is Inactive");
        }

        if (request.getTransactionAmount() > fromAccount.getBalance()) {
            throw new InsufficientBalanceException("Insufficient Balance of the Account.");
        }

        if (request.getTransactionAmount() > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        Double totalTrx = getTodayTotalTrx(fromAccount.getId()) + request.getTransactionAmount();

        if (totalTrx > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        fromAccount.setBalance(fromAccount.getBalance() - request.getTransactionAmount());
        accountRepository.save(fromAccount);

        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount)
                .setFromAcRunningBalance(fromAccount.getBalance())
                .setTransactionType(request.getTransactionType())
                .setAmount(request.getTransactionAmount())
                .setRemarks(request.getRemarks());
        return transaction;

    }

    private Transaction doTransfer(TransactionRequestDto request) {

        if (request.getToAccountNumber() == null || request.getFromAccountNumber() == null) {
            throw new BankException("toAccountNumber, fromAccountNumber are required.");
        }

        Account fromAccount = accountRepository.findByAccountNumber(request.getFromAccountNumber()).orElseThrow(() -> new BankException("fromAccount not found by accountNumber: " + request.getFromAccountNumber()));
        if (fromAccount.getStatus().equalsIgnoreCase(INACTIVE)) {
            throw new BankException("fromAccount is Inactive");
        }

        if (request.getTransactionAmount() > fromAccount.getBalance()) {
            throw new InsufficientBalanceException("Insufficient Balance of the fromAccount.");
        }

        if (request.getTransactionAmount() > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for fromAccountNumber: " + request.getFromAccountNumber());
        }

        Double fromTotalTrx = getTodayTotalTrx(fromAccount.getId()) + request.getTransactionAmount();

        if (fromTotalTrx > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for fromAccountNumber: " + request.getFromAccountNumber());

        }

        fromAccount.setBalance(fromAccount.getBalance() - request.getTransactionAmount());
        accountRepository.save(fromAccount);

        Account toAccount = accountRepository.findByAccountNumber(request.getToAccountNumber()).orElseThrow(() -> new BankException("toAccount not found by accountNumber: " + request.getToAccountNumber()));
        if (toAccount.getStatus().equalsIgnoreCase(INACTIVE)) {
            throw new BankException("toAccount is Inactive");
        }

        if (request.getTransactionAmount() > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for toAccountNumber: " + request.getToAccountNumber());

        }

        Double toTotalTrx = getTodayTotalTrx(toAccount.getId()) + request.getTransactionAmount();

        if (toTotalTrx > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for toAccountNumber: " + request.getToAccountNumber());
        }

        toAccount.setBalance(toAccount.getBalance() + request.getTransactionAmount());
        accountRepository.save(toAccount);


        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount)
                .setFromAcRunningBalance(fromAccount.getBalance())
                .setToAccount(toAccount)
                .setToAcRunningBalance(toAccount.getBalance())
                .setTransactionType(request.getTransactionType())
                .setAmount(request.getTransactionAmount())
                .setRemarks(request.getRemarks());
        return transaction;

    }


    private Double getTodayTotalTrx(Long accountId) {
        Double total = transactionRepository.getTotalTrxByAccountId(accountId, LocalDate.now(), LocalDate.now());
        return total != null ? total : 0;
    }

    private String getNewTransactionReference() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        return LocalDateTime.now().format(formatter);
    }


}
