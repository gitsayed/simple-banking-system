package com.bank.repository;

import com.bank.dto.UserInfoDto;
import com.bank.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long>, JpaSpecificationExecutor<AppUser> {


    Optional<AppUser> findTop1ByUsernameOrEmailOrMobileNo(String username, String email, String mobileNo);

    @Query(value = "SELECT a FROM AppUser a WHERE a.username = :username")
    UserInfoDto getUserInfoByUsername(String username);


    @Query(value = "SELECT a FROM AppUser a WHERE a.id = :id")
    UserInfoDto getUserInfoById(Long id);

}
