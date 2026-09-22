const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function createPdfReport(outputPath) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
    bufferPages: true,
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Palette Tokens
  const PRIMARY = "#7C3AED";
  const SECONDARY = "#6366F1";
  const DARK = "#0F172A";
  const TEXT_MUTED = "#64748B";
  const ACCENT_BG = "#F3E8FF";
  const BORDER_COLOR = "#CBD5E1";
  const SUCCESS = "#059669";

  // --- HEADER COVER / HERO BLOCK ---
  doc
    .rect(0, 0, 595.28, 120)
    .fill(PRIMARY);

  doc
    .fillColor("#FFFFFF")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("NEXUS-AI PORTAL", 40, 30);

  doc
    .fontSize(13)
    .font("Helvetica")
    .text("Institutional Academic Research & Intellectual Property Management System", 40, 58);

  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text("Executive System Architecture, Core Capability & AI Innovation Report", 40, 78);

  doc.moveDown(4);

  // --- SECTION 1: EXECUTIVE SUMMARY & PROBLEM STATEMENT ---
  doc.y = 140;

  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("1. EXECUTIVE SUMMARY & PROBLEM STATEMENT");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  doc
    .fillColor(DARK)
    .fontSize(9.5)
    .font("Helvetica")
    .text(
      "Modern higher-education institutions face significant challenges in managing the academic research lifecycle. Capstone projects, student publications, and innovative ideation are typically fragmented across spreadsheets, emails, and disconnected portals. Consequently, high-impact patentable inventions are frequently overlooked or delayed in filing.\n\n" +
      "Nexus-AI solves this institutional bottleneck by delivering a unified, enterprise-grade digital portal bridging Students, Faculty Mentors, Academic Administration, and Institutional IP Cell Officers. The platform integrates real-time milestone telemetry, AI-driven prior-art novelty scoring, and automated patent filing workflows to maximize institutional IP impact.",
      { align: "justify", lineGap: 3 }
    );

  doc.moveDown(1.5);

  // --- SECTION 2: CORE PLATFORM CAPABILITIES ---
  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("2. CORE PLATFORM CAPABILITIES");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  const capabilities = [
    {
      title: "End-to-End Proposal Lifecycle Management",
      desc: "Standardizes project proposal submissions, PDF upload parsing, structured abstract evaluations, and multi-stage faculty review workflows."
    },
    {
      title: "AI Prior-Art & Patent Novelty Scoring",
      desc: "Leverages LLM and cross-referencing algorithms to evaluate project novelty (calculating 90%+ uniqueness index), extract key claims, and perform global patent database collision checks."
    },
    {
      title: "Weekly Log & Deliverables Telemetry",
      desc: "Tracks student progress across 16 academic weeks with hours logged, technical challenges, GitHub prototype links, and automated AI activity summaries."
    },
    {
      title: "Expedited Patent & IP Filing Engine",
      desc: "Enables IP Cell Officers to evaluate patent-eligible proposals, assign official Indian Patent Office (IPO) application numbers, map jurisdictional zones, and transition status to IP_FILED."
    }
  ];

  capabilities.forEach((c) => {
    doc
      .fillColor(DARK)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`• ${c.title}: `, { continued: true })
      .font("Helvetica")
      .fillColor("#334155")
      .text(c.desc, { lineGap: 2 });
    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // --- SECTION 3: FOUR INTEGRATED GOVERNANCE PORTALS ---
  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("3. FOUR INTEGRATED GOVERNANCE PORTALS");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  const portals = [
    {
      role: "Student Research Portal",
      points: [
        "Browse and select S5 Capstone topics from approved institutional catalogue.",
        "Submit weekly progress logs, prototype GitHub links, and demo URLs.",
        "Track proposal approval stages via real-time Milestone Timelines."
      ]
    },
    {
      role: "Faculty Mentor Portal",
      points: [
        "Review student weekly deliverables, assign 1-5 star ratings, and provide guidance notes.",
        "Evaluate research proposals: Approve, request revisions, or recommend for Patent Filing.",
        "Monitor student team progress indicators and prototype repositories."
      ]
    },
    {
      role: "Academic Office Portal",
      points: [
        "Create and publish institutional project catalogues with domain & tech stack tags.",
        "Allocate faculty mentors to student research groups across departments.",
        "Manage central Academic Helpdesk tickets and resolve student/faculty queries."
      ]
    },
    {
      role: "Institutional IP Cell Portal",
      points: [
        "Inspect patent-eligible projects flagged as READY_FOR_IP.",
        "Review AI prior-art analysis reports, non-obviousness criteria, and novel claims.",
        "Generate official IPO application numbers, record jurisdictions, and submit patent filings."
      ]
    }
  ];

  portals.forEach((p) => {
    doc
      .fillColor(DARK)
      .fontSize(10.5)
      .font("Helvetica-Bold")
      .text(`[Portal] ${p.role}`);

    p.points.forEach((pt) => {
      doc
        .fillColor("#334155")
        .fontSize(9.5)
        .font("Helvetica")
        .text(`   - ${pt}`, { lineGap: 1.5 });
    });
    doc.moveDown(0.6);
  });

  // Page 2 Break
  doc.addPage();

  // --- SECTION 4: AUTOMATED MILESTONE STATE MACHINE ---
  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("4. AUTOMATED MILESTONE STATE MACHINE & WORKFLOW");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  doc
    .fillColor(DARK)
    .fontSize(9.5)
    .font("Helvetica")
    .text(
      "Projects transition through a deterministic state machine managed by automated milestone triggers:",
      { lineGap: 3 }
    );

  doc.moveDown(0.6);

  const workflowSteps = [
    { step: "SUBMITTED", desc: "Student submits research paper/proposal PDF to portal." },
    { step: "UNDER_REVIEW", desc: "Assigned Faculty Mentor conducts technical review and evaluation." },
    { step: "APPROVED", desc: "Faculty signs off on paper quality and mathematical formulation." },
    { step: "READY_FOR_IP", desc: "Project satisfies novelty threshold and is flagged as Patent Eligible." },
    { step: "IP_FILED", desc: "IP Cell Officer completes IPO form, application number generation, and formal filing." }
  ];

  workflowSteps.forEach((w) => {
    doc
      .fillColor(PRIMARY)
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .text(`Stage [${w.step}]: `, { continued: true })
      .fillColor(DARK)
      .font("Helvetica")
      .text(w.desc, { lineGap: 2 });
  });

  doc.moveDown(1.5);

  // --- SECTION 5: TECHNICAL ARCHITECTURE & STACK ---
  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("5. TECHNICAL ARCHITECTURE & STACK");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  const techStack = [
    { layer: "Frontend Layer", tech: "React 19, Vite, Lucide Icons, Bootstrap Icons, Custom Design Tokens (#F5F7FC Canvas, #7C3AED Accent)" },
    { layer: "Backend Framework", tech: "Java 17, Spring Boot 3.2, Spring Security, JWT RBAC Authentication, Spring Data JPA" },
    { layer: "Database Persistence", tech: "Embedded H2 / MySQL Relational Database with Transactional Integrity" },
    { layer: "API Architecture", tech: "RESTful HTTP API Endpoints with CORS configuration & Multi-Part File Storage" }
  ];

  techStack.forEach((t) => {
    doc
      .fillColor(DARK)
      .fontSize(10)
      .font("Helvetica-Bold")
      .text(`${t.layer}: `, { continued: true })
      .font("Helvetica")
      .fillColor("#334155")
      .text(t.tech, { lineGap: 2 });
  });

  doc.moveDown(1.5);

  // --- SECTION 6: IMPACT & VALUE PROPOSITION FOR PPT ---
  doc
    .fillColor(PRIMARY)
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("6. KEY IMPACT & VALUE PROPOSITION FOR PRESENTATIONS");

  doc
    .moveTo(40, doc.y + 4)
    .lineTo(555, doc.y + 4)
    .strokeColor(PRIMARY)
    .lineWidth(1)
    .stroke();

  doc.moveDown(0.8);

  const impacts = [
    "Accelerated Invention Commercialization: Cuts IP filing prep time from months to minutes using AI prior-art analysis.",
    "Unified Institutional Governance: Single source of truth for Students, Mentors, Deans, and IP Officers.",
    "Zero Loss of IP Assets: Automated detection ensures high-value capstone innovations are identified before graduation.",
    "Enterprise Design System: Modern, accessible, and high-performance UI tailored for academic excellence."
  ];

  impacts.forEach((imp) => {
    doc
      .fillColor(DARK)
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .text("✔ ", { continued: true })
      .font("Helvetica")
      .fillColor("#334155")
      .text(imp, { lineGap: 3 });
  });

  // Footer on all pages
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor(TEXT_MUTED)
      .text(
        `Nexus-AI Institutional Report | Page ${i + 1} of ${range.count}`,
        40,
        760,
        { align: "center", width: 515 }
      );
  }

  doc.end();
}

const targetPath = path.join(__dirname, "Nexus-AI_Executive_Portal_Report.pdf");
createPdfReport(targetPath);
console.log("PDF created successfully at: " + targetPath);
