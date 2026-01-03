package com.bank.dto;

import java.util.List;

public interface CustomerResponseWithAccountsDto {

     Long getId();
     String getName();
     String getAddress();
     String getMobileNo();
     String getNid();
     List<CustomerAc> getAccounts();

     interface CustomerAc{
         Long getId();
         String getAccountNumber();
         String getAccountType();
         String getStatus();
         Double getBalance();
     }

}
