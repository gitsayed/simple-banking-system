package com.bank.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountUpdateRequestDto {
    private String accountType;
    private Double dailyTransactionLimit;
    private String status;


}
