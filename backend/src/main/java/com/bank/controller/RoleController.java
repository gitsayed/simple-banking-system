package com.bank.controller;


import com.bank.dto.RoleRequestDto;
import com.bank.entity.Role;
import com.bank.service.RoleService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/roles")
@RestController
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Role", description = "Operations about role management")
public class RoleController {


    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<Void> createRole(@RequestBody @Valid RoleRequestDto request) {
        log.info("Creating role ... {}", request);
        roleService.createRole(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateRoleById(@PathVariable Long id, @RequestBody @Valid RoleRequestDto request) {
        log.info("Updating role ... {}", request);
        roleService.updateRole(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Void> getRoleById(@PathVariable Long id) {
        log.info("Getting role ... {}", id);
        roleService.getRoleById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Role>> getPagedRoles(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String name,
                                              Pageable pageable) {
        log.info("Getting paged roles ... ");
        Page<Role> pagedRoles =roleService.getPagedRoles(id, name, pageable);
        return ResponseEntity.ok(pagedRoles);
    }

    @GetMapping("/list")
    public ResponseEntity<List<Role>> getRoleById(@RequestParam(required = false) Long id,
                                                             @RequestParam(required = false) String name) {
        log.info("Getting roles ... {}", id);
        List<Role> roleList =roleService.getRoleList(id, name);
        return ResponseEntity.ok(roleList);
    }

}
