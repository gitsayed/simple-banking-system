package com.bank.repository;

import com.bank.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND t.transactionDate BETWEEN :startDate AND :endDate")
    Page<Transaction> findByAccountIdAndDateRange(Long accountId, LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query(value = "SELECT SUM(t.amount) FROM Transaction t WHERE t.account_id = :accountId AND TO_LOWER(t.type) = TO_LOWER(:type) AND TRUNC(t.transaction_Date) = TRUNC(SYSDATE)", nativeQuery = true)
    Double getTodayWithdrawalSum(Long accountId);
}
