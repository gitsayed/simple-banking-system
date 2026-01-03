package com.bank.controller;

import com.bank.entity.Transaction;
import com.bank.service.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RequestMapping("/api/v1/transactions")
@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Operations about transaction management")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit/{accountId}")
    public Transaction deposit(@PathVariable Long accountId,
                               @RequestParam Double amount,
                               @RequestParam String remarks) {
        return transactionService.deposit(accountId, amount, remarks);
    }

    @PostMapping("/withdraw/{accountId}")
    public Transaction withdraw(@PathVariable Long accountId,
                                @RequestParam double amount,
                                @RequestParam String remarks) {
        return transactionService.withdraw(accountId, amount, remarks);
    }

    @PostMapping("/transfer")
    public Transaction transfer(@RequestParam Long fromAccountId,
                                @RequestParam Long toAccountId,
                                @RequestParam double amount,
                                @RequestParam String remarks) {
        return transactionService.transfer(fromAccountId, toAccountId, amount, remarks);
    }

    @GetMapping("/statement/{accountId}")
    public Page<Transaction> getStatement(@PathVariable Long accountId,
                                          @RequestParam LocalDate startDate,
                                          @RequestParam LocalDate endDate,
                                          @RequestParam int page,
                                          @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return transactionService.getAccountStatement(accountId, startDate, endDate, pageable);
    }


}
