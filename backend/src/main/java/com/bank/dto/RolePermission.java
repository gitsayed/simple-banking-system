package com.sayed.dto;

public enum RolePermission {
    EMP_READ("emp:read"),
    EMP_WRITE("emp:write"),
    COURSE_READ("course:read"),
    COURSE_WRITE("course:write");

    private final String permission;

    RolePermission(String permission) {
        this.permission = permission;
    }

    public String getPermission() {
        return permission;
    }
}
