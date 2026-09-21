package com.campus.research.repository;

import com.campus.research.model.AcademicQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicQueryRepository extends JpaRepository<AcademicQuery, Long> {
    List<AcademicQuery> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    List<AcademicQuery> findByStatusOrderByCreatedAtDesc(AcademicQuery.Status status);
    List<AcademicQuery> findAllByOrderByCreatedAtDesc();
}
