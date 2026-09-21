package com.campus.research.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "weekly_logs")
public class WeeklyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mini_project_id", nullable = false)
    private MiniProject miniProject;

    @Column(nullable = false)
    private Integer weekNumber; // 1 to 16

    @Column(nullable = false, columnDefinition = "TEXT")
    private String workSummary;

    @Column(columnDefinition = "TEXT")
    private String challenges;

    private Integer hoursSpent;

    private String prototypeLink; // Unlocked from Week 3-4 onwards

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SUBMITTED;

    private Integer facultyRating; // 1 to 5 stars

    @Column(columnDefinition = "TEXT")
    private String facultyFeedback;

    @Column(columnDefinition = "TEXT")
    private String aiSummary;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        SUBMITTED, APPROVED, REVISION_REQUESTED
    }

    public WeeklyLog() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public MiniProject getMiniProject() { return miniProject; }
    public void setMiniProject(MiniProject miniProject) { this.miniProject = miniProject; }

    public Integer getWeekNumber() { return weekNumber; }
    public void setWeekNumber(Integer weekNumber) { this.weekNumber = weekNumber; }

    public String getWorkSummary() { return workSummary; }
    public void setWorkSummary(String workSummary) { this.workSummary = workSummary; }

    public String getChallenges() { return challenges; }
    public void setChallenges(String challenges) { this.challenges = challenges; }

    public Integer getHoursSpent() { return hoursSpent; }
    public void setHoursSpent(Integer hoursSpent) { this.hoursSpent = hoursSpent; }

    public String getPrototypeLink() { return prototypeLink; }
    public void setPrototypeLink(String prototypeLink) { this.prototypeLink = prototypeLink; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Integer getFacultyRating() { return facultyRating; }
    public void setFacultyRating(Integer facultyRating) { this.facultyRating = facultyRating; }

    public String getFacultyFeedback() { return facultyFeedback; }
    public void setFacultyFeedback(String facultyFeedback) { this.facultyFeedback = facultyFeedback; }

    public String getAiSummary() { return aiSummary; }
    public void setAiSummary(String aiSummary) { this.aiSummary = aiSummary; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
