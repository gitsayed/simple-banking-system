package com.bank.service;

import com.bank.dto.UserInfoDto;
import com.bank.entity.AppUser;
import com.bank.repository.AppUserRepository;
import com.bank.repository.UserSpecification;
import com.bank.utils.AcStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService  {

    private final AppUserRepository userRepository;

    @Override
    public Page<AppUser> getPagedUsers(Long id, String username, String mobileNo, String email, String employeeId, AcStatus status, Pageable pageable) {
        Specification<AppUser> specification = UserSpecification.withFilters(id, username, mobileNo, email, employeeId, status);
        return userRepository.findAll(specification, pageable);
    }

    @Override
    public List<AppUser> getUserList(Long id, String username, String mobileNo, String email, String employeeId, AcStatus status) {
        Specification<AppUser> specification = UserSpecification.withFilters(id, username, mobileNo, email, employeeId, status);
        return userRepository.findAll(specification);
    }

    @Override
    public UserInfoDto getUserInfoById(Long id) {
        return userRepository.getUserInfoById(id);
    }


}
