package com.campus.research.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "project_selections")
public class ProjectSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne
    @JoinColumn(name = "catalogue_id", nullable = false)
    private ProjectCatalogue catalogueItem;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private User faculty; // Assigned Faculty Guide

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING_MENTOR;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        PENDING_MENTOR, CONFIRMED
    }

    public ProjectSelection() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public ProjectCatalogue getCatalogueItem() { return catalogueItem; }
    public void setCatalogueItem(ProjectCatalogue catalogueItem) { this.catalogueItem = catalogueItem; }

    public User getFaculty() { return faculty; }
    public void setFaculty(User faculty) { this.faculty = faculty; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
