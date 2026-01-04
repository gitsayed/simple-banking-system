package com.bank.service;


import com.bank.dto.RoleRequestDto;
import com.bank.dto.RoleResponseDto;
import com.bank.entity.Role;
import com.bank.exception.BankException;
import com.bank.repository.RoleRepository;
import com.bank.repository.RoleSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {


    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public Role createRole(RoleRequestDto request) {

        Role role  = new Role();
        role.setName(request.getName());
        role = roleRepository.save(role);
        log.info("Role successfully created: {}", role.getId());
        return role;
    }

    @Override
    @Transactional
    public Role updateRole(Long id, RoleRequestDto request) {

        Role role  = roleRepository.findById(id).orElseThrow(()-> new BankException("Role not found by id:"+id));
        role.setName(request.getName());
        role = roleRepository.save(role);
        log.info("Role successfully updated: {}", role.getId());
        return role;
    }

    @Override
    public Role getRoleById(Long id) {
        return roleRepository.findById(id).orElseThrow(()-> new BankException("Role not found by id:"+id));
    }

    @Override
    public Page<Role> getPagedRoles(Long id, String name, Pageable pageable) {
        Specification<Role> specification = RoleSpecification.withFilters(id, name);
        return roleRepository.findAll(specification, pageable);
    }

    @Override
    public List<Role> getRoleList(Long id, String name) {
        Specification<Role> specification = RoleSpecification.withFilters(id, name);
        return roleRepository.findAll(specification);
    }
}
