package com.bank.repository;

import com.bank.entity.AppUser;
import com.bank.utils.AcStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    private UserSpecification(){
    }

    public static Specification<AppUser> withFilters(Long id, String username, String mobileNo, String email, String employeeId, AcStatus status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (id != null) {
                predicates.add(cb.equal(root.get("id"), id));
            }

            if (StringUtils.hasText(username)) {
                predicates.add(cb.like(cb.lower(root.get("name")),
                        "%" + username.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(mobileNo)) {
                predicates.add(cb.like(cb.lower(root.get("mobileNo")),
                        "%" + mobileNo.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(email)) {
                predicates.add(cb.like(cb.lower(root.get("email")),
                        "%" + email.toLowerCase() + "%"));
            }

            if (StringUtils.hasText(employeeId)) {
                predicates.add(cb.like(cb.lower(root.get("employeeId")),
                        "%" + employeeId.toLowerCase() + "%"));
            }


            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }


            query.orderBy(cb.desc(root.get("id")));

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
