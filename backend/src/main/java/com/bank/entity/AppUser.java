package com.sayed.entity;


import com.sayed.utils.AcStatus;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    @Column(unique = true, nullable = false)
    private String email;
    private Integer age;
    private Integer employeeId;
    @Column(unique = true)
    private String mobileNo;

    @Enumerated(EnumType.STRING)
    private AcStatus status;
    private String dept;
    private String joiningDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "A_USER_ROLES",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private List<Role> roles;


}
