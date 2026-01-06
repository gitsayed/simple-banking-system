package com.bank.repository;

import com.bank.dto.TransactionResponseDto;
import com.bank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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


    String STMT_CONDITION = """
            WHERE 1=1
            AND (	  (fa.ACCOUNT_NUMBER IS NOT NULL AND fa.ACCOUNT_NUMBER = COALESCE(:accountNumber, fa.ACCOUNT_NUMBER) )
                  OR  (ta.ACCOUNT_NUMBER IS NOT NULL AND ta.ACCOUNT_NUMBER = COALESCE(:accountNumber, ta.ACCOUNT_NUMBER) )
                 )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') >= COALESCE(:startDate, TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') <= COALESCE(:endDate,   TO_DATE(TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD'), 'YYYY-MM-DD') )
            AND t.TRANSACTION_TYPE = COALESCE(:transactionType, t.TRANSACTION_TYPE)
            AND t.REFERENCE   = COALESCE(:referenceNumber, t.REFERENCE)
            """;
    
    String STMT_COMMON_SQL = """
            SELECT
            t.ID                         AS transactionId,
            TO_CHAR(t.TRANSACTION_DATE, 'YYYY-MM-DD')     AS transactionDate,
            t.REFERENCE                  AS referenceNumber,
            t.TRANSACTION_TYPE			 AS transactionType,
            t.REMARKS                    AS remarks,
            CASE
                WHEN t.FROM_ACCOUNT_ID = fa.ID THEN  fa.ACCOUNT_NUMBER
                ELSE null
            END AS fromAccountNumber,
            CASE
                WHEN t.TO_ACCOUNT_ID = ta.ID THEN ta.ACCOUNT_NUMBER
                ELSE null
            END AS toAccountNumber,
            fc.ID 						 AS fromCustomerId,
            fc.NAME 					 AS fromCustomerName,
            fc.MOBILE_NO 				 AS fromMobileNo,
            
            tc.ID 						 AS toCustomerId,
            tc.NAME 					 AS toCustomerName,
            tc.MOBILE_NO 				 AS toMobileNo,

            CASE
                WHEN t.FROM_ACCOUNT_ID = fa.ID THEN t.AMOUNT
                ELSE 0
            END AS debitAmount,
            
            CASE
                WHEN t.TO_ACCOUNT_ID = ta.ID THEN t.AMOUNT
                ELSE 0
            END AS creditAmount,
            
            t.FROM_AC_RUNNING_BALANCE 	 AS fromAcRunningBalance,
            t.TO_AC_RUNNING_BALANCE 	 AS toAcRunningBalance 
            FROM TRANSACTION t
            LEFT JOIN ACCOUNT fa  ON t.FROM_ACCOUNT_ID = fa.ID
            LEFT JOIN ACCOUNT ta  ON t.TO_ACCOUNT_ID = ta.ID
            LEFT JOIN CUSTOMER fc ON fc.ID = fa.CUSTOMER_ID
            LEFT JOIN CUSTOMER tc ON tc.ID = ta.CUSTOMER_ID 
            """;
    String STMT_SQL = STMT_COMMON_SQL + STMT_CONDITION +" ORDER BY t.TRANSACTION_DATE ASC ";

    String STMT_COUNT = """
            SELECT COUNT(t.id) as TOTAL
            FROM TRANSACTION t
            LEFT JOIN ACCOUNT fa  ON t.FROM_ACCOUNT_ID = fa.ID
            LEFT JOIN ACCOUNT ta  ON t.TO_ACCOUNT_ID = ta.ID
            LEFT JOIN CUSTOMER fc ON fc.ID = fa.CUSTOMER_ID
            LEFT JOIN CUSTOMER tc ON tc.ID = ta.CUSTOMER_ID 
            """ + STMT_CONDITION;

    @Query(value = STMT_SQL, countQuery = STMT_COUNT, nativeQuery = true)
    Page<TransactionResponseDto> getPagedAccountStatement(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, String transactionType, Pageable pageable);

    @Query(value = STMT_SQL, nativeQuery = true)
    List<TransactionResponseDto> getAccountStatementList(String accountNumber, String referenceNumber, LocalDate startDate, LocalDate endDate, String transactionType);


    String GET_TRX_BY_ID = STMT_COMMON_SQL+" WHERE t.id=:id ";
    @Query(value = GET_TRX_BY_ID , nativeQuery = true)
    TransactionResponseDto getAccountStatementById( Long id);

}
