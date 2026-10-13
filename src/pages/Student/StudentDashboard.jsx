import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MilestoneTimeline from "../../components/MilestoneTimeline";
import NewProjectModal from "./NewProjectModal";
import AiInsightsCard from "../../components/AiInsightsCard";
import PatentClaimsModal from "../../components/PatentClaimsModal";
import { Plus, FileText, Download, Clock, CheckCircle2, AlertCircle, ShieldCheck, MessageSquare, Sparkles, Award } from "lucide-react";
import axios from "axios";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [patentStudioProject, setPatentStudioProject] = useState(null);

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
      REVISION_REQUESTED: { bg: "#DC2626", text: "Revision Requested" },
      APPROVED: { bg: "#059669", text: "Approved" },
      READY_FOR_IP: { bg: "#6366F1", text: "Patent Eligible" },
      IP_FILED: { bg: "#7C3AED", text: "Patent Filed" },
      REJECTED: { bg: "#DC2626", text: "Rejected" },
    };
    const b = badges[s] || badges.SUBMITTED;
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
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {b.text}
      </span>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7FC", display: "flex", flexDirection: "column", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, padding: "28px 36px", minWidth: 0 }}>
          {/* Top Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.5px" }}>
                Student Research Workspace
              </h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                backgroundColor: "#7C3AED",
                color: "#FFFFFF",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
              }}
            >
              <Plus size={16} /> Submit Research Proposal
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
                    <AiInsightsCard
                      project={selectedProject}
                      onProjectUpdated={(updated) => {
                        setSelectedProject(updated);
                        setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
                      }}
                      onOpenPatentStudio={(p) => setPatentStudioProject(p)}
                    />

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

      {patentStudioProject && (
        <PatentClaimsModal
          project={patentStudioProject}
          onClose={() => setPatentStudioProject(null)}
        />
      )}
    </div>
  );
}
