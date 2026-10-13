package com.campus.research.service;

import com.campus.research.model.Project;
import com.campus.research.model.ProposalDocument;
import com.campus.research.model.User;
import com.campus.research.repository.ProjectRepository;
import com.campus.research.repository.ProposalDocumentRepository;
import com.campus.research.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProposalDocumentRepository proposalDocumentRepository;
    private final MilestoneService milestoneService;
    private final FileStorageService fileStorageService;
    private final PdfTextExtractionService pdfTextExtractionService;
    private final OllamaSummarizationService ollamaSummarizationService;

    public ProjectService(
            ProjectRepository projectRepository,
            UserRepository userRepository,
            ProposalDocumentRepository proposalDocumentRepository,
            MilestoneService milestoneService,
            FileStorageService fileStorageService,
            PdfTextExtractionService pdfTextExtractionService,
            OllamaSummarizationService ollamaSummarizationService
    ) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.proposalDocumentRepository = proposalDocumentRepository;
        this.milestoneService = milestoneService;
        this.fileStorageService = fileStorageService;
        this.pdfTextExtractionService = pdfTextExtractionService;
        this.ollamaSummarizationService = ollamaSummarizationService;
    }

    public List<Project> getProjects(String role, Long userId) {
        if ("STUDENT".equalsIgnoreCase(role) && userId != null) {
            return projectRepository.findByStudentIdOrderByCreatedAtDesc(userId);
        } else if ("FACULTY".equalsIgnoreCase(role) && userId != null) {
            return projectRepository.findAllByOrderByCreatedAtDesc();
        }
        return projectRepository.findAllByOrderByCreatedAtDesc();
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    @Transactional
    public Project createProject(
            String title,
            String abstractText,
            String department,
            String domain,
            Long studentId,
            Long facultyId,
            MultipartFile proposalFile
    ) {
        Project project = new Project();
        project.setTitle(title != null ? title.trim() : "Untitled Research Project");
        project.setAbstractText(abstractText != null ? abstractText.trim() : "");
        project.setDepartment(department != null ? department.trim() : "Computer Science & Engineering");
        project.setDomain(domain != null ? domain.trim() : "Artificial Intelligence");
        project.setStatus(Project.Status.SUBMITTED);
        project.setCurrentMilestone("Proposal Submitted");

        project.setStudentId(studentId != null ? studentId : 1L);
        Optional<User> studentOpt = userRepository.findById(project.getStudentId());
        studentOpt.ifPresent(u -> project.setStudentName(u.getFullName()));

        if (facultyId != null) {
            project.setFacultyId(facultyId);
            Optional<User> facultyOpt = userRepository.findById(facultyId);
            facultyOpt.ifPresent(u -> project.setFacultyName(u.getFullName()));
        }

        String storedFilePath = null;
        String originalFileName = null;
        String extractedText = null;

        if (proposalFile != null && !proposalFile.isEmpty()) {
            originalFileName = proposalFile.getOriginalFilename();
            storedFilePath = fileStorageService.storeFile(proposalFile);

            try {
                extractedText = pdfTextExtractionService.extractText(storedFilePath);
            } catch (Exception ignored) {}
        }

        // Generate high-accuracy, structured AI insights combining title, domain, dept, abstract & extracted text
        String summary = ollamaSummarizationService.generateDeepInsight(
                project.getTitle(),
                project.getDomain(),
                project.getDepartment(),
                project.getAbstractText(),
                extractedText
        );

        project.setFileName(originalFileName != null ? originalFileName : "Research_Proposal_Abstract.pdf");
        project.setFileUrl(storedFilePath != null ? storedFilePath : "/uploads/sample_proposal.pdf");
        project.setExtractedText(extractedText);
        project.setSummary(summary);
        project.setCreatedAt(LocalDateTime.now());
        project.setUpdatedAt(LocalDateTime.now());

        Project savedProject = projectRepository.save(project);

        ProposalDocument doc = new ProposalDocument();
        doc.setProjectId(savedProject.getId());
        doc.setFileName(savedProject.getFileName());
        doc.setFilePath(savedProject.getFileUrl());
        doc.setVersion(1);
        doc.setExtractedText(extractedText);
        doc.setSummary(summary);
        doc.setUploadedAt(LocalDateTime.now());
        proposalDocumentRepository.save(doc);

        milestoneService.recordMilestone(
                savedProject.getId(),
                "Proposal Submitted",
                "COMPLETED",
                "Initial research abstract and proposal documents successfully submitted by " + (project.getStudentName() != null ? project.getStudentName() : "student")
        );

        return savedProject;
    }

    @Transactional
    public Project refreshAiInsight(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found ID: " + projectId));

        String insight = ollamaSummarizationService.generateDeepInsight(
                project.getTitle(),
                project.getDomain(),
                project.getDepartment(),
                project.getAbstractText(),
                project.getExtractedText()
        );

        project.setSummary(insight);
        project.setUpdatedAt(LocalDateTime.now());
        return projectRepository.save(project);
    }
}
