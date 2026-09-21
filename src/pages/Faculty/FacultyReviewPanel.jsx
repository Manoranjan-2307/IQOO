import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import { Search, Filter, Download, CheckCircle, AlertTriangle, ShieldCheck, XCircle, Sparkles } from "lucide-react";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";

const getShortDept = (dept) => {
  if (!dept) return "";
  const map = {
    "Computer Science & Engineering": "CSE",
    "Computer Science and Engineering": "CSE",
    "Artificial Intelligence & Data Science": "AI&DS",
    "AI & Data Science": "AI&DS",
    "Artificial Intelligence & Machine Learning": "AI&ML",
    "AI & Machine Learning": "AI&ML",
    "Electronics & Communication Engineering": "ECE",
    "Electronics and Communication Engineering": "ECE",
    "Electrical & Electronics Engineering": "EEE",
    "Electrical & Electronics": "EEE",
    "Information Technology": "IT",
    "Mechanical Engineering": "ME",
  };
  return map[dept] || dept;
};

const getStatusBadge = (status) => {
  const s = (status || "").toUpperCase();
  const map = {
    SUBMITTED: { bg: "#0D9488", label: "Submitted" },
    UNDER_REVIEW: { bg: "#D97706", label: "In Evaluation" },
    REVISION_REQUESTED: { bg: "#DC2626", label: "Revision Requested" },
    APPROVED: { bg: "#059669", label: "Approved" },
    READY_FOR_IP: { bg: "#6366F1", label: "Patent Eligible" },
    IP_FILED: { bg: "#2563EB", label: "Filed" },
    REJECTED: { bg: "#DC2626", label: "Rejected" },
  };
  const b = map[s] || map.SUBMITTED;
  return (
    <span
      style={{
        backgroundColor: b.bg,
        color: "#FFFFFF",
        padding: "4px 14px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 700,
        display: "inline-block",
        letterSpacing: "0.2px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        whiteSpace: "nowrap",
      }}
    >
      {b.label}
    </span>
  );
};

