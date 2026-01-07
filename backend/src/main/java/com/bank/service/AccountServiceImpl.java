package com.bank.service;


import com.bank.dto.AccountRequestDto;
import com.bank.dto.AccountResponseDto;
import com.bank.dto.AccountResponseWithCustomerDto;
import com.bank.dto.AccountUpdateRequestDto;
import com.bank.entity.Account;
import com.bank.entity.Customer;
import com.bank.exception.BankException;
import com.bank.repository.AccountRepository;
import com.bank.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;



    @Override
    @Transactional
    public Account createAccount(AccountRequestDto request) {
        try {
            String newAcNo = accountRepository.getNewAccountNumber();
            Customer customer = customerRepository.findById(request.getCustomerId()).orElseThrow(() -> new BankException("Customer not found by id: " + request.getCustomerId()));

            Account account = new Account();
            account.setAccountNumber(newAcNo)
                    .setCustomer(customer)
                    .setBalance(request.getBalance())
                    .setDailyTransactionLimit(request.getDailyTransactionLimit())
                    .setAccountType(request.getAccountType())
                    .setStatus(request.getStatus());
            account = accountRepository.save(account);
            log.info("Account successfully created: {}", account.getId());
            return account;
        } catch (Exception e) {
            log.error("Account creating error: {}", e.getMessage());
            throw new BankException("Account creating error: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public Account updateAccountById(Long id, AccountUpdateRequestDto request) {
        try {
            Account account = accountRepository.findById(id).orElseThrow(() -> new BankException("Account not found by id: " + id));
            account.setStatus(request.getStatus() != null ? request.getStatus() : account.getStatus())
                    .setAccountType(request.getAccountType() != null ? request.getAccountType() : account.getAccountType())
                    .setDailyTransactionLimit(request.getDailyTransactionLimit());
            account = accountRepository.save(account);
            log.info("Account successfully updated: {}", account.getId());
            return account;
        } catch (Exception e) {
            log.error("Account updating error: {}", e.getMessage());
            throw new BankException("Account updating error: " + e.getMessage());
        }


    }

    @Override
    public AccountResponseWithCustomerDto findAccountById(Long id) {
        return accountRepository.findAccountById(id);
    }

    @Override
    public AccountResponseWithCustomerDto findAccountByNumber(String accountNumber) {
        return accountRepository.findAccountByAccountNumber(accountNumber);
    }

    @Override
    public Page<AccountResponseDto> getPagedAccounts(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status, Long customerId, String customerName, Pageable pageable) {
      return accountRepository.getPagedAccounts(id, accountType, accountNumber, dailyTransactionLimit, status, customerId, customerName, pageable);
    }

    @Override
    public List<AccountResponseDto> getAccountList(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status,Long customerId, String customerName) {
       return accountRepository.getAccountList(id, accountType, accountNumber, dailyTransactionLimit, status, customerId, customerName);
    }


}
