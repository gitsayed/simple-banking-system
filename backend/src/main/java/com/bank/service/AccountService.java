package com.bank.service;

import com.bank.dto.AccountRequestDto;
import com.bank.dto.AccountResponseDto;
import com.bank.dto.AccountResponseWithCustomerDto;
import com.bank.dto.AccountUpdateRequestDto;
import com.bank.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AccountService {

    Account createAccount(AccountRequestDto request);
    Account updateAccountById(Long id, AccountUpdateRequestDto request);
    AccountResponseWithCustomerDto findAccountById(Long id);
    Page<AccountResponseDto> getPagedAccounts(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status, Long customerId, String customerName, Pageable pageable);
    List<AccountResponseDto> getAccountList(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status, Long customerId, String customerName);
    AccountResponseWithCustomerDto findAccountByNumber(String accountNumber);
}

