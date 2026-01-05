package com.bank.dto;

import com.bank.utils.GenderEnum;

import java.util.List;

public interface CustomerResponseWithAccountsDto {

     Long getId();
     String getName();
     GenderEnum getGender();
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
