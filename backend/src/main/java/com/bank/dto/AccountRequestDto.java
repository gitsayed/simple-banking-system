package com.bank.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountRequestDto {

    @NotNull(message= "customerId is required.")
    private Long customerId;
    @NotBlank(message= "accountType is required.")
    private String accountType;
    private Double balance;
    @NotNull(message= "customerId is required.")
    private Double dailyTransactionLimit;
    @NotBlank(message= "status is required.")
    private String status;


}
