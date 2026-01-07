package com.bank.dto;

public interface AccountResponseDto {

     Long getId();
     String getAccountNumber();
     Double getBalance();
     Double getDailyTransactionLimit();
     String getAccountType();
     String getStatus();
     customer getCustomer();
     interface customer{
          String getName();
          Long getId();
     }

}
