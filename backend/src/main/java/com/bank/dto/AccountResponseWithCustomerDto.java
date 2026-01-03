package com.bank.dto;

public interface AccountResponseWithCustomerDto {

     Long getId();
     String getAccountNumber();
     Double getBalance();
     Double getDailyTransactionLimit();
     String getAccountType();
     String getStatus();
     Customer getCustomer();

     interface Customer{
         String getName();
         Long getId();
     }

}
