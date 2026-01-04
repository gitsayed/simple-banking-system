package com.bank.entity;

import com.bank.dto.TransactionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDateTime;

@Table(name = "TRANSACTION",
        indexes = {
                @Index(
                        name = "IDX_TRANSACTION_TRX_DATE_",
                        columnList = "transactionDate"
                )
        })
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

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;
    private Double amount;
    private Double fromAcRunningBalance;
    private Double toAcRunningBalance;

    private LocalDateTime transactionDate = LocalDateTime.now();

    @Column(unique = true, nullable = false)
    private String reference;

    @ManyToOne
    private Account fromAccount;
    @ManyToOne
    private Account toAccount;

    private String remarks;
}
