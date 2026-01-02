package com.bank.dto;

import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Set;

@Data
@Accessors(chain = true)
public class MetaAuthorities {
    private List<String> roles;
    private Set<GrantedAuthority> authorities;

}