package com.campus.research.repository;

import com.campus.research.model.WeeklyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyLogRepository extends JpaRepository<WeeklyLog, Long> {
    List<WeeklyLog> findByMiniProjectIdOrderByWeekNumberAsc(Long miniProjectId);
    Optional<WeeklyLog> findByMiniProjectIdAndWeekNumber(Long miniProjectId, Integer weekNumber);
}
