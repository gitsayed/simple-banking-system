package com.bank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Table(name = "ACCOUNT")
@Accessors(chain = true)
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_seq")
    @SequenceGenerator(name = "account_seq", sequenceName = "ACCOUNT_SEQ", allocationSize = 1)
    private Long id;

    @Column(unique = true, nullable = false)
    private String accountNumber;
    private String accountType;
    private Double balance;
    private Double dailyTransactionLimit;
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customer;


}
