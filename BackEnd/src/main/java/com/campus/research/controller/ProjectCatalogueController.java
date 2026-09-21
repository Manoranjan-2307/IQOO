package com.campus.research.controller;

import com.campus.research.model.ProjectCatalogue;
import com.campus.research.model.ProjectSelection;
import com.campus.research.service.ProjectCatalogueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/project-catalogue")
@CrossOrigin(origins = "*")
public class ProjectCatalogueController {

    private final ProjectCatalogueService catalogueService;

    public ProjectCatalogueController(ProjectCatalogueService catalogueService) {
        this.catalogueService = catalogueService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectCatalogue>> getCatalogue(@RequestParam(required = false) String domain) {
        return ResponseEntity.ok(catalogueService.getCatalogue(domain));
    }

    @PostMapping
    public ResponseEntity<ProjectCatalogue> createCatalogueItem(@RequestBody Map<String, String> payload) {
        String code = payload.get("code");
        String title = payload.get("title");
        String description = payload.get("description");
        String department = payload.get("department");
        String domain = payload.get("domain");
        String techStack = payload.get("techStack");
        String pdfUrl = payload.get("pdfUrl");

        ProjectCatalogue item = catalogueService.createCatalogueItem(code, title, description, department, domain, techStack, pdfUrl);
        return ResponseEntity.ok(item);
    }

    @PostMapping("/selections")
    public ResponseEntity<ProjectSelection> selectProject(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long catalogueId = Long.valueOf(payload.get("catalogueId").toString());

        ProjectSelection selection = catalogueService.selectProject(studentId, catalogueId);
        return ResponseEntity.ok(selection);
    }

    @GetMapping("/selections")
    public ResponseEntity<List<ProjectSelection>> getAllSelections() {
        return ResponseEntity.ok(catalogueService.getAllSelections());
    }

    @GetMapping("/selections/student")
    public ResponseEntity<ProjectSelection> getStudentSelection(@RequestParam Long studentId) {
        return catalogueService.getStudentSelection(studentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/selections/{id}/allocate-mentor")
    public ResponseEntity<List<ProjectSelection>> allocateMentor(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Long facultyId = Long.valueOf(payload.get("facultyId").toString());
        List<ProjectSelection> updated = catalogueService.allocateMentorToSelection(id, facultyId);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/ai-recommend-mentor")
    public ResponseEntity<Map<String, Object>> getAiStaffRecommendations(@RequestParam String domain) {
        return ResponseEntity.ok(catalogueService.getAiStaffRecommendations(domain));
    }
}
