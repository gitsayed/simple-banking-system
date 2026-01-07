package com.bank.service;

import com.bank.dto.UserInfoDto;
import com.bank.dto.UserUpdateRequestDto;
import com.bank.entity.AppUser;
import com.bank.entity.Role;
import com.bank.exception.BankException;
import com.bank.repository.AppUserRepository;
import com.bank.repository.RoleRepository;
import com.bank.repository.UserSpecification;
import com.bank.utils.AcStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

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

    @Override
    @Transactional
    public AppUser updateUserById(Long id, UserUpdateRequestDto request) {
        try {
            AppUser user = getUserById(id);
            updateBasicFields(user, request);
            updateRoles(user, request);
            user = userRepository.save(user);
            log.info("User: {} has been updated successfully", user.getId());
            return user;
        } catch (Exception e) {
            log.error("User registration error: {}", e.getMessage());
            throw new BankException("User registration error: " + e.getMessage());
        }
    }

    private void updateBasicFields(AppUser user, UserUpdateRequestDto request) {
        user.setUsername(getOrDefault(request.getUsername(), user.getUsername()))
                .setEmail(getOrDefault(request.getEmail(), user.getEmail()))
                .setMobileNo(getOrDefault(request.getMobileNo(), user.getMobileNo()))
                .setDept(getOrDefault(request.getDept(), user.getDept()))
                .setStatus(request.getStatus() != null ? request.getStatus() : user.getStatus())
                .setPassword(updatePassword(request.getPassword(), user.getPassword()));
    }

    private AppUser getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BankException("User not found by id: " + id));
    }

    private String updatePassword(String newPassword, String existingPassword) {
        return isNotBlank(newPassword)
                ? passwordEncoder.encode(newPassword)
                : existingPassword;
    }

    private void updateRoles(AppUser user, UserUpdateRequestDto request) {
        if (request.getRoleIds() == null) {
            return;
        }

        List<Role> roles = roleRepository.findByIdIn(request.getRoleIds());
        if (roles != null && !roles.isEmpty()) {
            user.setRoles(roles);
        }
    }

    private String getOrDefault(String newValue, String oldValue) {
        return isNotBlank(newValue) ? newValue : oldValue;
    }

    private boolean isNotBlank(String value) {
        return value != null && !value.isBlank();
    }

}
