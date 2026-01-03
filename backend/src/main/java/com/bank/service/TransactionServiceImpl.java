package com.bank.service;

import com.bank.dto.TransactionRequestDto;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

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
            String newReference = "TXN-" + getNewTransactionReference() +  ( transaction.getId() !=null? ("-" +transaction.getId()) : "");
            transaction.setReference(newReference);
            log.info("Transaction successful: {}", transaction.getId());
            return transaction;


        } catch (Exception e) {
            log.error("Transaction operation error: {}", e.getMessage());
            throw new BankException("Transaction operation error: " + e.getMessage());
        }

    }


    private Transaction doDeposit(TransactionRequestDto request) {
        if (request.getToAccountId() == null) {
            throw new BankException(" toAccountId is required");
        }
        Account toAccount = accountRepository.findById(request.getToAccountId()).orElseThrow(() -> new BankException("Account not found by id: " + request.getToAccountId()));

        if (toAccount.getStatus().equalsIgnoreCase("inactive")) {
            throw new BankException("Account is Inactive");
        }

        if (request.getTransactionAmount() > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        Double totalTrx = getTodayTotalTrx(request.getToAccountId()) + request.getTransactionAmount();

        if (totalTrx > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        toAccount.setBalance(toAccount.getBalance() + request.getTransactionAmount());
        accountRepository.save(toAccount);

        Transaction transaction = new Transaction();
        transaction.setToAccount(toAccount)
                .setToAcRunningBalance(toAccount.getBalance())
                .setType(request.getTransactionType())
                .setAmount(request.getTransactionAmount())
                .setRemarks(request.getRemarks());
        return transaction;

    }

    private Transaction doWithdrawal(TransactionRequestDto request) {
        if (request.getFromAccountId() == null) {
            throw new BankException(" fromAccountId is required");
        }
        Account fromAccount = accountRepository.findById(request.getFromAccountId()).orElseThrow(() -> new BankException("Account not found by id: " + request.getFromAccountId()));

        if (fromAccount.getStatus().equalsIgnoreCase("inactive")) {
            throw new BankException("Account is Inactive");
        }

        if (request.getTransactionAmount() > fromAccount.getBalance()) {
            throw new InsufficientBalanceException("Insufficient Balance of the Account.");
        }

        if (request.getTransactionAmount() > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        Double totalTrx = getTodayTotalTrx(request.getFromAccountId()) + request.getTransactionAmount();

        if (totalTrx > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit!");
        }

        fromAccount.setBalance(fromAccount.getBalance() - request.getTransactionAmount());
        accountRepository.save(fromAccount);

        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount)
                .setFromAcRunningBalance(fromAccount.getBalance())
                .setType(request.getTransactionType())
                .setAmount(request.getTransactionAmount())
                .setRemarks(request.getRemarks());
        return transaction;

    }

    private Transaction doTransfer(TransactionRequestDto request) {

        if (request.getToAccountId() == null || request.getFromAccountId() == null) {
            throw new BankException("toAccountId, fromAccountId are required.");
        }

        Account fromAccount = accountRepository.findById(request.getFromAccountId()).orElseThrow(() -> new BankException("fromAccount not found by id: " + request.getFromAccountId()));
        if (fromAccount.getStatus().equalsIgnoreCase("inactive")) {
            throw new BankException("fromAccount is Inactive");
        }

        if (request.getTransactionAmount() > fromAccount.getBalance()) {
            throw new InsufficientBalanceException("Insufficient Balance of the fromAccount.");
        }

        if (request.getTransactionAmount() > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for fromAccountId: " + request.getFromAccountId());
        }

        Double fromTotalTrx = getTodayTotalTrx(request.getFromAccountId()) + request.getTransactionAmount();

        if (fromTotalTrx > fromAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for fromAccountId: " + request.getFromAccountId());

        }

        fromAccount.setBalance(fromAccount.getBalance() - request.getTransactionAmount());
        accountRepository.save(fromAccount);

        Account toAccount = accountRepository.findById(request.getToAccountId()).orElseThrow(() -> new BankException("toAccount not found by id: " + request.getToAccountId()));
        if (toAccount.getStatus().equalsIgnoreCase("inactive")) {
            throw new BankException("toAccount is Inactive");
        }

        if (request.getTransactionAmount() > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for toAccountId: " + request.getToAccountId());

        }

        Double toTotalTrx = getTodayTotalTrx(request.getToAccountId()) + request.getTransactionAmount();

        if (toTotalTrx > toAccount.getDailyTransactionLimit()) {
            throw new BankException("Transaction amount exists daily transaction limit for toAccountId: " + request.getToAccountId());
        }

        toAccount.setBalance(toAccount.getBalance() + request.getTransactionAmount());
        accountRepository.save(toAccount);


        Transaction transaction = new Transaction();
        transaction.setFromAccount(fromAccount)
                .setFromAcRunningBalance(fromAccount.getBalance())
                .setToAccount(toAccount)
                .setToAcRunningBalance(toAccount.getBalance())
                .setType(request.getTransactionType())
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
