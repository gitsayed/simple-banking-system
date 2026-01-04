package com.bank.service;

import com.bank.dto.RoleRequestDto;
import com.bank.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RoleService {

    Role createRole(RoleRequestDto request);
    Role updateRole(Long id, RoleRequestDto request);
    Role getRoleById(Long id);
    Page<Role> getPagedRoles(Long id, String name, Pageable pageable);
    List<Role> getRoleList(Long id, String name);

}
