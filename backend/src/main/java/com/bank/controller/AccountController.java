package com.bank.controller;


import com.bank.dto.AccountRequestDto;
import com.bank.dto.AccountResponseDto;
import com.bank.dto.AccountResponseWithCustomerDto;
import com.bank.dto.AccountUpdateRequestDto;
import com.bank.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Accounts", description = "Operations about bank accounts")
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    @Operation(summary = "Create Account.")
    public ResponseEntity<String> createAccount(@RequestBody AccountRequestDto request) {
        log.info("Creating account : {}", request);
        accountService.createAccount(request);
        return new ResponseEntity<>(HttpStatus.CREATED);

    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Account By ID.")
    public ResponseEntity<Void> updateAccountById(@PathVariable Long id,
                                                  @RequestBody AccountUpdateRequestDto request) {
        log.info("Updating account {}: {}", id, request);
        accountService.updateAccountById(id, request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);

    }

    @GetMapping("/{id}")
    @Operation(summary = "Fetch Account By ID.")
    public ResponseEntity<AccountResponseWithCustomerDto> fetchAccountById(@PathVariable Long id) {
        log.info("Fetching account by id: {}", id);
        AccountResponseWithCustomerDto accountDetail = accountService.findAccountById(id);
        return ResponseEntity.ok(accountDetail);
    }

    @GetMapping("/page")
    @Operation(summary = "Fetch Account pagination with search.")
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
    @Operation(summary = "Fetch Account list with search.")
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
