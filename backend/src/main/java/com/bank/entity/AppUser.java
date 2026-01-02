package com.bank.entity;


import com.bank.utils.AcStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.List;


@Table(name = "A_USERS")
@Accessors(chain = true)
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq")
    @SequenceGenerator(name = "users_seq", sequenceName = "A_USERS_SEQ", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    @Column(unique = true, nullable = false)
    private String email;
    private String employeeId;
    @Column(unique = true)
    private String mobileNo;

    @Enumerated(EnumType.STRING)
    private AcStatus status;
    private String dept;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "A_USER_ROLES",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;


}
