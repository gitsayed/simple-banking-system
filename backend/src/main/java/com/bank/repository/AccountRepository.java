package com.bank.repository;

import com.bank.dto.AccountResponseDto;
import com.bank.dto.AccountResponseWithCustomerDto;
import com.bank.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    String NEW_AC_NO_SQL = """
            SELECT
                CASE
                    WHEN NVL(MAX(TO_NUMBER(REGEXP_REPLACE(account_number, '[^0-9]', ''))), 0) <= 1
                        THEN '100001'
                    ELSE TO_CHAR(
                        MAX(TO_NUMBER(REGEXP_REPLACE(account_number, '[^0-9]', ''))) + 1
                    )
                END AS next_account_number
            FROM ACCOUNT
            """;

    @Query(value = NEW_AC_NO_SQL, nativeQuery = true)
    String getNewAccountNumber();

    String COMMON_AC_SQL= """
            SELECT ac
            FROM Account ac
            
            """;

    String FIND_BY_ID = COMMON_AC_SQL + " WHERE ac.id = :id";

    @Query(value = FIND_BY_ID)
    AccountResponseWithCustomerDto findAccountById(Long id);


    String AC_PAGED_CONDITION = """
            WHERE 1=1
            AND ac.id = COALESCE(:id, ac.id)
            AND LOWER(ac.accountType) LIKE LOWER(CONCAT('%' , COALESCE(:accountType, ac.accountType) , '%'))
            AND LOWER(ac.accountNumber) LIKE LOWER(CONCAT('%' , COALESCE(:accountNumber, ac.accountNumber) , '%'))
            AND ac.dailyTransactionLimit <= COALESCE(:dailyTransactionLimit, ac.dailyTransactionLimit)
            AND LOWER(ac.status) LIKE LOWER(CONCAT('%' , COALESCE(:status, ac.status) , '%'))
            """;

    String COMMON_SQL = """
            SELECT ac
            FROM Account ac
            """;
    String AC_PAGED_COUNT = """
            SELECT COUNT(ac.id)
            FROM Account ac
            """ + AC_PAGED_CONDITION;

    String AC_SQL = COMMON_SQL+AC_PAGED_CONDITION+" ORDER BY ac.id DESC";

    @Query(value = AC_SQL , countQuery = AC_PAGED_COUNT)
    Page<AccountResponseDto> getPagedAccounts(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status, Pageable pageable);

    @Query(value = AC_SQL)
    List<AccountResponseDto> getAccountList(Long id, String accountType, String accountNumber, Double dailyTransactionLimit, String status);


}
