package com.campus.research.controller;

import com.campus.research.model.AcademicQuery;
import com.campus.research.service.AcademicQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/academic-queries")
@CrossOrigin(origins = "*")
public class AcademicQueryController {

    private final AcademicQueryService queryService;

    public AcademicQueryController(AcademicQueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping
    public ResponseEntity<AcademicQuery> submitQuery(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        String category = (String) payload.get("category");
        String subject = (String) payload.get("subject");
        String message = (String) payload.get("message");

        AcademicQuery query = queryService.submitQuery(senderId, category, subject, message);
        return ResponseEntity.ok(query);
    }

    @GetMapping
    public ResponseEntity<List<AcademicQuery>> getQueries(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(queryService.getQueries(status));
    }

    @GetMapping("/user")
    public ResponseEntity<List<AcademicQuery>> getUserQueries(@RequestParam Long userId) {
        return ResponseEntity.ok(queryService.getUserQueries(userId));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<AcademicQuery> replyToQuery(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Long officerId = payload.get("academicOfficerId") != null ? Long.valueOf(payload.get("academicOfficerId").toString()) : null;
        String replyMessage = (String) payload.get("replyMessage");

        AcademicQuery query = queryService.replyToQuery(id, officerId, replyMessage);
        return ResponseEntity.ok(query);
    }
}
