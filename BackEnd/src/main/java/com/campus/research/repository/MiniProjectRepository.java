package com.campus.research.repository;

import com.campus.research.model.MiniProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MiniProjectRepository extends JpaRepository<MiniProject, Long> {
    List<MiniProject> findByStudentId(Long studentId);
    List<MiniProject> findByFacultyId(Long facultyId);
}