export default function FacultyReviewPanel() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsLog, setReviewsLog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchFacultyProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects?role=FACULTY&userId=${user.id}`);
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (e) {
      console.error("Error loading faculty evaluation list:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectReviews = async (projectId) => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/reviews`);
      setReviewsLog(res.data);
    } catch (e) {
      console.error("Error fetching reviews log:", e);
    }
  };

  useEffect(() => {
    if (user) fetchFacultyProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectReviews(selectedProject.id);
    }
  }, [selectedProject]);

  const handleReviewAction = async (statusChange) => {
    if (!feedbackText && statusChange === "REVISION_REQUESTED") {
      alert("Please provide feedback notes detailing required revisions.");
      return;
    }

    try {
      setSubmittingReview(true);
      await axios.post("/api/reviews", {
        projectId: selectedProject.id,
        facultyId: user.id,
        statusChange,
        feedbackText: feedbackText || `Project status updated to ${statusChange}`,
      });

      setFeedbackText("");
      await fetchFacultyProjects();
      if (selectedProject) {
        setSelectedProject({ ...selectedProject, status: statusChange });
        fetchProjectReviews(selectedProject.id);
      }
    } catch (e) {
      alert("Failed to record review decision.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.studentName && p.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Clear / exclude IP_FILED projects from pending review queue when ALL is selected
    const isNotFiled = statusFilter === "ALL" ? p.status !== "IP_FILED" : true;
    const matchesStatus = statusFilter === "ALL" ? isNotFiled : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F6F9FC", display: "flex", flexDirection: "column", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#1F2937" }}>
              Faculty Proposal Review Panel
            </h2>
          </div>

          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={18} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by proposal title or student name..."
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 40px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#1F2937",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={18} color="#64748B" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: "10px 14px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#1F2937",
                  fontSize: "14px",
                }}
              >
                <option value="ALL">All</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">In Evaluation</option>
                <option value="REVISION_REQUESTED">Revision Needed</option>
                <option value="APPROVED">Proposal Approved</option>
                <option value="READY_FOR_IP">Patent Eligible</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #D9E2EC", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#1F2937" }}>
                Pending Proposals ({filteredProjects.length})
              </h3>
              {loading ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#64748B" }}>Loading proposals...</div>
              ) : filteredProjects.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>
                  No research proposals matching criteria.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProject(p)}
                      style={{
                        padding: "16px",
                        borderRadius: "10px",
                        border: selectedProject?.id === p.id ? "2px solid #4B5D8C" : "1px solid #D9E2EC",
                        backgroundColor: selectedProject?.id === p.id ? "#E8EDF7" : "#FFFFFF",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>
                          {p.studentName || p.student_name || "Student Researcher"}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", backgroundColor: "#EEF4F8", padding: "2px 8px", borderRadius: "4px" }}>
                          {getShortDept(p.department)}
                        </span>
                      </div>
                      <h4 style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 700, color: "#1F2937" }}>
                        {p.title}
                      </h4>
                      <div style={{ marginTop: "4px" }}>{getStatusBadge(p.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #D9E2EC", padding: "24px" }}>
              {selectedProject ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#4B5D8C" }}>
                        {selectedProject.domain}
                      </span>
                      <h3 style={{ margin: "4px 0 2px 0", fontSize: "18px", fontWeight: 800, color: "#1F2937" }}>
                        {selectedProject.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        Lead: <strong>{selectedProject.studentName || selectedProject.student_name || "Unknown"}</strong> • <span style={{ fontWeight: 700, color: "#4B5D8C", backgroundColor: "#E8EDF7", padding: "2px 6px", borderRadius: "4px" }}>{getShortDept(selectedProject.department)}</span>
                      </span>
                    </div>
                  </div>

                  <MilestoneTimeline status={selectedProject.status} />

                  <div style={{ backgroundColor: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #D9E2EC", marginBottom: "20px" }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 700, color: "#1F2937" }}>
                      Abstract &amp; Novelty Claims
                    </h4>
                    <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 12px 0", lineHeight: 1.5 }}>
                      {selectedProject.abstractText || selectedProject.abstract_text || "No abstract provided."}
                    </p>

                    {/* AI Insights Card */}
                    {selectedProject.summary && (
                      <div
                        style={{
                          border: "1px solid #D9E2EC",
                          boxShadow: "0 2px 8px rgba(75, 93, 140, 0.08)",
                          backgroundColor: "#E8EDF7",
                          borderRadius: "8px",
                          padding: "16px",
                          marginBottom: "12px",
                          position: "relative"
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            color: "#4B5D8C",
                            backgroundColor: "#FFFFFF",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            border: "1px solid #D9E2EC"
                          }}
                        >
                          ✨ AI Generated
                        </span>
                        <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 700, color: "#4B5D8C", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Sparkles size={16} color="#4B5D8C" /> AI Insights
                        </h4>
                        <p style={{ fontSize: "13px", color: "#1F2937", lineHeight: 1.5, margin: 0 }}>
                          {selectedProject.summary}
                        </p>
                      </div>
                    )}
                    <a
                      href={(() => {
                        const url = selectedProject.fileUrl || "/uploads/default_abstract.pdf";
                        return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || ""}${url}`;
                      })()}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#4B5D8C", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}
                    >
                      <Download size={15} /> View Full PDF Proposal
                    </a>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#1F2937", marginBottom: "8px" }}>
                      Input Constructive Evaluation Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Specify revision requirements or recommendations for patent/copyright filing..."
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        backgroundColor: "#F8FAFC",
                        color: "#1F2937",
                        fontSize: "13px",
                        boxSizing: "border-box",
                        resize: "vertical",
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "24px" }}>
                    <button
                      onClick={() => handleReviewAction("APPROVED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "9999px",
                        backgroundColor: "#008000",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(0, 128, 0, 0.2)",
                      }}
                    >
                      <CheckCircle size={16} /> Approve Proposal
                    </button>

                    <button
                      onClick={() => handleReviewAction("READY_FOR_IP")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "9999px",
                        backgroundColor: "#4F46E5",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
                      }}
                    >
                      <ShieldCheck size={16} /> Mark Ready for IP Filing
                    </button>

                    <button
                      onClick={() => handleReviewAction("REVISION_REQUESTED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "9999px",
                        backgroundColor: "#EA580C",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(234, 88, 12, 0.2)",
                      }}
                    >
                      <AlertTriangle size={16} /> Request Revisions
                    </button>

                    <button
                      onClick={() => handleReviewAction("REJECTED")}
                      disabled={submittingReview}
                      style={{
                        padding: "10px 18px",
                        borderRadius: "9999px",
                        backgroundColor: "#FF4D4D",
                        color: "#FFFFFF",
                        fontWeight: 600,
                        fontSize: "13px",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(255, 77, 77, 0.2)",
                      }}
                    >
                      <XCircle size={16} /> Reject Proposal
                    </button>
                  </div>

                  {reviewsLog.length > 0 && (
                    <div style={{ borderTop: "1px solid #D9E2EC", paddingTop: "16px" }}>
                      <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: 700, color: "#1F2937" }}>
                        Evaluation History &amp; Feedback Logs
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {reviewsLog.map((rev) => (
                          <div key={rev.id} style={{ backgroundColor: "#F8FAFC", border: "1px solid #D9E2EC", padding: "10px 12px", borderRadius: "6px", fontSize: "12px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", marginBottom: "4px" }}>
                              <strong style={{ color: "#1F2937" }}>{rev.facultyName || rev.faculty_name || "Faculty Mentor"}</strong>
                              <span>{formatDate(rev.reviewedAt || rev.reviewed_at)}</span>
                            </div>
                            <div style={{ color: "#1F2937" }}>{rev.feedbackText || rev.feedback_text || "No feedback"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8" }}>
                  Select a proposal from the left list to review document and enter feedback decision.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
