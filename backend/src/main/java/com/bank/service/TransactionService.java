package com.bank.service;

import com.bank.dto.TransactionRequestDto;
import com.bank.entity.Transaction;
import jakarta.validation.Valid;

public interface TransactionService {
    Transaction doTransaction(@Valid TransactionRequestDto request);



}
