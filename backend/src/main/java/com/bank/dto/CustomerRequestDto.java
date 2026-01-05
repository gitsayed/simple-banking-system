package com.bank.dto;

import com.bank.utils.GenderEnum;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CustomerRequestDto {

    @NotBlank(message = "name is required.")
    private String name;
    @NotBlank(message = "address is required.")
    private String address;
    @NotBlank(message = "mobileNo is required.")
    private String mobileNo;
    @NotBlank(message = "nid is required.")
    private String nid;

    @NotNull(message = "gender is required.")
    private GenderEnum gender;

}
