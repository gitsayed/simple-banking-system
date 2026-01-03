package com.bank.controller;

import com.bank.dto.TransactionRequestDto;
import com.bank.entity.Transaction;
import com.bank.service.TransactionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;


@RequestMapping("/api/v1/transactions")
@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Operations about transaction management")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<Void> doTransaction(@RequestBody @Valid TransactionRequestDto request) {
        log.info("Initiating a transaction: {}", request);
        transactionService.doTransaction(request);
        return ResponseEntity.ok().build();
    }





    @GetMapping("/statement/{accountId}")
    public Page<Transaction> getStatement(@PathVariable Long accountId,
                                          @RequestParam LocalDate startDate,
                                          @RequestParam LocalDate endDate,
                                          Pageable pageable) {

//        return transactionService.getAccountStatement();
        return null;
    }


}
