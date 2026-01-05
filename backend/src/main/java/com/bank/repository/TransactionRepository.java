package com.bank.repository;

import com.bank.dto.TransactionResponseDto;
import com.bank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

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

    @Query(value = GET_TOTAL_TRX_SUM_SQL, nativeQuery = true)
    Double getTotalTrxByAccountId(Long accountId, LocalDate startDate, LocalDate endDate);


    String STMT_SQL = """
            SELECT
            t.ID                         AS transactionId,
            TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD')          AS transactionDate,
            t.REFERENCE                  AS referenceNumber,
            t.TRANSACTION_TYPE			 AS transactionType,
            t.REMARKS                    AS remarks,
            a.ACCOUNT_NUMBER			 AS accountNumber,
            c.ID 						 AS customerId,
            c.NAME 						 AS customerName,
            c.MOBILE_NO 				 AS mobileNo,
            
            CASE
                WHEN t.FROM_ACCOUNT_ID = a.ID THEN t.AMOUNT
                ELSE 0
            END AS debitAmount,
            
            CASE
                WHEN t.TO_ACCOUNT_ID = a.ID THEN t.AMOUNT
                ELSE 0
            END AS creditAmount,
            
            CASE
                WHEN t.TO_ACCOUNT_ID = a.ID THEN t.TO_AC_RUNNING_BALANCE
                WHEN t.FROM_ACCOUNT_ID = a.ID THEN t.FROM_AC_RUNNING_BALANCE
                ELSE 0
            END AS runningBalance
            
            FROM TRANSACTION t
            JOIN ACCOUNT a  ON t.FROM_ACCOUNT_ID = a.ID OR t.TO_ACCOUNT_ID = a.ID
            JOIN CUSTOMER c ON c.ID = a.CUSTOMER_ID 
            
            WHERE 1=1
            AND (a.ACCOUNT_NUMBER = COALESCE(:accountNumber, a.ACCOUNT_NUMBER) )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') >= COALESCE(:startDate, TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') <= COALESCE(:endDate,   TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND t.TRANSACTION_TYPE = COALESCE(:transactionType, t.TRANSACTION_TYPE)
            
            ORDER BY t.TRANSACTION_DATE ASC
            """;

    String STMT_COUNT = """
            SELECT COUNT(t.id) as TOTAL
            FROM TRANSACTION t
            JOIN ACCOUNT a  ON t.FROM_ACCOUNT_ID = a.ID OR t.TO_ACCOUNT_ID = a.ID
            JOIN CUSTOMER c ON c.ID = a.CUSTOMER_ID 
            
            WHERE 1=1
            AND (a.ACCOUNT_NUMBER = COALESCE(:accountNumber, a.ACCOUNT_NUMBER) )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') >= COALESCE(:startDate, TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') <= COALESCE(:endDate,   TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND t.TRANSACTION_TYPE = COALESCE(:transactionType, t.TRANSACTION_TYPE)
            """;

    @Query(value = STMT_SQL, countQuery = STMT_COUNT, nativeQuery = true)
    Page<TransactionResponseDto> getPagedAccountStatement(String accountNumber, LocalDate startDate, LocalDate endDate, String transactionType, Pageable pageable);

    @Query(value = STMT_SQL, nativeQuery = true)
    List<TransactionResponseDto> getAccountStatementList(String accountNumber, LocalDate startDate, LocalDate endDate, String transactionType);

}
