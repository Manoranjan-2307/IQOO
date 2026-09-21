package com.campus.research.repository;

import com.campus.research.model.ProjectSelection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectSelectionRepository extends JpaRepository<ProjectSelection, Long> {
    Optional<ProjectSelection> findByStudentId(Long studentId);
    List<ProjectSelection> findByFacultyId(Long facultyId);
    List<ProjectSelection> findByCatalogueItemId(Long catalogueId);
    long countByFacultyId(Long facultyId);
}
