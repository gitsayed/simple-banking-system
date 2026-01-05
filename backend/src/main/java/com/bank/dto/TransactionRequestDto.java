package com.bank.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionRequestDto {

    @NotNull(message = "transactionType is required.")
    private TransactionType transactionType;
    private String fromAccountNumber;
    private String toAccountNumber;
    @NotNull(message = "transactionAmount is required.")
    private Double transactionAmount;
    private String remarks;

}
