package com.bank.dto;

public interface CustomerResponseDto {

     Long getId();
     String getName();
     String getAddress();
     String getMobileNo();
     String getNid();


     interface CustomerAc{
         String getAccountNo();
         Double getBalance();
     }

}
