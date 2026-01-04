package com.bank.dto;

import com.bank.utils.AcStatus;

import java.util.List;

public interface UserInfoDto {

    Long getId();

    String getUsername();

    String getEmail();

    String getEmployeeId();

    String getMobileNo();

    AcStatus getStatus();

    String getDept();

    List<IRole> getRoles();

    interface IRole {
        Long getId();

        String getName();
    }


}
