package com.sayed.repository;

import com.sayed.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {


    Optional<AppUser> findTop1ByUsernameOrEmailOrMobileNo(String username, String email, String mobileNo);
}
