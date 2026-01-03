package com.bank.controller;


import com.bank.dto.AccountRequestDto;
import com.bank.dto.AccountResponseDto;
import com.bank.dto.AccountResponseWithCustomerDto;
import com.bank.dto.AccountUpdateRequestDto;
import com.bank.service.AccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/accounts")
@RestController
@Slf4j
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<String> createAccount(@RequestBody AccountRequestDto request) {
        log.info("Creating account : {}", request);
        accountService.createAccount(request);
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAccountById(@PathVariable Long id,
                                                  @RequestBody AccountUpdateRequestDto request) {
        log.info("Updating account {}: {}", id, request);
        accountService.updateAccountById(id, request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponseWithCustomerDto> fetchAccountById(@PathVariable Long id) {
        log.info("Fetching account by id: {}", id);
        AccountResponseWithCustomerDto accountDetail = accountService.findAccountById(id);
        return ResponseEntity.ok(accountDetail);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<AccountResponseDto>>
    fetchPagedAccounts(@RequestParam(required = false) Long id,
                       @RequestParam(required = false) String accountType,
                       @RequestParam(required = false) String accountNumber,
                       @RequestParam(required = false) Double dailyTransactionLimit,
                       @RequestParam(required = false) String status,
                       Pageable pageable) {
        log.info("Fetching paged accounts...");
        Page<AccountResponseDto> pagedAccounts = accountService.getPagedAccounts(id,accountType, accountNumber, dailyTransactionLimit, status, pageable);
        return ResponseEntity.ok(pagedAccounts);
    }

    @GetMapping("/list")
    public ResponseEntity<List<AccountResponseDto>>
    fetchAccountList(@RequestParam(required = false) Long id,
                     @RequestParam(required = false) String accountType,
                     @RequestParam(required = false) String accountNumber,
                     @RequestParam(required = false) Double dailyTransactionLimit,
                     @RequestParam(required = false) String status) {
        log.info("Fetching account list...");
        List<AccountResponseDto> accountList = accountService.getAccountList(id,accountType, accountNumber, dailyTransactionLimit, status);
        return ResponseEntity.ok(accountList);
    }


}
