package com.campus.research.repository;

import com.campus.research.model.ProjectCatalogue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectCatalogueRepository extends JpaRepository<ProjectCatalogue, Long> {
    List<ProjectCatalogue> findByDomainIgnoreCase(String domain);
    List<ProjectCatalogue> findByDepartment(String department);
}
