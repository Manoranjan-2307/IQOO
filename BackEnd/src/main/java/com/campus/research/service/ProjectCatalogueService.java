package com.campus.research.service;

import com.campus.research.model.*;
import com.campus.research.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class ProjectCatalogueService {

    private final ProjectCatalogueRepository catalogueRepository;
    private final ProjectSelectionRepository selectionRepository;
    private final UserRepository userRepository;
    private final MiniProjectService miniProjectService;
    private final NotificationRepository notificationRepository;

    public ProjectCatalogueService(
            ProjectCatalogueRepository catalogueRepository,
            ProjectSelectionRepository selectionRepository,
            UserRepository userRepository,
            MiniProjectService miniProjectService,
            NotificationRepository notificationRepository
    ) {
        this.catalogueRepository = catalogueRepository;
        this.selectionRepository = selectionRepository;
        this.userRepository = userRepository;
        this.miniProjectService = miniProjectService;
        this.notificationRepository = notificationRepository;
    }

    public List<ProjectCatalogue> getCatalogue(String domain) {
        if (domain != null && !domain.isBlank() && !"ALL".equalsIgnoreCase(domain)) {
            return catalogueRepository.findByDomainIgnoreCase(domain);
        }
        return catalogueRepository.findAll();
    }

    @Transactional
    public ProjectCatalogue createCatalogueItem(String code, String title, String description, String department, String domain, String techStack, String pdfUrl) {
        ProjectCatalogue item = new ProjectCatalogue();
        item.setCode(code);
        item.setTitle(title);
        item.setDescription(description);
        item.setDepartment(department);
        item.setDomain(domain);
        item.setTechStack(techStack);
        item.setMaxStudents(2); // Max 2 students per topic
        item.setSelectedCount(0);
        item.setPdfUrl(pdfUrl != null ? pdfUrl : "/uploads/S5_Project_Catalogue_2026.pdf");
        return catalogueRepository.save(item);
    }

    @Transactional
    public ProjectSelection selectProject(Long studentId, Long catalogueId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        Optional<ProjectSelection> existing = selectionRepository.findByStudentId(studentId);
        if (existing.isPresent()) {
            throw new IllegalStateException("Student already confirmed a project selection: " + existing.get().getCatalogueItem().getTitle());
        }

        ProjectCatalogue catalogue = catalogueRepository.findById(catalogueId)
                .orElseThrow(() -> new IllegalArgumentException("Catalogue item not found: " + catalogueId));

        if (catalogue.getSelectedCount() >= catalogue.getMaxStudents()) {
            throw new IllegalStateException("This project topic has reached maximum student capacity (2/2 seats taken).");
        }

        catalogue.setSelectedCount(catalogue.getSelectedCount() + 1);
        catalogueRepository.save(catalogue);

        ProjectSelection selection = new ProjectSelection();
        selection.setStudent(student);
        selection.setCatalogueItem(catalogue);
        selection.setStatus(ProjectSelection.Status.PENDING_MENTOR);

        ProjectSelection saved = selectionRepository.save(selection);

        // Notify Academic Office
        List<User> academicsList = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.ACADEMIC_OFFICE)
                .toList();

        for (User academics : academicsList) {
            notificationRepository.save(new Notification(
                    null, academics.getId(),
                    "Project Selection Submitted",
                    student.getFullName() + " selected topic '" + catalogue.getTitle() + "'. Awaiting mentor allocation.",
                    "PROJECT_ASSIGNED", false, LocalDateTime.now()
            ));
        }

        return saved;
    }

    public List<ProjectSelection> getAllSelections() {
        return selectionRepository.findAll();
    }

    public Optional<ProjectSelection> getStudentSelection(Long studentId) {
        return selectionRepository.findByStudentId(studentId);
    }

    @Transactional
    public List<ProjectSelection> allocateMentorToSelection(Long selectionId, Long facultyId) {
        ProjectSelection targetSelection = selectionRepository.findById(selectionId)
                .orElseThrow(() -> new IllegalArgumentException("Selection not found: " + selectionId));

        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new IllegalArgumentException("Faculty mentor not found: " + facultyId));

        long currentMentorLoad = selectionRepository.countByFacultyId(facultyId);
        if (currentMentorLoad >= 10) {
            throw new IllegalStateException("Faculty mentor " + faculty.getFullName() + " has reached maximum load capacity (10 students).");
        }

        ProjectCatalogue catalogueItem = targetSelection.getCatalogueItem();

        // Group ALL students who chose the SAME project topic under the SAME faculty mentor!
        List<ProjectSelection> sameTopicSelections = selectionRepository.findByCatalogueItemId(catalogueItem.getId());

        List<ProjectSelection> updatedList = new ArrayList<>();
        for (ProjectSelection sel : sameTopicSelections) {
            sel.setFaculty(faculty);
            sel.setStatus(ProjectSelection.Status.CONFIRMED);
            ProjectSelection updatedSel = selectionRepository.save(sel);
            updatedList.add(updatedSel);

            // Create MiniProject entry for active tracking
            miniProjectService.createMiniProject(
                    sel.getStudent().getId(),
                    faculty.getId(),
                    null,
                    catalogueItem.getTitle(),
                    catalogueItem.getDescription(),
                    catalogueItem.getDepartment(),
                    catalogueItem.getDomain(),
                    catalogueItem.getTechStack()
            );

            // Notify Student
            notificationRepository.save(new Notification(
                    null, sel.getStudent().getId(),
                    "Mentor Assigned & Project Confirmed",
                    "Academic Office assigned " + faculty.getFullName() + " as your Faculty Mentor for '" + catalogueItem.getTitle() + "'.",
                    "PROJECT_ASSIGNED", false, LocalDateTime.now()
            ));
        }

        // Notify Faculty
        notificationRepository.save(new Notification(
                null, faculty.getId(),
                "New Student Group Assigned",
                "Assigned " + updatedList.size() + " student(s) for project '" + catalogueItem.getTitle() + "'.",
                "PROJECT_ASSIGNED", false, LocalDateTime.now()
        ));

        return updatedList;
    }

    public Map<String, Object> getAiStaffRecommendations(String domain) {
        String domUpper = domain != null ? domain.toUpperCase() : "";
        List<String> targetDepts = new ArrayList<>();

        if (domUpper.contains("GEN-AI") || domUpper.contains("MACHINE") || domUpper.contains("LEARNING") || domUpper.contains("AI")) {
            targetDepts.addAll(List.of("AI&DS", "AI&ML", "CSE"));
        } else if (domUpper.contains("CV") || domUpper.contains("VISION") || domUpper.contains("IMAGE")) {
            targetDepts.addAll(List.of("CSE", "AI&DS", "AI&ML"));
        } else if (domUpper.contains("IOT") || domUpper.contains("EMBEDDED") || domUpper.contains("HARDWARE")) {
            targetDepts.addAll(List.of("ECE", "EEE", "CSE"));
        } else if (domUpper.contains("FULL-STACK") || domUpper.contains("WEB") || domUpper.contains("CSBS")) {
            targetDepts.addAll(List.of("IT", "CSE", "CSBS"));
        } else if (domUpper.contains("CLOUD") || domUpper.contains("DEVOPS") || domUpper.contains("SECURITY") || domUpper.contains("CYBER")) {
            targetDepts.addAll(List.of("IT", "CSE", "AI&DS"));
        } else {
            targetDepts.addAll(List.of("CSE", "IT", "AI&DS"));
        }

        List<User> allFaculty = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.FACULTY)
                .toList();

        List<Map<String, Object>> recommendations = new ArrayList<>();
        for (User f : allFaculty) {
            boolean isRecommended = targetDepts.contains(f.getDepartment());
            long load = selectionRepository.countByFacultyId(f.getId());

            Map<String, Object> item = new HashMap<>();
            item.put("facultyId", f.getId());
            item.put("fullName", f.getFullName());
            item.put("department", f.getDepartment());
            item.put("currentLoad", load);
            item.put("maxLoad", 10);
            item.put("aiRecommended", isRecommended);
            item.put("recommendationReason", isRecommended
                    ? "🤖 AI Recommendation: High domain expertise alignment (" + f.getDepartment() + " faculty for " + domain + ")"
                    : "Available Faculty Mentor (" + f.getDepartment() + ")");
            recommendations.add(item);
        }

        recommendations.sort((a, b) -> Boolean.compare((Boolean) b.get("aiRecommended"), (Boolean) a.get("aiRecommended")));

        Map<String, Object> result = new HashMap<>();
        result.put("domain", domain);
        result.put("primaryRecommendedDepts", targetDepts);
        result.put("facultyList", recommendations);
        return result;
    }
}
