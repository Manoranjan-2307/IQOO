package com.campus.research.config;

import com.campus.research.model.*;
import com.campus.research.repository.*;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalDocumentRepository proposalDocumentRepository;
    private final MilestoneRepository milestoneRepository;
    private final ReviewRepository reviewRepository;
    private final IpFilingRepository ipFilingRepository;
    private final MiniProjectRepository miniProjectRepository;
    private final WeeklyLogRepository weeklyLogRepository;
    private final NotificationRepository notificationRepository;
    private final ProjectCatalogueRepository catalogueRepository;
    private final ProjectSelectionRepository selectionRepository;
    private final AcademicQueryRepository queryRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ProjectRepository projectRepository,
            ProposalDocumentRepository proposalDocumentRepository,
            MilestoneRepository milestoneRepository,
            ReviewRepository reviewRepository,
            IpFilingRepository ipFilingRepository,
            MiniProjectRepository miniProjectRepository,
            WeeklyLogRepository weeklyLogRepository,
            NotificationRepository notificationRepository,
            ProjectCatalogueRepository catalogueRepository,
            ProjectSelectionRepository selectionRepository,
            AcademicQueryRepository queryRepository,
            org.springframework.security.crypto.password.PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.proposalDocumentRepository = proposalDocumentRepository;
        this.milestoneRepository = milestoneRepository;
        this.reviewRepository = reviewRepository;
        this.ipFilingRepository = ipFilingRepository;
        this.miniProjectRepository = miniProjectRepository;
        this.weeklyLogRepository = weeklyLogRepository;
        this.notificationRepository = notificationRepository;
        this.catalogueRepository = catalogueRepository;
        this.selectionRepository = selectionRepository;
        this.queryRepository = queryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("Initializing Nexus-AI Seed Data across 7 Departments & Simplified Domains...");

        // 1. Seed Faculty & Users Across 7 Departments (Indian Names)
        User u1 = new User(null, "Aarav Sharma", "alex.student@campus.edu", passwordEncoder.encode("student123"), User.Role.STUDENT, "CSE", LocalDateTime.now());
        User u2 = new User(null, "Ananya Patel", "sarah.student@campus.edu", passwordEncoder.encode("student123"), User.Role.STUDENT, "AI&DS", LocalDateTime.now());

        // Faculty Staff Across All 7 Depts (Indian Faculty Mentors)
        User fCSE = new User(null, "Dr. Rajesh Kumar", "robert.faculty@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "CSE", LocalDateTime.now());
        User fAIDS = new User(null, "Dr. Sunita Rao", "emily.faculty@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "AI&DS", LocalDateTime.now());
        User fAIML = new User(null, "Prof. Vikramaditya Verma", "michael.aiml@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "AI&ML", LocalDateTime.now());
        User fIT = new User(null, "Dr. Priya Sharma", "priya.it@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "IT", LocalDateTime.now());
        User fCSBS = new User(null, "Prof. Suresh Menon", "david.csbs@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "CSBS", LocalDateTime.now());
        User fECE = new User(null, "Dr. K. V. Ramanathan", "rajesh.ece@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "ECE", LocalDateTime.now());
        User fEEE = new User(null, "Prof. Meenakshi Sundaram", "anita.eee@campus.edu", passwordEncoder.encode("faculty123"), User.Role.FACULTY, "EEE", LocalDateTime.now());

        User uIp = new User(null, "Institutional IP Cell Officer", "ipcell@campus.edu", passwordEncoder.encode("admin123"), User.Role.IP_CELL, "Institutional IP Cell", LocalDateTime.now());
        User uAcad = new User(null, "Academic Affairs Office", "academics@campus.edu", passwordEncoder.encode("admin123"), User.Role.ACADEMIC_OFFICE, "Academic Administration", LocalDateTime.now());
        User uAdmin = new User(null, "Platform Administrator", "admin@campus.edu", passwordEncoder.encode("admin123"), User.Role.ADMIN, "Research & Development", LocalDateTime.now());

        userRepository.saveAll(List.of(u1, u2, fCSE, fAIDS, fAIML, fIT, fCSBS, fECE, fEEE, uIp, uAcad, uAdmin));

        // 2. Seed 10 S5 Project Catalogue Items (Simplified Domains)
        ProjectCatalogue c1 = new ProjectCatalogue();
        c1.setCode("S5-01");
        c1.setTitle("Autonomous Drone Swarm Navigation via Deep Reinforcement Learning");
        c1.setDescription("Decentralized trajectory planning algorithm for drone swarms operating in GPS-denied environments.");
        c1.setDepartment("CSE");
        c1.setDomain("CV");
        c1.setTechStack("PyTorch, ROS2, Python, OpenCV");
        c1.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c1.setSelectedCount(1);

        ProjectCatalogue c2 = new ProjectCatalogue();
        c2.setCode("S5-02");
        c2.setTitle("Blockchain-Based Secure Medical Record Vault with Zero-Knowledge Proofs");
        c2.setDescription("HIPAA-compliant medical health record sharing system using ZK-SNARKs and IPFS storage.");
        c2.setDepartment("AI&DS");
        c2.setDomain("Cybersecurity");
        c2.setTechStack("Solidity, React, IPFS, Circom");
        c2.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c2.setSelectedCount(0);

        ProjectCatalogue c3 = new ProjectCatalogue();
        c3.setCode("S5-03");
        c3.setTitle("Low-Power IoT Edge Sensor Nodes for Agricultural Soil Health Monitoring");
        c3.setDescription("Ultra-low power LoRaWAN sensor array with solar energy harvesting and yield forecasting.");
        c3.setDepartment("ECE");
        c3.setDomain("IoT & Embedded");
        c3.setTechStack("Embedded C, LoRaWAN, ESP32, MQTT");
        c3.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c3.setSelectedCount(1);

        ProjectCatalogue c4 = new ProjectCatalogue();
        c4.setCode("S5-04");
        c4.setTitle("Federated Learning for Privacy-Preserving Medical Imaging Diagnostics");
        c4.setDescription("Multi-hospital collaborative AI training architecture without sharing raw patient X-ray data.");
        c4.setDepartment("AI&ML");
        c4.setDomain("Machine Learning");
        c4.setTechStack("TensorFlow Federated, PyTorch, FastAPI");
        c4.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c4.setSelectedCount(0);

        ProjectCatalogue c5 = new ProjectCatalogue();
        c5.setCode("S5-05");
        c5.setTitle("Smart Grid Solar Inverter Monitoring via Microcontroller Telemetry");
        c5.setDescription("Real-time MPPT tracking and efficiency telemetry for campus rooftop solar installations.");
        c5.setDepartment("EEE");
        c5.setDomain("IoT & Embedded");
        c5.setTechStack("STM32, Modbus, Grafana, Node-RED");
        c5.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c5.setSelectedCount(0);

        ProjectCatalogue c6 = new ProjectCatalogue();
        c6.setCode("S5-06");
        c6.setTitle("Automated Financial Fraud Detection Platform for Campus Micro-Transactions");
        c6.setDescription("Real-time transaction anomaly detector leveraging graph neural networks and merchant telemetry.");
        c6.setDepartment("CSBS");
        c6.setDomain("Full-Stack");
        c6.setTechStack("Spring Boot, Neo4j, React 19, Kafka");
        c6.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c6.setSelectedCount(0);

        ProjectCatalogue c7 = new ProjectCatalogue();
        c7.setCode("S5-07");
        c7.setTitle("High-Throughput Cloud Microservice Gateway with Zero-Trust Authentication");
        c7.setDescription("API gateway enforcing OAuth2 JWT validation, dynamic rate-limiting, and distributed tracing.");
        c7.setDepartment("IT");
        c7.setDomain("Cloud & DevOps");
        c7.setTechStack("Go, Redis, Kubernetes, Envoy");
        c7.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c7.setSelectedCount(0);

        ProjectCatalogue c8 = new ProjectCatalogue();
        c8.setCode("S5-08");
        c8.setTitle("5G Signal Processing & Beamforming Optimization for Dense Campus Wi-Fi");
        c8.setDescription("MIMO beamforming channel estimation algorithm using spatial covariance matrix processing.");
        c8.setDepartment("ECE");
        c8.setDomain("IoT & Embedded");
        c8.setTechStack("MATLAB, GNU Radio, Python");
        c8.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c8.setSelectedCount(0);

        ProjectCatalogue c9 = new ProjectCatalogue();
        c9.setCode("S5-09");
        c9.setTitle("Real-Time Full-Stack Campus Resource Reservation Portal");
        c9.setDescription("High-concurrency room, lab, and equipment booking web app with live calendar sync.");
        c9.setDepartment("IT");
        c9.setDomain("Full-Stack");
        c9.setTechStack("React 19, Node.js, PostgreSQL, Tailwind");
        c9.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c9.setSelectedCount(0);

        ProjectCatalogue c10 = new ProjectCatalogue();
        c10.setCode("S5-10");
        c10.setTitle("Generative AI Document Summarizer & Automated Citation Extractor");
        c10.setDescription("LLM-powered research paper summarization portal with BibTeX citation generation.");
        c10.setDepartment("AI&DS");
        c10.setDomain("Gen-AI");
        c10.setTechStack("Python, LangChain, HuggingFace, React");
        c10.setPdfUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        c10.setSelectedCount(0);

        catalogueRepository.saveAll(List.of(c1, c2, c3, c4, c5, c6, c7, c8, c9, c10));

        // 3. Seed Initial Selection for Alex (S5-01)
        ProjectSelection sel1 = new ProjectSelection();
        sel1.setStudent(u1);
        sel1.setCatalogueItem(c1);
        sel1.setFaculty(fCSE);
        sel1.setStatus(ProjectSelection.Status.CONFIRMED);

        ProjectSelection sel2 = new ProjectSelection();
        sel2.setStudent(u2);
        sel2.setCatalogueItem(c3);
        sel2.setFaculty(null);
        sel2.setStatus(ProjectSelection.Status.PENDING_MENTOR);

        selectionRepository.saveAll(List.of(sel1, sel2));

        // 4. Seed Initial MiniProjects (Alex & Sarah under Dr. Robert Vance)
        MiniProject mp1 = new MiniProject();
        mp1.setTitle(c1.getTitle());
        mp1.setDescription(c1.getDescription());
        mp1.setDepartment(c1.getDepartment());
        mp1.setDomain(c1.getDomain());
        mp1.setTechStack(c1.getTechStack());
        mp1.setStudent(u1);
        mp1.setFaculty(fCSE);
        mp1.setAcademicOfficer(uAcad);
        mp1.setStatus(MiniProject.Status.PROTOTYPE_SUBMITTED);
        mp1.setOverallProgress(50);
        mp1.setGithubUrl("https://github.com/alex-campus/drone-swarm");
        mp1.setDemoUrl("https://drone-swarm.demo.app");

        MiniProject mp2 = new MiniProject();
        mp2.setTitle(c3.getTitle());
        mp2.setDescription(c3.getDescription());
        mp2.setDepartment("AI&DS");
        mp2.setDomain(c3.getDomain());
        mp2.setTechStack(c3.getTechStack());
        mp2.setStudent(u2);
        mp2.setFaculty(fCSE);
        mp2.setAcademicOfficer(uAcad);
        mp2.setStatus(MiniProject.Status.PROTOTYPE_SUBMITTED);
        mp2.setOverallProgress(75);
        mp2.setGithubUrl("https://github.com/sarah-campus/agricultural-iot");
        mp2.setDemoUrl("https://soil-iot.demo.app");

        miniProjectRepository.saveAll(List.of(mp1, mp2));

        // 5. Seed Weekly Logs for MiniProjects mp1 & mp2
        WeeklyLog w1 = new WeeklyLog();
        w1.setMiniProject(mp1);
        w1.setWeekNumber(1);
        w1.setWorkSummary("Literature review on drone swarm flocking algorithms & ROS2 gazebo environment setup.");
        w1.setChallenges("Gazebo physics engine initial state instability resolved by tweaking gravity parameters.");
        w1.setHoursSpent(14);
        w1.setStatus(WeeklyLog.Status.APPROVED);
        w1.setFacultyRating(5);
        w1.setFacultyFeedback("Thorough literature review and clean ROS2 setup.");
        w1.setAiSummary("Initialized Gazebo simulation world and completed flocking paper review.");

        WeeklyLog w2 = new WeeklyLog();
        w2.setMiniProject(mp1);
        w2.setWeekNumber(2);
        w2.setWorkSummary("Implemented decentralized PPO algorithm for 5-drone obstacle avoidance.");
        w2.setChallenges("High reward variance during training episodes 10k-25k.");
        w2.setHoursSpent(18);
        w2.setStatus(WeeklyLog.Status.APPROVED);
        w2.setFacultyRating(5);
        w2.setFacultyFeedback("Great progress on PPO convergence graph.");
        w2.setAiSummary("Multi-agent PPO network trained over 50,000 steps with 0 collisions.");

        WeeklyLog w3 = new WeeklyLog();
        w3.setMiniProject(mp1);
        w3.setWeekNumber(3);
        w3.setWorkSummary("Trained reward function with dynamic wind disturbance vectors & uploaded prototype code.");
        w3.setChallenges("Simulating cross-wind forces accurately on lightweight quadcopter frames.");
        w3.setHoursSpent(20);
        w3.setPrototypeLink("https://github.com/alex-campus/drone-swarm/tree/week3-proto");
        w3.setStatus(WeeklyLog.Status.APPROVED);
        w3.setFacultyRating(4);
        w3.setFacultyFeedback("Add stability tests under 20kt cross-wind conditions.");
        w3.setAiSummary("Integrated wind tensor vectors and attached week 3 prototype GitHub URL.");

        WeeklyLog w4 = new WeeklyLog();
        w4.setMiniProject(mp1);
        w4.setWeekNumber(4);
        w4.setWorkSummary("Hardware-in-the-loop testing on PX4 flight controller board.");
        w4.setChallenges("Serial telemetry latency between companion computer and PX4 FCU.");
        w4.setHoursSpent(22);
        w4.setPrototypeLink("https://github.com/alex-campus/drone-swarm/tree/week4-hil");
        w4.setStatus(WeeklyLog.Status.APPROVED);
        w4.setFacultyRating(5);
        w4.setFacultyFeedback("Outstanding HIL test results! Ready for mid-semester evaluation.");
        w4.setAiSummary("Validated PX4 hardware-in-the-loop telemetry with 99.4% waypoint precision.");

        // Logs for Sarah (mp2)
        WeeklyLog w5 = new WeeklyLog();
        w5.setMiniProject(mp2);
        w5.setWeekNumber(1);
        w5.setWorkSummary("LoRaWAN edge node hardware assembly & sensor pinout mapping.");
        w5.setChallenges("Selecting low-power sleep modes for ESP32 microcontrollers.");
        w5.setHoursSpent(16);
        w5.setStatus(WeeklyLog.Status.APPROVED);
        w5.setFacultyRating(5);
        w5.setFacultyFeedback("Clean hardware schematic diagram and pinout specification.");
        w5.setAiSummary("Assembled ESP32 LoRaWAN edge node board and calibrated sleep timers.");

        WeeklyLog w6 = new WeeklyLog();
        w6.setMiniProject(mp2);
        w6.setWeekNumber(2);
        w6.setWorkSummary("Electrochemical NPK soil sensor calibration in lab environment.");
        w6.setChallenges("Analog-to-digital converter signal noise under high soil moisture.");
        w6.setHoursSpent(19);
        w6.setPrototypeLink("https://github.com/sarah-campus/agricultural-iot/tree/week2-calib");
        w6.setStatus(WeeklyLog.Status.APPROVED);
        w6.setFacultyRating(5);
        w6.setFacultyFeedback("Excellent ADC filtering implementation.");
        w6.setAiSummary("Calibrated soil NPK telemetry sensors with noise-filtering firmware.");

        weeklyLogRepository.saveAll(List.of(w1, w2, w3, w4, w5, w6));

        // 6. Seed Research Papers / Proposals (Project Entity)
        Project p1 = new Project();
        p1.setTitle("Decentralized Swarm Navigation using Multi-Agent Deep Reinforcement Learning");
        p1.setAbstractText("This paper presents a novel multi-agent proximal policy optimization framework for autonomous drone swarms in GPS-denied environments.");
        p1.setDepartment("CSE");
        p1.setDomain("CV");
        p1.setStatus(Project.Status.APPROVED);
        p1.setCurrentMilestone("Faculty Approved");
        p1.setStudentId(u1.getId());
        p1.setStudentName(u1.getFullName());
        p1.setFacultyId(fCSE.getId());
        p1.setFacultyName(fCSE.getFullName());
        p1.setFileName("drone_swarm_paper.pdf");
        p1.setFileUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        p1.setSummary("High-impact research paper on swarm robotics and computer vision.");

        Project p2 = new Project();
        p2.setTitle("Privacy-Preserving Federated Learning for Multimodal Medical Imaging");
        p2.setAbstractText("A decentralized federated learning framework with differential privacy guarantees for multi-hospital diagnostic imaging.");
        p2.setDepartment("AI&ML");
        p2.setDomain("Machine Learning");
        p2.setStatus(Project.Status.UNDER_REVIEW);
        p2.setCurrentMilestone("Under Faculty Evaluation");
        p2.setStudentId(u2.getId());
        p2.setStudentName(u2.getFullName());
        p2.setFacultyId(fAIDS.getId());
        p2.setFacultyName(fAIDS.getFullName());
        p2.setFileName("federated_medical_imaging.pdf");
        p2.setFileUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        p2.setSummary("Privacy-preserving AI architecture for multi-center hospital clinical data.");

        Project p3 = new Project();
        p3.setTitle("Zero-Knowledge Proof Verification on Scalable Layer-2 Micro-chains");
        p3.setAbstractText("Optimized ZK-SNARK verifier circuit reducing gas consumption by 38% on micro-transaction blockchain networks.");
        p3.setDepartment("AI&DS");
        p3.setDomain("Cybersecurity");
        p3.setStatus(Project.Status.READY_FOR_IP);
        p3.setCurrentMilestone("Recommended for Patent");
        p3.setStudentId(u2.getId());
        p3.setStudentName(u2.getFullName());
        p3.setFacultyId(fAIML.getId());
        p3.setFacultyName(fAIML.getFullName());
        p3.setFileName("zk_microchain_paper.pdf");
        p3.setFileUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        p3.setSummary("Cryptographic zero-knowledge verification scheme for layer-2 rollups.");

        Project p4 = new Project();
        p4.setTitle("IoT-Enabled Real-Time Soil Nitrogen Telemetry for Precision Agriculture");
        p4.setAbstractText("Ultra-low power LoRaWAN agricultural telemetry node with integrated soil NPK electrochemical sensors.");
        p4.setDepartment("ECE");
        p4.setDomain("IoT & Embedded");
        p4.setStatus(Project.Status.IP_FILED);
        p4.setCurrentMilestone("Patent Application Filed");
        p4.setStudentId(u1.getId());
        p4.setStudentName(u1.getFullName());
        p4.setFacultyId(fECE.getId());
        p4.setFacultyName(fECE.getFullName());
        p4.setFileName("lorawan_soil_telemetry.pdf");
        p4.setFileUrl("/uploads/S5_Project_Catalogue_2026.pdf");
        p4.setSummary("Hardware IoT node design and firmware for automated soil telemetry.");

        projectRepository.saveAll(List.of(p1, p2, p3, p4));

        // 7. Seed Faculty Reviews
        Review r1 = new Review(null, p1.getId(), fCSE.getId(), fCSE.getFullName(), "APPROVED", "Exceptional mathematical formulation and ROS2 simulation results. Approved for campus publication and patent filing.", LocalDateTime.now().minusDays(10));
        Review r2 = new Review(null, p2.getId(), fAIDS.getId(), fAIDS.getFullName(), "REVISION_REQUESTED", "Solid baseline architecture. Please add ablation study comparing differential privacy noise levels before final signoff.", LocalDateTime.now().minusDays(5));
        Review r3 = new Review(null, p3.getId(), fAIML.getId(), fAIML.getFullName(), "READY_FOR_IP", "Novel ZK-SNARK verifier optimization achieved. Recommended for immediate patent protection.", LocalDateTime.now().minusDays(3));
        Review r4 = new Review(null, p4.getId(), fECE.getId(), fECE.getFullName(), "IP_FILED", "Hardware prototype validated in greenhouse environment. Patent draft completed successfully.", LocalDateTime.now().minusDays(1));

        reviewRepository.saveAll(List.of(r1, r2, r3, r4));

        // 8. Seed Institutional IP Filings
        IpFiling ip1 = new IpFiling();
        ip1.setProjectId(p1.getId());
        ip1.setProjectTitle(p1.getTitle());
        ip1.setStudentName(u1.getFullName());
        ip1.setIpType(IpFiling.IpType.PATENT);
        ip1.setApplicationNo("IN202641098231");
        ip1.setFilingStatus(IpFiling.FilingStatus.GRANTED);
        ip1.setFilingDate(LocalDate.of(2026, 1, 15));
        ip1.setInventors("Aarav Sharma, Dr. Rajesh Kumar");
        ip1.setNotes("Patent granted by Indian Patent Office (IPO) with 20-year term.");

        IpFiling ip2 = new IpFiling();
        ip2.setProjectId(p3.getId());
        ip2.setProjectTitle("Zero-Knowledge Cryptographic Micro-Vault Architecture");
        ip2.setStudentName(u2.getFullName());
        ip2.setIpType(IpFiling.IpType.PATENT);
        ip2.setApplicationNo("IN202641098232");
        ip2.setFilingStatus(IpFiling.FilingStatus.UNDER_EXAMINATION);
        ip2.setFilingDate(LocalDate.of(2026, 2, 10));
        ip2.setInventors("Ananya Patel, Prof. Vikramaditya Verma");
        ip2.setNotes("First Examination Report (FER) response submitted under expedited examination.");

        IpFiling ip3 = new IpFiling();
        ip3.setProjectId(p4.getId());
        ip3.setProjectTitle("LoRaWAN Edge Soil Telemetry Sensor Firmware v2.0");
        ip3.setStudentName(u2.getFullName());
        ip3.setIpType(IpFiling.IpType.COPYRIGHT);
        ip3.setApplicationNo("CR2026-CS-4412");
        ip3.setFilingStatus(IpFiling.FilingStatus.FILED);
        ip3.setFilingDate(LocalDate.of(2026, 3, 1));
        ip3.setInventors("Ananya Patel, Dr. K. V. Ramanathan");
        ip3.setNotes("Software copyright application formally acknowledged by Copyright Office.");

        IpFiling ip4 = new IpFiling();
        ip4.setProjectId(p1.getId());
        ip4.setProjectTitle("Ultra-Low Power MPPT Solar Micro-Inverter Enclosure Design");
        ip4.setStudentName(u1.getFullName());
        ip4.setIpType(IpFiling.IpType.INDUSTRIAL_DESIGN);
        ip4.setApplicationNo("DES2026-9912");
        ip4.setFilingStatus(IpFiling.FilingStatus.DRAFTED);
        ip4.setFilingDate(LocalDate.of(2026, 3, 12));
        ip4.setInventors("Aarav Sharma, Prof. Meenakshi Sundaram");
        ip4.setNotes("3D CAD models and structural blueprints submitted to Institutional IP Cell.");

        ipFilingRepository.saveAll(List.of(ip1, ip2, ip3, ip4));

        // 9. Seed Academic Queries
        AcademicQuery q1 = new AcademicQuery();
        q1.setSender(u1);
        q1.setUserRole("STUDENT");
        q1.setCategory("Guide Allocation");
        q1.setSubject("Requesting Guide Mapping Confirmation for S5-01 Topic");
        q1.setMessage("Dear Academic Office, I have selected topic S5-01 (Drone Swarm Navigation). Could you please confirm if Dr. Rajesh Kumar is mapped as our guide?");
        q1.setStatus(AcademicQuery.Status.OPEN);

        queryRepository.save(q1);

        // 10. Seed Notifications
        notificationRepository.save(new Notification(
                null, u2.getId(), "Project Selection Pending",
                "You selected topic '" + c3.getTitle() + "'. Awaiting Academic Office mentor allocation.",
                "PROJECT_ASSIGNED", false, LocalDateTime.now().minusHours(1)
        ));

        System.out.println("Nexus-AI Seed Data successfully initialized.");
    }
}
