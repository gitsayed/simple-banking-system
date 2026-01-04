package com.bank.controller;


import com.bank.dto.LoginRequestDto;
import com.bank.dto.LoginResponseDto;
import com.bank.dto.RegisterRequestDto;
import com.bank.dto.UserInfoDto;
import com.bank.security.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequestMapping("/api/v1/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final LoginService loginService;


    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> doLogin(@RequestBody LoginRequestDto request) {
        LoginResponseDto responseDto = loginService.doLogin(request);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping(value = {"/signup", "/register"})
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> doRegister(@RequestBody @Valid RegisterRequestDto request) {
        log.info("Creating new user: {}", request);
        loginService.registerUser(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user-info")
    public ResponseEntity<UserInfoDto> getUserInfo(){
        log.info("Fetching user info...");
        UserInfoDto userInfoDto = loginService.getUserInfo();
        return ResponseEntity.ok(userInfoDto);
    }


}
