package com.bank.repository;

import com.bank.dto.CustomerResponseDto;
import com.bank.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findTop1ByMobileNo(String mobileNo);

    String CUS_PAGED_CONDITION = """
            WHERE 1=1
            AND c.id = COALESCE(:id, c.id)
            AND LOWER(c.name) LIKE LOWER(CONCAT('%' , COALESCE(:name, c.name) , '%'))
            AND LOWER(c.address) LIKE LOWER(CONCAT('%' , COALESCE(:address, c.address) , '%'))
            AND LOWER(c.mobileNo) LIKE LOWER(CONCAT('%' , COALESCE(:mobileNo, c.mobileNo) , '%'))
            AND LOWER(c.nid) LIKE LOWER(CONCAT('%' , COALESCE(:nid, c.nid) , '%'))
            """;
    String COMMON_SQL = """
            SELECT c
            FROM Customer c
            """;
    String CUS_PAGED_COUNT = """
            SELECT COUNT(c.id)
            FROM Customer c
            """+CUS_PAGED_CONDITION;

    String CUS_SQL = COMMON_SQL+CUS_PAGED_CONDITION+" ORDER BY c.id DESC";

    @Query(value = CUS_SQL, countQuery = CUS_PAGED_COUNT)
    Page<CustomerResponseDto> getPagedCustomers( Long id,
                                                 String name,
                                                 String address,
                                                 String mobileNo,
                                                 String nid,
                                                 Pageable pageable);

    @Query(value = CUS_SQL)
    List<CustomerResponseDto> getCustomerList(Long id,
                                              String name,
                                              String address,
                                              String mobileNo,
                                              String nid);

    @Query(value = COMMON_SQL + " WHERE c.id = :id")
    CustomerResponseDto getCustomerById(Long id);


}
