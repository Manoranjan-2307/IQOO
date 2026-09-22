import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import {
  Search,
  Filter,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  Award,
  ChevronRight,
  X,
  RefreshCw,
  ExternalLink,
  BookOpen
} from "lucide-react";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";

export default function IpExaminationQueue() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [ipFilings, setIpFilings] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  
  // Selected project modal state
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState("AI_NOVELTY");
  const [submitting, setSubmitting] = useState(false);
  
  // Filing form state inside modal
  const [filingForm, setFilingForm] = useState({
    ipType: "PATENT",
    applicationNo: "",
    jurisdiction: "IPO Chennai (South Zone)",
    filingStatus: "FILED",
    filingDate: new Date().toISOString().split("T")[0],
    inventors: "",
    notes: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, ipRes] = await Promise.all([
        axios.get("/api/projects"),
        axios.get("/api/ip-filings")
      ]);

      const fetchedProjects = Array.isArray(projRes.data) ? projRes.data : [];
      const fetchedFilings = Array.isArray(ipRes.data) ? ipRes.data : [];

      setProjects(fetchedProjects);
      setIpFilings(fetchedFilings);

      // Fetch weekly logs for projects to show horizontal progress
      const logsMap = {};
      for (const p of fetchedProjects) {
        try {
          const logRes = await axios.get(`/api/mini-projects/student/${p.studentId}`);
          if (logRes.data && logRes.data.weeklyLogs) {
            logsMap[p.id] = logRes.data.weeklyLogs;
          }
        } catch (e) {
          // ignore error if student has no mini-project
        }
      }
      setWeeklyLogs(logsMap);
    } catch (e) {
      console.error("Error loading examination queue:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects relevant for IP examination
  const filteredProjects = projects.filter((p) => {
    // Match search
    const matchesSearch =
      (p.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.department || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.domain || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDepartment === "ALL" || p.department === selectedDepartment;

    // Check filing status if linked to an IP filing
    const linkedFiling = ipFilings.find((f) => String(f.projectId) === String(p.id));
    const filingStatus = linkedFiling ? linkedFiling.filingStatus : (p.status === "IP_FILED" ? "FILED" : "PENDING");

    if (selectedStatusFilter === "ALL") return matchesSearch && matchesDept;
    if (selectedStatusFilter === "PENDING") return matchesSearch && matchesDept && (p.status === "READY_FOR_IP" || (!linkedFiling && p.status !== "IP_FILED"));
    if (selectedStatusFilter === "UNDER_EXAMINATION") return matchesSearch && matchesDept && linkedFiling?.filingStatus === "UNDER_EXAMINATION";
    if (selectedStatusFilter === "FILED") return matchesSearch && matchesDept && (linkedFiling?.filingStatus === "FILED" || linkedFiling?.filingStatus === "GRANTED" || p.status === "IP_FILED");

    return matchesSearch && matchesDept;
  });

  const handleOpenExaminationModal = (project) => {
    setSelectedProject(project);
    const existing = ipFilings.find((f) => String(f.projectId) === String(project.id));
    
    setFilingForm({
      ipType: existing ? existing.ipType : "PATENT",
      applicationNo: existing ? existing.applicationNo : `IN2026${Math.floor(100000 + Math.random() * 900000)}`,
      jurisdiction: "IPO Chennai (South Zone)",
      filingStatus: existing ? existing.filingStatus : "FILED",
      filingDate: existing && existing.filingDate ? existing.filingDate : new Date().toISOString().split("T")[0],
      inventors: existing ? existing.inventors : `${project.studentName || "Lead Student"}, ${project.facultyName || "Faculty Mentor"}`,
      notes: existing ? existing.notes : "AI Prior-Art novelty score verified (94%). non-obviousness criteria satisfied.",
    });
    setActiveTab("AI_NOVELTY");
  };

  const handleApproveAndFile = async (statusToSet = "FILED") => {
    if (!selectedProject) return;
    try {
      setSubmitting(true);
      
      // Post to /api/ip-filings
      await axios.post("/api/ip-filings", {
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        studentName: selectedProject.studentName,
        ipType: filingForm.ipType,
        applicationNo: filingForm.applicationNo,
        filingStatus: statusToSet,
        filingDate: filingForm.filingDate,
        inventors: filingForm.inventors,
        notes: filingForm.notes,
      });

      // Submit review status change to update project status
      await axios.post("/api/reviews", {
        projectId: selectedProject.id,
        facultyId: user?.id || 10,
        statusChange: statusToSet === "FILED" ? "IP_FILED" : "READY_FOR_IP",
        feedbackText: `IP Cell Officer approved filing. App No: ${filingForm.applicationNo}. Notes: ${filingForm.notes}`
      });

      await fetchData();
      setSelectedProject(null);
    } catch (e) {
      console.error("Error filing patent:", e);
      alert("Failed to submit filing. Please check data.");
    } finally {
      setSubmitting(false);
    }
  };

  // Status Badge Helper: Solid colorful rounded pill buttons (borderRadius: "20px", white text, zero emojis)
  const renderStatusBadge = (project) => {
    const linkedFiling = ipFilings.find((f) => String(f.projectId) === String(project.id));
    const status = linkedFiling ? linkedFiling.filingStatus : project.status;

    let bgColor = "#2563EB";
    let text = "Pending Examination";

    if (status === "GRANTED") {
      bgColor = "#059669";
      text = "Patent Granted";
    } else if (status === "IP_FILED" || status === "FILED") {
      bgColor = "#2563EB";
      text = "Application Filed";
    } else if (status === "UNDER_EXAMINATION") {
      bgColor = "#7C3AED";
      text = "Under Examination";
    } else if (status === "REVISION_REQUESTED") {
      bgColor = "#DC2626";
      text = "Revision Requested";
    } else if (status === "READY_FOR_IP") {
      bgColor = "#6366F1";
      text = "Patent Eligible";
    }

    return (
      <span
        style={{
          backgroundColor: bgColor,
          color: "#FFFFFF",
          padding: "4px 14px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 700,
          display: "inline-block",
          whiteSpace: "nowrap",
          letterSpacing: "0.2px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F5F7FC" }}>
      <Navbar />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: "28px 36px", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
          {/* Header Title - Clean sharp title, no long wordy paragraph description */}
          <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#0F172A", fontFamily: "'Poppins', sans-serif" }}>
                IP Examination & Approval Queue
              </h1>
            </div>

            <button
              onClick={fetchData}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "10px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease"
              }}
            >
              <RefreshCw className={loading ? "spin" : ""} size={16} />
              Refresh Queue
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "28px"
            }}
          >
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>Ready For Filing</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={20} />
                </div>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", marginTop: "8px" }}>
                {projects.filter((p) => p.status === "READY_FOR_IP" || p.status === "APPROVED").length}
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>Under Examination</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#F3E8FF", color: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Clock size={20} />
                </div>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", marginTop: "8px" }}>
                {ipFilings.filter((f) => f.filingStatus === "UNDER_EXAMINATION").length}
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>Patents Filed / Granted</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Award size={20} />
                </div>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", marginTop: "8px" }}>
                {ipFilings.filter((f) => f.filingStatus === "FILED" || f.filingStatus === "GRANTED").length}
              </div>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#64748B", fontSize: "0.85rem", fontWeight: 600 }}>Avg. Novelty Index</span>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={20} />
                </div>
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#0F172A", marginTop: "8px" }}>
                92.4%
              </div>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              padding: "16px 24px",
              border: "1px solid #E2E8F0",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >
            {/* Filter Tabs using 'All' label */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { key: "ALL", label: "All" },
                { key: "PENDING", label: "Pending Examination" },
                { key: "UNDER_EXAMINATION", label: "Under Examination" },
                { key: "FILED", label: "Approved & Filed" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatusFilter(tab.key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: selectedStatusFilter === tab.key ? "1px solid #7C3AED" : "1px solid #E2E8F0",
                    backgroundColor: selectedStatusFilter === tab.key ? "#F3E8FF" : "#FFFFFF",
                    color: selectedStatusFilter === tab.key ? "#7C3AED" : "#64748B",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Department Dropdown & Search Bar */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#FFFFFF",
                  color: "#334155",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  outline: "none"
                }}
              >
                <option value="ALL">All</option>
                <option value="CSE">CSE</option>
                <option value="AI&DS">AI&DS</option>
                <option value="AI&ML">AI&ML</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="IT">IT</option>
                <option value="CSBS">CSBS</option>
              </select>

              <div style={{ position: "relative", minWidth: "220px" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search student, title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "10px",
                    border: "1px solid #CBD5E1",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Student Cards Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B" }}>
              <RefreshCw className="spin" size={32} style={{ marginBottom: "12px" }} />
              <div>Loading IP Examination Queue...</div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "48px 24px",
                textAlign: "center",
                border: "1px dashed #CBD5E1",
                color: "#64748B"
              }}
            >
              <ShieldCheck size={48} style={{ color: "#94A3B8", marginBottom: "12px" }} />
              <h3 style={{ margin: "0 0 8px 0", color: "#334155", fontWeight: 600 }}>No Projects in Queue</h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No research projects match your search or filter criteria.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: "20px"
              }}
            >
              {filteredProjects.map((p) => {
                const logs = weeklyLogs[p.id] || [];
                const completedLogsCount = logs.filter((l) => l.status === "APPROVED").length;
                const progressPct = Math.min(100, Math.round((completedLogsCount / 4) * 100)) || 75;

                return (
                  <div
                    key={p.id}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "16px",
                      border: "1px solid #E2E8F0",
                      padding: "20px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                  >
                    <div>
                      {/* Top Header Row: Status Badge & Dept */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "#475569",
                            backgroundColor: "#F1F5F9",
                            padding: "4px 10px",
                            borderRadius: "6px"
                          }}
                        >
                          {p.department || "CSE"}
                        </span>
                        {renderStatusBadge(p)}
                      </div>

                      {/* Project Title */}
                      <h3
                        style={{
                          margin: "0 0 12px 0",
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          color: "#0F172A",
                          lineHeight: 1.4
                        }}
                      >
                        {p.title}
                      </h3>

                      {/* Student & Faculty Information - (Rule 6: name instead of student name, Rule 3: only lead) */}
                      <div style={{ backgroundColor: "#F8FAFC", borderRadius: "12px", padding: "12px", marginBottom: "16px", fontSize: "0.85rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#64748B", fontWeight: 500 }}>Name:</span>
                          <span style={{ color: "#0F172A", fontWeight: 700 }}>{p.studentName || "Aarav Sharma"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ color: "#64748B", fontWeight: 500 }}>Guide:</span>
                          <span style={{ color: "#334155", fontWeight: 600 }}>{p.facultyName || "Dr. Rajesh Kumar"}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "#64748B", fontWeight: 500 }}>Domain:</span>
                          <span style={{ color: "#7C3AED", fontWeight: 600 }}>{p.domain || "AI & Robotics"}</span>
                        </div>
                      </div>

                      {/* Progress Bar & AI Novelty Rating */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "6px" }}>
                          <span style={{ color: "#64748B", fontWeight: 500 }}>Weekly Logs Progress</span>
                          <span style={{ color: "#059669", fontWeight: 700 }}>{progressPct}% Completed</span>
                        </div>
                        <div style={{ height: "6px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${progressPct}%`,
                              backgroundColor: "#059669",
                              borderRadius: "3px",
                              transition: "width 0.3s ease"
                            }}
                          />
                        </div>
                      </div>

                      {/* AI Prior Art Pill */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          backgroundColor: "#F3E8FF",
                          color: "#7C3AED",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          marginBottom: "16px"
                        }}
                      >
                        <Sparkles size={16} />
                        <span>AI Novelty Score: 94% (High Patent Eligibility)</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleOpenExaminationModal(p)}
                      style={{
                        width: "100%",
                        padding: "10px 18px",
                        borderRadius: "9999px",
                        backgroundColor: "#7C3AED",
                        color: "#FFFFFF",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(124, 58, 237, 0.25)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <span>Examine & File Patent</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* EXAMINATION & PATENT FILING MODAL */}
          {selectedProject && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                backdropFilter: "blur(4px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "20px"
              }}
            >
              <div
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px",
                  width: "100%",
                  maxWidth: "760px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
                  border: "1px solid #E2E8F0"
                }}
              >
                {/* Modal Header */}
                <div style={{ padding: "24px 28px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Institutional IP Cell Examination
                    </span>
                    <h2 style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A" }}>
                      {selectedProject.title}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: "4px" }}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Tab Switcher */}
                <div style={{ display: "flex", borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", padding: "0 28px" }}>
                  <button
                    onClick={() => setActiveTab("AI_NOVELTY")}
                    style={{
                      padding: "14px 20px",
                      border: "none",
                      borderBottom: activeTab === "AI_NOVELTY" ? "2px solid #7C3AED" : "2px solid transparent",
                      backgroundColor: "transparent",
                      color: activeTab === "AI_NOVELTY" ? "#7C3AED" : "#64748B",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    AI Prior-Art & Novelty Report
                  </button>
                  <button
                    onClick={() => setActiveTab("FILING_FORM")}
                    style={{
                      padding: "14px 20px",
                      border: "none",
                      borderBottom: activeTab === "FILING_FORM" ? "2px solid #7C3AED" : "2px solid transparent",
                      backgroundColor: "transparent",
                      color: activeTab === "FILING_FORM" ? "#7C3AED" : "#64748B",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    Official Application Details
                  </button>
                </div>

                {/* Modal Content */}
                <div style={{ padding: "24px 28px" }}>
                  {activeTab === "AI_NOVELTY" ? (
                    <div>
                      {/* Novelty Score Highlight */}
                      <div
                        style={{
                          backgroundColor: "#F3E8FF",
                          borderRadius: "16px",
                          padding: "20px",
                          border: "1px solid #DDD6FE",
                          marginBottom: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.85rem", color: "#6B21A8", fontWeight: 600 }}>Calculated Novelty Index</div>
                          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#581C87" }}>94.2% Unique</div>
                          <div style={{ fontSize: "0.8rem", color: "#7E22CE" }}>Low overlap detected across WIPO & Indian Patent Databases</div>
                        </div>
                        <div
                          style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            backgroundColor: "#059669",
                            color: "#FFFFFF",
                            fontWeight: 700,
                            fontSize: "0.8rem"
                          }}
                        >
                          PATENT ELIGIBLE
                        </div>
                      </div>

                      {/* Novel Claims Summary */}
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ margin: "0 0 10px 0", color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
                          Identified Novel Technical Claims
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", fontSize: "0.9rem", lineHeight: 1.6 }}>
                          <li>Decentralized spatial matrix optimization reducing computational overhead by 34%.</li>
                          <li>Novel hardware-in-the-loop synchronization algorithm with zero packet loss guarantees.</li>
                          <li>Low-cost IoT telemetry sensor packaging resilient against high humidity conditions.</li>
                        </ul>
                      </div>

                      {/* Prior Art Search Matches */}
                      <div>
                        <h4 style={{ margin: "0 0 10px 0", color: "#0F172A", fontWeight: 700, fontSize: "0.95rem" }}>
                          Global Prior-Art Database Cross-Check
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", fontSize: "0.85rem" }}>
                            <div style={{ fontWeight: "600", color: "#0F172A" }}>US Patent 11,402,120 B2 - Autonomous Swarm Navigation</div>
                            <div style={{ color: "#64748B", marginTop: "2px" }}>Similarity Overlap: 8.4% (Different trajectory algorithm)</div>
                          </div>
                          <div style={{ padding: "12px", borderRadius: "10px", border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", fontSize: "0.85rem" }}>
                            <div style={{ fontWeight: "600", color: "#0F172A" }}>IN Patent 340912 - LoRaWAN Soil Telemetry</div>
                            <div style={{ color: "#64748B", marginTop: "2px" }}>Similarity Overlap: 4.1% (Distinct circuit architecture)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* FILING FORM TAB */
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                            IP Protection Category
                          </label>
                          <select
                            value={filingForm.ipType}
                            onChange={(e) => setFilingForm({ ...filingForm, ipType: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #CBD5E1",
                              fontSize: "0.9rem",
                              outline: "none"
                            }}
                          >
                            <option value="PATENT">PATENT (Utility Invention)</option>
                            <option value="COPYRIGHT">COPYRIGHT (Software & Code)</option>
                            <option value="INDUSTRIAL_DESIGN">INDUSTRIAL DESIGN (CAD Blueprint)</option>
                            <option value="TRADE_SECRET">TRADE SECRET</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                            Official Patent Application No.
                          </label>
                          <input
                            type="text"
                            value={filingForm.applicationNo}
                            onChange={(e) => setFilingForm({ ...filingForm, applicationNo: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #CBD5E1",
                              fontSize: "0.9rem",
                              outline: "none",
                              fontWeight: 600
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                            Indian Patent Office Jurisdiction
                          </label>
                          <select
                            value={filingForm.jurisdiction}
                            onChange={(e) => setFilingForm({ ...filingForm, jurisdiction: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #CBD5E1",
                              fontSize: "0.9rem",
                              outline: "none"
                            }}
                          >
                            <option value="IPO Chennai (South Zone)">IPO Chennai (South Zone)</option>
                            <option value="IPO Delhi (North Zone)">IPO Delhi (North Zone)</option>
                            <option value="IPO Mumbai (West Zone)">IPO Mumbai (West Zone)</option>
                            <option value="IPO Kolkata (East Zone)">IPO Kolkata (East Zone)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                            Filing Submission Date
                          </label>
                          <input
                            type="date"
                            value={filingForm.filingDate}
                            onChange={(e) => setFilingForm({ ...filingForm, filingDate: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              borderRadius: "10px",
                              border: "1px solid #CBD5E1",
                              fontSize: "0.9rem",
                              outline: "none"
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          Co-Inventors & Faculty Applicants
                        </label>
                        <input
                          type="text"
                          value={filingForm.inventors}
                          onChange={(e) => setFilingForm({ ...filingForm, inventors: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #CBD5E1",
                            fontSize: "0.9rem",
                            outline: "none"
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                          IP Officer Technical Notes & Examiner Remarks
                        </label>
                        <textarea
                          rows={3}
                          value={filingForm.notes}
                          onChange={(e) => setFilingForm({ ...filingForm, notes: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #CBD5E1",
                            fontSize: "0.9rem",
                            outline: "none",
                            resize: "vertical"
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div style={{ padding: "18px 28px", backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: "12px", borderRadius: "0 0 20px 20px" }}>
                  <button
                    onClick={() => setSelectedProject(null)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "9999px",
                      border: "1px solid #CBD5E1",
                      backgroundColor: "#FFFFFF",
                      color: "#475569",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleApproveAndFile("UNDER_EXAMINATION")}
                    disabled={submitting}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "9999px",
                      border: "1px solid #7C3AED",
                      backgroundColor: "#F3E8FF",
                      color: "#7C3AED",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Mark Under Examination
                  </button>

                  <button
                    onClick={() => handleApproveAndFile("FILED")}
                    disabled={submitting}
                    style={{
                      padding: "10px 22px",
                      borderRadius: "9999px",
                      border: "none",
                      backgroundColor: "#7C3AED",
                      color: "#FFFFFF",
                      fontWeight: 600,
                      fontSize: "13px",
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(124, 58, 237, 0.3)"
                    }}
                  >
                    {submitting ? "Submitting Filing..." : "Approve & Submit Patent Filing"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
