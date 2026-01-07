package com.bank.service;

import com.bank.dto.RegisterRequestDto;
import com.bank.dto.UserInfoDto;
import com.bank.dto.UserUpdateRequestDto;
import com.bank.entity.AppUser;
import com.bank.utils.AcStatus;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {


    Page<AppUser> getPagedUsers(Long id, String username, String mobileNo, String email, String employeeId, AcStatus status, Pageable pageable);
    List<AppUser> getUserList(Long id, String username, String mobileNo, String email, String employeeId, AcStatus status);

    UserInfoDto getUserInfoById(Long id);

    AppUser updateUserById(Long id, UserUpdateRequestDto request);

}
