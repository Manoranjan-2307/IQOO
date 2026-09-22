import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { FileText, Download, CheckCircle, Filter, Search } from "lucide-react";
import axios from "axios";

const DOMAINS = [
  "ALL",
  "Full-Stack",
  "CV",
  "Gen-AI",
  "Machine Learning",
  "IoT & Embedded",
  "Cybersecurity",
  "Cloud & DevOps",
];

export default function ProjectCatalogueSelection() {
  const { user } = useAuth();
  const [catalogue, setCatalogue] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mySelection, setMySelection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    fetchCatalogueAndSelection();
  }, [user]);

  const fetchCatalogueAndSelection = async () => {
    try {
      setLoading(true);
      const [resCat, resSel] = await Promise.all([
        axios.get("/api/project-catalogue"),
        user?.id ? axios.get(`/api/project-catalogue/selections/student?studentId=${user.id}`).catch(() => ({ data: null })) : { data: null },
      ]);

      setCatalogue(resCat.data || []);
      setMySelection(resSel.data || null);
    } catch (err) {
      console.error("Failed to fetch S5 project catalogue", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProject = async (catalogueId) => {
    if (!user?.id) return;
    setSubmittingId(catalogueId);
    try {
      await axios.post("/api/project-catalogue/selections", {
        studentId: user.id,
        catalogueId: catalogueId,
      });

      fetchCatalogueAndSelection();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to select project topic.");
    } finally {
      setSubmittingId(null);
    }
  };

  const filteredProjects = catalogue.filter((item) => {
    const matchesDomain = selectedDomain === "ALL" || item.domain?.toLowerCase() === selectedDomain.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.techStack.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7FC", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar activeTab="catalogue" />

        <main style={{ flex: 1, padding: "28px 36px", width: "100%", boxSizing: "border-box" }}>
          {/* Header Title (Clean) */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              S5 Project Catalogue
            </h1>
          </div>

          {/* S5 PDF Download Card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "16px",
              padding: "16px 24px",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileText size={24} color="#2563EB" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#1E40AF" }}>
                Official S5 Capstone Project Catalogue PDF
              </span>
            </div>

            <a
              href="/uploads/S5_Project_Catalogue_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#2563EB",
                color: "#FFFFFF",
                padding: "10px 18px",
                borderRadius: "12px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)"
              }}
            >
              <Download size={16} /> Download PDF
            </a>
          </div>

          {/* Student's Current Confirmed Selection Banner */}
          {mySelection && (
            <div
              style={{
                width: "100%",
                backgroundColor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                borderRadius: "16px",
                padding: "14px 24px",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                boxSizing: "border-box",
              }}
            >
              <CheckCircle size={22} color="#059669" />
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#065F46" }}>
                Confirmed: [{mySelection.catalogueItem?.code}] {mySelection.catalogueItem?.title} ({mySelection.catalogueItem?.domain})
                {mySelection.faculty ? ` — Mentor: ${mySelection.faculty.fullName}` : ""}
              </div>
            </div>
          )}

          {/* Domain Filter Pills & Search Bar */}
          <div style={{ width: "100%", backgroundColor: "#FFFFFF", padding: "18px 24px", borderRadius: "16px", border: "1px solid #E2E8F0", marginBottom: "20px", boxSizing: "border-box", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>
                <Filter size={16} color="#7C3AED" /> Domain Filters:
              </div>

              <div style={{ position: "relative", minWidth: "280px" }}>
                <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "10px" }} />
                <input
                  type="text"
                  placeholder="Search title, tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px 8px 36px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#F8FAFC",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {DOMAINS.map((domain) => {
                const isActive = selectedDomain.toLowerCase() === domain.toLowerCase();
                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      border: isActive ? "1px solid #7C3AED" : "1px solid #E2E8F0",
                      backgroundColor: isActive ? "#F3E8FF" : "#FFFFFF",
                      color: isActive ? "#7C3AED" : "#64748B",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {domain === "ALL" ? "All Domains" : domain}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full-Width Gridline Table */}
          <div style={{ width: "100%", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", overflow: "hidden", boxSizing: "border-box", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            {loading ? (
              <div style={{ padding: "28px", color: "#64748B", fontSize: "14px", textAlign: "center" }}>Loading catalogue items...</div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ padding: "36px", textAlign: "center", color: "#64748B", fontSize: "14px" }}>
                No project topics found matching the selected domain filter.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700, width: "90px" }}>Code</th>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700 }}>Project Title & Description</th>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700, width: "150px" }}>Domain</th>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700, width: "190px" }}>Tech Stack</th>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700, width: "150px" }}>Quota</th>
                      <th style={{ padding: "14px 18px", color: "#64748B", fontWeight: 700, width: "130px", textAlign: "center" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => {
                      const selected = p.selectedCount || 0;
                      const max = p.maxStudents || 2;
                      const percent = Math.min(100, Math.round((selected / max) * 100));
                      const isFull = selected >= max;
                      const isSelectedByMe = mySelection?.catalogueItem?.id === p.id;

                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: "1px solid #E2E8F0",
                            backgroundColor: isSelectedByMe ? "#ECFDF5" : "transparent",
                          }}
                        >
                          <td style={{ padding: "14px 18px", fontWeight: 700, color: "#7C3AED", verticalAlign: "middle" }}>
                            {p.code}
                          </td>
                          <td style={{ padding: "14px 18px", verticalAlign: "middle" }}>
                            <div style={{ fontWeight: 700, color: "#0F172A", fontSize: "14px", marginBottom: "4px" }}>{p.title}</div>
                            <div style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.5 }}>{p.description}</div>
                          </td>
                          <td style={{ padding: "14px 18px", verticalAlign: "middle" }}>
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#F3E8FF",
                                color: "#7C3AED",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "4px 12px",
                                borderRadius: "20px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.domain}
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px", color: "#059669", fontWeight: 600, fontSize: "12px", verticalAlign: "middle" }}>
                            {p.techStack}
                          </td>
                          <td style={{ padding: "14px 18px", verticalAlign: "middle" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ flex: 1, height: "8px", backgroundColor: "#E2E8F0", borderRadius: "4px", overflow: "hidden" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${percent}%`,
                                    backgroundColor: isFull ? "#DC2626" : selected > 0 ? "#D97706" : "#059669",
                                    transition: "width 0.3s ease",
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", minWidth: "28px" }}>
                                {selected}/{max}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "center", verticalAlign: "middle" }}>
                            {isSelectedByMe ? (
                              <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <CheckCircle size={15} /> Selected
                              </span>
                            ) : mySelection ? (
                              <span style={{ fontSize: "12px", color: "#94A3B8" }}>Locked</span>
                            ) : isFull ? (
                              <span style={{ fontSize: "12px", color: "#DC2626", fontWeight: 600 }}>Full</span>
                            ) : (
                              <button
                                onClick={() => handleSelectProject(p.id)}
                                disabled={submittingId === p.id}
                                style={{
                                  backgroundColor: "#7C3AED",
                                  color: "#FFFFFF",
                                  border: "none",
                                  padding: "8px 16px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                  boxShadow: "0 2px 6px rgba(124, 58, 237, 0.25)"
                                }}
                              >
                                {submittingId === p.id ? "Selecting..." : "Select Topic"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
