package com.campus.research.controller;

import com.campus.research.dto.PatentClaimsDto;
import com.campus.research.service.PatentClaimsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ip-filings")
@CrossOrigin(origins = "*")
public class PatentClaimsController {

    private final PatentClaimsService patentClaimsService;

    public PatentClaimsController(PatentClaimsService patentClaimsService) {
        this.patentClaimsService = patentClaimsService;
    }

    @PostMapping("/{id}/generate-claims")
    public ResponseEntity<?> generateClaimsForFiling(@PathVariable Long id) {
        try {
            PatentClaimsDto claims = patentClaimsService.generateClaimsForIpFiling(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Patent claims and prior-art collision analysis generated successfully",
                    "claims", claims
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @GetMapping("/{id}/claims")
    public ResponseEntity<?> getClaimsForFiling(@PathVariable Long id) {
        try {
            PatentClaimsDto claims = patentClaimsService.generateClaimsForIpFiling(id);
            return ResponseEntity.ok(claims);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/project/{projectId}/generate-claims")
    public ResponseEntity<?> generateClaimsForProject(@PathVariable Long projectId) {
        try {
            PatentClaimsDto claims = patentClaimsService.generateClaimsForProject(projectId);
            return ResponseEntity.ok(Map.of(
                    "message", "Patent claims generated from project specification",
                    "claims", claims
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/draft-claims")
    public ResponseEntity<?> draftClaimsCustom(@RequestBody Map<String, String> body) {
        try {
            String title = body.getOrDefault("title", "Novel System");
            String domain = body.getOrDefault("domain", "Computing");
            String department = body.getOrDefault("department", "Engineering");
            String abstractText = body.getOrDefault("abstractText", "");

            PatentClaimsDto claims = patentClaimsService.buildClaimsSpecification(title, domain, department, abstractText);
            return ResponseEntity.ok(claims);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
