package com.sayed.dto;



import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;


public enum UserRole {

    EMP(new HashSet(Arrays.asList(RolePermission.EMP_READ, RolePermission.EMP_WRITE))),
    ADMIN(new HashSet(Arrays.asList(RolePermission.COURSE_READ, RolePermission.COURSE_WRITE))),
    TRAINEE(new HashSet(Arrays.asList(RolePermission.COURSE_READ, RolePermission.EMP_READ)));

    private final Set<RolePermission> permissions;

    UserRole(Set<RolePermission> permissions) {
        this.permissions = permissions;
    }

    public Set<RolePermission> getPermissions() {
        return permissions;
    }

    public Set<GrantedAuthority>   getGrantedAuthorities() {
        return getPermissions().stream()
                .map(permission-> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toSet());
    }

}
