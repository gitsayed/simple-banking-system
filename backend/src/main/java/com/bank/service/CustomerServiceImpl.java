package com.bank.service;

import com.bank.dto.CustomerRequestDto;
import com.bank.dto.CustomerResponseDto;
import com.bank.dto.CustomerResponseWithAccountsDto;
import com.bank.entity.Customer;
import com.bank.exception.BankException;
import com.bank.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CustomerServiceImpl implements  CustomerService{

    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public Customer createCustomer(CustomerRequestDto request) {
        try {
            Customer oldCustomer = customerRepository.findTop1ByMobileNo(request.getMobileNo());
            if(oldCustomer != null) throw new BankException("Customer already exists by mobileNo : "+request.getMobileNo());
            Customer customer = new Customer();
            customer.setName(request.getName())
                    .setAddress(request.getAddress())
                    .setMobileNo(request.getMobileNo())
                    .setGender(request.getGender())
                    .setNid(request.getNid());

            customer = customerRepository.save(customer);
            log.info("Customer successfully created by id: {}", customer.getId());
            return customer;
        } catch (Exception e) {
            log.error("Customer Creating error: {}", e.getMessage());
            throw new BankException("Customer Creating error: "+ e.getMessage());
        }
    }

    @Override
    @Transactional
    public Customer updateCustomerById(Long id, CustomerRequestDto request) {
        try {
            Customer customer = customerRepository.findById(id).orElseThrow(()-> new BankException("Customer not found by id: "+ id));
            customer.setName(request.getName()!=null? request.getName(): customer.getName())
                    .setAddress(request.getAddress()!=null? request.getAddress(): customer.getAddress())
                    .setMobileNo(request.getMobileNo()!=null? request.getMobileNo(): customer.getMobileNo())
                    .setGender(request.getGender()!=null? request.getGender(): customer.getGender())
                    .setNid(request.getNid()!=null? request.getNid(): customer.getNid());

            customer = customerRepository.save(customer);
            log.info("Customer successfully updated by id: {}", customer.getId());
            return customer;
        } catch (Exception e) {
            log.error("Customer updating error: {}", e.getMessage());
            throw new BankException("Customer updating error: "+ e.getMessage());
        }
    }


    @Override
    public Page<CustomerResponseDto> getPagedCustomers(Long id, String name, String address, String mobileNo, String nid, Pageable pageable) {
        try {
            return customerRepository.getPagedCustomers(id,name, address, mobileNo, nid, pageable);
        } catch (Exception e) {
            log.error("Customer pagination error: {}", e.getMessage());
            throw new BankException("Customer pagination error: "+ e.getMessage());

        }
    }

    @Override
    public List<CustomerResponseDto> getCustomerList(Long id, String name, String address, String mobileNo, String nid) {
        try {
            return customerRepository.getCustomerList(id,name, address, mobileNo, nid);
        } catch (Exception e) {
            log.error("Customer get list error: {}", e.getMessage());
            throw new BankException("Customer  get list error: "+ e.getMessage());

        }
    }

    @Override
    public CustomerResponseWithAccountsDto findById(Long id) {
        return customerRepository.getCustomerById(id);
    }



}
