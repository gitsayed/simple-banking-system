package com.bank.controller;


import com.bank.dto.CustomerRequestDto;
import com.bank.dto.CustomerResponseDto;
import com.bank.dto.CustomerResponseWithAccountsDto;
import com.bank.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/customers")
@RestController
@Slf4j
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<Void> createCustomer( @RequestBody @Valid CustomerRequestDto request) {
        log.info("Creating new customer : {}", request);
        customerService.createCustomer(request);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateCustomerById( @PathVariable Long id, @RequestBody CustomerRequestDto request) {
        log.info("Updating customer by id : {}", id);
        customerService.updateCustomerById(id, request);
        return new ResponseEntity<>(HttpStatus.ACCEPTED);

    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseWithAccountsDto> getCustomerById( @PathVariable Long id) {
        log.info("Finding customer by id : {}", id);
        CustomerResponseWithAccountsDto customerResponseDto = customerService.findById(id);
        return ResponseEntity.ok(customerResponseDto);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<CustomerResponseDto>> getPageCustomers(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String mobileNo,
            @RequestParam(required = false) String nid,
            Pageable pageable) {
        log.info("Fetching paged customers. page:{}, size: {}", pageable.getPageNumber(), pageable.getPageSize());
        Page<CustomerResponseDto> pagedCustomers = customerService.getPagedCustomers(id, name, address, mobileNo, nid, pageable);
        return ResponseEntity.ok(pagedCustomers);

    }

    @GetMapping("/list")
    public ResponseEntity<List<CustomerResponseDto>> getAll(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String mobileNo,
            @RequestParam(required = false) String nid) {
        log.info("Fetching paged customers...");
        List<CustomerResponseDto> pagedCustomers = customerService.getCustomerList(id, name, address, mobileNo, nid);
        return ResponseEntity.ok(pagedCustomers);

    }

}