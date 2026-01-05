package com.bank.dto;

import com.bank.utils.AcStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterRequestDto {

    @NotEmpty(message = "username is required")
    private String username;
    @NotEmpty(message = "email is required")
    private String email;
    @NotEmpty(message = "mobileNo is required")
    private String mobileNo;
    private String password;
    private String employeeId;
    private String dept;
    private AcStatus status;
    private List<Long> roleIds;

}

