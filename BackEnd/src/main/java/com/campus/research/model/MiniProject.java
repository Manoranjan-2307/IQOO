package com.campus.research.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "mini_projects")
public class MiniProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String domain;

    private String techStack;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "faculty_id", nullable = false)
    private User faculty;

    @ManyToOne
    @JoinColumn(name = "academic_officer_id")
    private User academicOfficer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.ALLOCATED;

    @Column(nullable = false)
    private Integer overallProgress = 0; // Percentage 0 - 100

    private String githubUrl;
    private String demoUrl;
    private String figmaUrl;
    private String videoUrl;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum Status {
        ALLOCATED, IN_PROGRESS, PROTOTYPE_SUBMITTED, COMPLETED
    }

    public MiniProject() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public User getFaculty() { return faculty; }
    public void setFaculty(User faculty) { this.faculty = faculty; }

    public User getAcademicOfficer() { return academicOfficer; }
    public void setAcademicOfficer(User academicOfficer) { this.academicOfficer = academicOfficer; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Integer getOverallProgress() { return overallProgress; }
    public void setOverallProgress(Integer overallProgress) { this.overallProgress = overallProgress; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getDemoUrl() { return demoUrl; }
    public void setDemoUrl(String demoUrl) { this.demoUrl = demoUrl; }

    public String getFigmaUrl() { return figmaUrl; }
    public void setFigmaUrl(String figmaUrl) { this.figmaUrl = figmaUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
