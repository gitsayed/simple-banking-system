package com.bank.dto;

import com.bank.utils.GenderEnum;

public interface CustomerResponseDto {

     Long getId();
     String getName();
     GenderEnum getGender();
     String getAddress();
     String getMobileNo();
     String getNid();


}
