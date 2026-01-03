package com.bank.service;

import com.bank.dto.CustomerRequestDto;
import com.bank.dto.CustomerResponseDto;
import com.bank.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomerService {

    Customer createCustomer(CustomerRequestDto requestDto);
    Customer updateCustomerById(Long id, CustomerRequestDto requestDto);
    Page<CustomerResponseDto> getPagedCustomers(Long id, String name, String address, String mobileNo, String nid, Pageable pageable);
    List<CustomerResponseDto> getCustomerList(Long id, String name, String address, String mobileNo, String nid);
    CustomerResponseDto findById(Long id);
}
