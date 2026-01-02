package com.bank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Table(name = "TRANSACTION")
@Accessors(chain = true)
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_seq")
    @SequenceGenerator(name = "transaction_seq", sequenceName = "TRANSACTION_SEQ", allocationSize = 1)
    private Long id;
    @ManyToOne
    private Account account;
    private String type;
    private double amount;

    private LocalDate transactionDate =  LocalDate.now();
    private String reference;
    @ManyToOne
    private Account fromAccount;
    @ManyToOne
    private Account toAccount;
    private String remarks;
}
