package com.campus.research.controller;

import com.campus.research.model.Project;
import com.campus.research.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Long userId
    ) {
        List<Project> list = projectService.getProjects(role, userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE })
    public ResponseEntity<?> createProject(
            @RequestParam("title") String title,
            @RequestParam(value = "abstractText", required = false) String abstractText,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "domain", required = false) String domain,
            @RequestParam(value = "studentId", required = false) Long studentId,
            @RequestParam(value = "facultyId", required = false) Long facultyId,
            @RequestParam(value = "proposalFile", required = false) MultipartFile proposalFile
    ) {
        try {
            Project created = projectService.createProject(
                    title,
                    abstractText,
                    department,
                    domain,
                    studentId,
                    facultyId,
                    proposalFile
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "message", "Project proposal submitted successfully",
                    "project", created
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to submit project: " + ex.getMessage()));
        }
    }

    @PostMapping("/{id}/ai-insights")
    public ResponseEntity<?> refreshAiInsight(@PathVariable Long id) {
        try {
            Project updated = projectService.refreshAiInsight(id);
            return ResponseEntity.ok(Map.of(
                    "message", "AI insights regenerated successfully with high-depth evaluation",
                    "project", updated,
                    "summary", updated.getSummary()
            ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to regenerate AI insights: " + ex.getMessage()));
        }
    }
}
