package com.bank.controller;


import com.bank.dto.LoginRequestDto;
import com.bank.dto.LoginResponseDto;
import com.bank.dto.RegisterRequestDto;
import com.bank.security.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> doRegister(@RequestBody @Valid RegisterRequestDto request) {
        log.info("Creating new user: {}", request);
        loginService.registerUser(request);
        return ResponseEntity.ok().build();
    }


}
