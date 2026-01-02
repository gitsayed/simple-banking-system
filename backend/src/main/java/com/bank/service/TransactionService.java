package com.bank.service;

import com.bank.entity.Account;
import com.bank.entity.Transaction;
import com.bank.exception.InsufficientBalanceException;
import com.bank.repository.AccountRepository;
import com.bank.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private AccountRepository accountRepository;

    private static final double DAILY_WITHDRAWAL_LIMIT = 10000.0;

    @Transactional
    public Transaction deposit(Long accountId, double amount, String remarks) {
        Account account = accountRepository.findById(accountId).orElseThrow();
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType("Deposit");
        txn.setAmount(amount);
        txn.setRemarks(remarks);
        txn.setReference(UUID.randomUUID().toString()); // Overridden by trigger, but for demo
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction withdraw(Long accountId, double amount, String remarks) {
        Account account = accountRepository.findById(accountId).orElseThrow();
        if (account.getBalance() < amount) {
            throw new InsufficientBalanceException("Insufficient balance");
        }
        Double todayWithdrawals = transactionRepository.getTodayWithdrawalSum(accountId);
        if (todayWithdrawals == null) todayWithdrawals = 0.0;
        if (todayWithdrawals + amount > DAILY_WITHDRAWAL_LIMIT) {
            throw new RuntimeException("Daily withdrawal limit exceeded");
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);

        Transaction txn = new Transaction();
        txn.setAccount(account);
        txn.setType("Withdrawal");
        txn.setAmount(amount);
        txn.setRemarks(remarks);
        txn.setReference(UUID.randomUUID().toString());
        return transactionRepository.save(txn);
    }

    @Transactional
    public Transaction transfer(Long fromAccountId, Long toAccountId, double amount, String remarks) {
        // Withdraw from fromAccount
        withdraw(fromAccountId, amount, remarks);
        // Deposit to toAccount
        deposit(toAccountId, amount, remarks);

        Transaction txn = new Transaction();
        txn.setType("Transfer");
        txn.setAmount(amount);
        txn.setFromAccount(accountRepository.findById(fromAccountId).get());
        txn.setToAccount(accountRepository.findById(toAccountId).get());
        txn.setRemarks(remarks);
        txn.setReference(UUID.randomUUID().toString());
        return transactionRepository.save(txn);
    }

    // Account Statement
    public Page<Transaction> getAccountStatement(Long accountId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return transactionRepository.findByAccountIdAndDateRange(accountId, startDate, endDate, pageable);
    }
}
