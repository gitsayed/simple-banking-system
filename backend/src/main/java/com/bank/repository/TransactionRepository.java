package com.bank.repository;

import com.bank.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {


    String GET_TOTAL_TRX_SUM_SQL = """
            SELECT
                SUM(
                    CASE
                        WHEN TO_ACCOUNT_ID = :accountId THEN AMOUNT
                        WHEN FROM_ACCOUNT_ID = :accountId THEN -AMOUNT
                        ELSE 0
                    END
                ) AS NET_AMOUNT
            FROM TRANSACTION
            WHERE TO_DATE(TO_CHAR(TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') >= :startDate
              AND TO_DATE(TO_CHAR(TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') <= :endDate
              AND (
                    FROM_ACCOUNT_ID = :accountId
                    OR TO_ACCOUNT_ID = :accountId
                  )
              ORDER BY TRANSACTION_DATE DESC
            """;

    @Query(value = GET_TOTAL_TRX_SUM_SQL , nativeQuery = true)
    Double getTotalTrxByAccountId(Long accountId, LocalDate startDate, LocalDate endDate);
}
