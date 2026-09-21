package com.campus.research.controller;

import com.campus.research.model.MiniProject;
import com.campus.research.model.WeeklyLog;
import com.campus.research.service.MiniProjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/mini-projects")
@CrossOrigin(origins = "*")
public class MiniProjectController {

    private final MiniProjectService miniProjectService;

    public MiniProjectController(MiniProjectService miniProjectService) {
        this.miniProjectService = miniProjectService;
    }

    @PostMapping
    public ResponseEntity<MiniProject> createMiniProject(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        Long facultyId = Long.valueOf(payload.get("facultyId").toString());
        Long academicOfficerId = payload.get("academicOfficerId") != null ? Long.valueOf(payload.get("academicOfficerId").toString()) : null;
        String title = (String) payload.get("title");
        String description = (String) payload.get("description");
        String department = (String) payload.get("department");
        String domain = (String) payload.get("domain");
        String techStack = (String) payload.get("techStack");

        MiniProject mp = miniProjectService.createMiniProject(studentId, facultyId, academicOfficerId, title, description, department, domain, techStack);
        return ResponseEntity.ok(mp);
    }

    @GetMapping
    public ResponseEntity<List<MiniProject>> getMiniProjects(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long facultyId
    ) {
        return ResponseEntity.ok(miniProjectService.getMiniProjects(studentId, facultyId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MiniProject> getById(@PathVariable Long id) {
        return miniProjectService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/weekly-logs")
    public ResponseEntity<List<WeeklyLog>> getWeeklyLogs(@PathVariable Long id) {
        return ResponseEntity.ok(miniProjectService.getWeeklyLogs(id));
    }

    @PostMapping("/{id}/weekly-logs")
    public ResponseEntity<WeeklyLog> submitWeeklyLog(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Integer weekNumber = Integer.valueOf(payload.get("weekNumber").toString());
        String workSummary = (String) payload.get("workSummary");
        String challenges = (String) payload.get("challenges");
        Integer hoursSpent = payload.get("hoursSpent") != null ? Integer.valueOf(payload.get("hoursSpent").toString()) : 0;
        String prototypeLink = (String) payload.get("prototypeLink");

        WeeklyLog log = miniProjectService.submitWeeklyLog(id, weekNumber, workSummary, challenges, hoursSpent, prototypeLink);
        return ResponseEntity.ok(log);
    }

    @PostMapping("/weekly-logs/{logId}/review")
    public ResponseEntity<WeeklyLog> reviewWeeklyLog(@PathVariable Long logId, @RequestBody Map<String, Object> payload) {
        String status = (String) payload.get("status");
        Integer rating = Integer.valueOf(payload.get("rating").toString());
        String feedback = (String) payload.get("feedback");

        WeeklyLog reviewed = miniProjectService.reviewWeeklyLog(logId, status, rating, feedback);
        return ResponseEntity.ok(reviewed);
    }

    @PutMapping("/{id}/deliverables")
    public ResponseEntity<MiniProject> updateDeliverables(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String githubUrl = payload.get("githubUrl");
        String demoUrl = payload.get("demoUrl");
        String figmaUrl = payload.get("figmaUrl");
        String videoUrl = payload.get("videoUrl");

        MiniProject updated = miniProjectService.updateDeliverables(id, githubUrl, demoUrl, figmaUrl, videoUrl);
        return ResponseEntity.ok(updated);
    }
}
