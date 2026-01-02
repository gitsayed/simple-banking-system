package com.sayed.controller;


import com.sayed.dto.Employee;
import com.sayed.dto.LoginRequestDto;
import com.sayed.dto.LoginResponseDto;
import com.sayed.dto.RegisterRequestDto;
import com.sayed.jwt.JwtConfig;
import com.sayed.security.LoginService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Void> doRegister(@RequestBody @Valid RegisterRequestDto request) {
        log.info("Creating new user: {}", request);
        loginService.registerUser(request);
        return ResponseEntity.ok().build();
    }


}
