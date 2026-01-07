package com.bank.controller;


import com.bank.dto.UserInfoDto;
import com.bank.dto.UserUpdateRequestDto;
import com.bank.entity.AppUser;
import com.bank.security.LoginService;
import com.bank.service.UserService;
import com.bank.utils.AcStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/api/v1/users")
@RestController
@RequiredArgsConstructor
public class UserController {

    private final LoginService loginService;
    private final UserService userService;


    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDto> getUserInfo() {
        log.info("Fetching current user info...");
        UserInfoDto userInfoDto = loginService.getUserInfo();
        return ResponseEntity.ok(userInfoDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfoDto> getUserInfoById(@PathVariable Long id) {
        log.info("Fetching user info by id: {}", id);
        UserInfoDto userInfoDto = userService.getUserInfoById(id);
        return ResponseEntity.ok(userInfoDto);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<AppUser>> getPagedUsers(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String mobileNo,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) AcStatus status,
            Pageable pageable) {
        log.info("Fetching paged users...");
        Page<AppUser> pagedUsers = userService.getPagedUsers(id, username, mobileNo, email, employeeId, status, pageable);
        return ResponseEntity.ok(pagedUsers);
    }


    @GetMapping("/list")
    public ResponseEntity<List<AppUser>> getPagedUsers(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String mobileNo,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String employeeId,
            @RequestParam(required = false) AcStatus status) {
        log.info("Fetching user list...");
        List<AppUser> pagedUsers = userService.getUserList(id, username, mobileNo, email, employeeId, status);
        return ResponseEntity.ok(pagedUsers);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserById(@PathVariable Long id,
                                               @RequestBody @Valid UserUpdateRequestDto request) {
        log.info("Updating user by id: {}", id);
        userService.updateUserById(id, request);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
