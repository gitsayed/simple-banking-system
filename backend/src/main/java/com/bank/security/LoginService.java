package com.sayed.security;


import com.sayed.dto.LoginRequestDto;
import com.sayed.dto.LoginResponseDto;
import com.sayed.dto.RegisterRequestDto;
import com.sayed.entity.AppUser;
import com.sayed.entity.Role;
import com.sayed.exception.OrgException;
import com.sayed.jwt.JwtUtils;
import com.sayed.repository.AppUserRepository;
import com.sayed.repository.RoleRepository;
import com.sayed.utils.AcStatus;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.Accessors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {


    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;

    public LoginResponseDto doLogin(LoginRequestDto request) {
        AppUser user = getUser(request.getUsername());
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Bad credentials");
        }

        MetaAuthorities metaAuth = generateAuthentication(user);
        String token = jwtUtils.generateJwtToken(user, metaAuth.getRoles(), metaAuth.getAuthorities());

        LoginResponseDto responseDto = new LoginResponseDto();
        responseDto.setAccessToken(token)
                .setRefreshToken(token);
        return responseDto;
    }

    public void doAuthenticated(String username) {
        AppUser user = getUser(username);
        generateAuthentication(user);
    }


    @Transactional
    public AppUser registerUser(RegisterRequestDto request) {
        try {
            Optional<AppUser> opUser = appUserRepository.findTop1ByUsernameOrEmailOrMobileNo(request.getUsername(), request.getEmail(), request.getMobileNo());
            if (opUser.isPresent()) {
                throw new OrgException("User already exists!");
            }
            List<Role> rolesList = roleRepository.findByIdIn(request.getRoleIds());
            AppUser user = new AppUser();
            user.setUsername(request.getUsername())
                    .setEmail(request.getEmail())
                    .setMobileNo(request.getMobileNo())
                    .setStatus(AcStatus.ACTIVE)
                    .setRoles(rolesList)
                    .setPassword(passwordEncoder.encode(request.getPassword()));

            user = appUserRepository.save(user);
            log.info("User: {} has been registered successfully", user.getId());

            return user;
        } catch (Exception e) {
            log.error("User registration error: {}", e.getMessage());
            throw new OrgException("User registration error: "+ e.getMessage());
        }
    }

    private MetaAuthorities generateAuthentication(AppUser user) {
        List<String> roles = new ArrayList<>();
        Set<GrantedAuthority> authorities = new HashSet<>();

        user.getRoles().forEach(role -> {
            Set<SimpleGrantedAuthority> permissions = role.getPermissions().stream()
                    .map(permission -> new SimpleGrantedAuthority(permission.getName()))
                    .collect(Collectors.toSet());
            permissions.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
            roles.add(role.getName());
            authorities.addAll(permissions);
        });

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        MetaAuthorities metaAuthorities = new MetaAuthorities();
        metaAuthorities.setRoles(roles)
                .setAuthorities(authorities);
        return metaAuthorities;
    }

    private AppUser getUser(String username) {
        return appUserRepository.findTop1ByUsernameOrEmailOrMobileNo(username, username, username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));
    }

    @Data
    @Accessors(chain = true)
    static class MetaAuthorities {
        private List<String> roles;
        private Set<GrantedAuthority> authorities;

    }

}
