import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import NewProjectModal from "./NewProjectModal";
import { Plus, FileText, Download, Clock, CheckCircle2, AlertCircle, ShieldCheck, MessageSquare, Sparkles } from "lucide-react";
import axios from "axios";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviews, setReviews] = useState([]);

  const fetchStudentProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/projects?role=STUDENT&userId=${user.id}`);
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectReviews = async (projectId) => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/reviews`);
      setReviews(res.data);
    } catch (e) {
      console.error("Error fetching reviews:", e);
    }
  };

  useEffect(() => {
    if (user) fetchStudentProjects();
  }, [user]);

  useEffect(() => {
    if (selectedProject?.id) {
      fetchProjectReviews(selectedProject.id);
    }
  }, [selectedProject]);

  const getStatusBadge = (status) => {
    const s = (status || "").toUpperCase();
    const badges = {
      SUBMITTED: { bg: "#2563EB", text: "Submitted" },
      UNDER_REVIEW: { bg: "#D97706", text: "In Evaluation" },
      REVISION_REQUESTED: { bg: "#EA580C", text: "Revision Needed" },
      APPROVED: { bg: "#008000", text: "Approved" },
      READY_FOR_IP: { bg: "#4F46E5", text: "Patent Eligible" },
      IP_FILED: { bg: "#0284C7", text: "Patent Filed" },
      REJECTED: { bg: "#FF4D4D", text: "Rejected" },
    };
    const b = badges[s] || badges.SUBMITTED;
    return (
      <span
        style={{
          backgroundColor: b.bg,
          color: "#FFFFFF",
          padding: "5px 18px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: 600,
          display: "inline-block",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
        }}
      >
        {b.text}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F6F9FC", display: "flex", flexDirection: "column", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "24px 28px", minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.5px" }}>
                Student Research Workspace
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#4B5D8C",
                color: "#FFFFFF",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(75, 93, 140, 0.2)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3F507A")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4B5D8C")}
            >
              <Plus size={18} />
              Submit Proposal
            </button>
          </div>

          {/* Metrics summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #D9E2EC" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Total Proposals</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#1F2937", marginTop: "4px" }}>{projects.length}</div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #D9E2EC" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Under Review</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#D97706", marginTop: "4px" }}>
                {projects.filter((p) => ["SUBMITTED", "UNDER_REVIEW", "REVISION_REQUESTED"].includes(p.status)).length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #D9E2EC" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>Approved Proposals</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#008000", marginTop: "4px" }}>
                {projects.filter((p) => ["APPROVED", "READY_FOR_IP", "IP_FILED"].includes(p.status)).length}
              </div>
            </div>
            <div style={{ backgroundColor: "#FFFFFF", padding: "18px 20px", borderRadius: "12px", border: "1px solid #D9E2EC" }}>
              <div style={{ fontSize: "12px", color: "#64748B", fontWeight: 600 }}>IP Eligible / Filed</div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#4B5D8C", marginTop: "4px" }}>
                {projects.filter((p) => ["READY_FOR_IP", "IP_FILED"].includes(p.status)).length}
              </div>
            </div>
          </div>

          {/* Projects Table & Detailed Card */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr", gap: "24px" }}>
            {/* Project List */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #D9E2EC", padding: "20px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: 700, color: "#1F2937" }}>
                My Research Initiatives ({projects.length})
              </h3>
              {loading ? (
                <div style={{ padding: "30px", textAlign: "center", color: "#64748B" }}>Loading research proposals...</div>
              ) : projects.length === 0 ? (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#64748B" }}>
                  No research projects submitted yet. Click "Submit Proposal" above to start.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {projects.map((proj) => {
                    const isSelected = selectedProject?.id === proj.id;
                    const abstract = proj.abstractText || "No abstract available";
                    const mentor = proj.facultyName || "Assigned Mentor";

                    return (
                      <div
                        key={proj.id}
                        onClick={() => setSelectedProject(proj)}
                        style={{
                          padding: "16px",
                          borderRadius: "10px",
                          border: isSelected ? "2px solid #4B5D8C" : "1px solid #D9E2EC",
                          backgroundColor: isSelected ? "#E8EDF7" : "#FFFFFF",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#1F2937", flex: 1, paddingRight: "10px" }}>
                            {proj.title}
                          </h4>
                          {getStatusBadge(proj.status)}
                        </div>
                        <p style={{ margin: "0 0 10px 0", fontSize: "12px", color: "#64748B", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>
                          {abstract}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94A3B8" }}>
                          <span>Domain: {proj.domain || "N/A"}</span>
                          <span>Mentor: {mentor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Project Milestone & Details Panel */}
            <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #D9E2EC", padding: "24px" }}>
              {selectedProject ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#4B5D8C", textTransform: "uppercase" }}>
                        {selectedProject.domain || "Research Domain"}
                      </span>
                      <h3 style={{ margin: "4px 0", fontSize: "17px", fontWeight: 800, color: "#1F2937" }}>
                        {selectedProject.title}
                      </h3>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>
                        Current Milestone: <strong>{selectedProject.currentMilestone || "Proposal Evaluation"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual Milestone Stepper */}
                  <div style={{ marginTop: "16px", marginBottom: "20px" }}>
                    <MilestoneTimeline status={selectedProject.status} />
                  </div>

                  <div style={{ borderTop: "1px solid #D9E2EC", paddingTop: "16px" }}>
                    <h4 style={{ margin: "0 0 6px 0", fontSize: "13px", fontWeight: 700, color: "#1F2937" }}>
                      Abstract Summary
                    </h4>
                    <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                      {selectedProject.abstractText || selectedProject.abstract_text || "No abstract available"}
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
                          marginBottom: "16px",
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

                    <h4 style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: 700, color: "#1F2937" }}>
                      Proposal Documents &amp; Attachments
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #D9E2EC", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <FileText size={18} color="#4B5D8C" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#1F2937" }}>
                          {selectedProject.fileName || selectedProject.file_name || "Proposal_Abstract.pdf"}
                        </span>
                      </div>
                      <a
                        href={(() => {
                          const url = selectedProject.fileUrl || "/uploads/default_abstract.pdf";
                          return url.startsWith("http") ? url : `${import.meta.env.VITE_API_URL || ""}${url}`;
                        })()}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4B5D8C", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
                      >
                        <Download size={14} /> Download File
                      </a>
                    </div>

                    {/* Centralized Faculty Feedback Log */}
                    <div style={{ borderTop: "1px solid #D9E2EC", paddingTop: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <MessageSquare size={16} color="#4B5D8C" />
                        <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1F2937" }}>
                          Mentor Feedback &amp; Review History
                        </h4>
                      </div>

                      {reviews.length === 0 ? (
                        <div style={{ padding: "12px", backgroundColor: "#F8FAFC", borderRadius: "8px", fontSize: "12px", color: "#64748B", textAlign: "center", border: "1px solid #D9E2EC" }}>
                          No mentor evaluations submitted yet. Your assigned faculty reviewer will provide feedback shortly.
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {reviews.map((rev) => (
                            <div
                              key={rev.id}
                              style={{
                                padding: "12px",
                                backgroundColor: "#F8FAFC",
                                borderRadius: "8px",
                                border: "1px solid #D9E2EC",
                                borderLeft: `4px solid ${rev.statusChange === "APPROVED" || rev.statusChange === "READY_FOR_IP" ? "#008000" : "#D97706"}`,
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: "#1F2937" }}>
                                  {rev.facultyName || rev.faculty_name || "Faculty Mentor"}
                                </span>
                                <span style={{ fontSize: "11px", fontWeight: 600, color: rev.statusChange === "APPROVED" ? "#008000" : "#4B5D8C" }}>
                                  {rev.statusChange}
                                </span>
                              </div>
                              <p style={{ margin: 0, fontSize: "12px", color: "#64748B", lineHeight: 1.4 }}>
                                "{rev.feedbackText || rev.feedback_text || "No feedback provided."}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "60px 20px", textAlign: "center", color: "#94A3B8" }}>
                  Select a research initiative from the list to view its milestone timeline, documents, and mentor feedback.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchStudentProjects}
        studentId={user.id}
        studentDepartment={user.department}
      />
    </div>
  );
}
