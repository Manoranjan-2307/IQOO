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
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar activeTab="catalogue" />

        <main style={{ flex: 1, padding: "20px 32px", width: "100%", boxSizing: "border-box" }}>
          {/* Header Title (Clean) */}
          <div style={{ marginBottom: "16px" }}>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#1E293B", margin: 0 }}>
              S5 Project Catalogue
            </h1>
          </div>

          {/* S5 PDF Download Card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: "14px 20px",
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileText size={22} color="#2563EB" />
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
                padding: "8px 16px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Download size={15} /> Download PDF
            </a>
          </div>

          {/* Student's Current Confirmed Selection Banner */}
          {mySelection && (
            <div
              style={{
                width: "100%",
                backgroundColor: "#F0FDF4",
                border: "1px solid #86EFAC",
                borderRadius: "10px",
                padding: "12px 20px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxSizing: "border-box",
              }}
            >
              <CheckCircle size={20} color="#166534" />
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#15803D" }}>
                Confirmed: [{mySelection.catalogueItem?.code}] {mySelection.catalogueItem?.title} ({mySelection.catalogueItem?.domain})
                {mySelection.faculty ? ` — Mentor: ${mySelection.faculty.fullName}` : ""}
              </div>
            </div>
          )}

          {/* Domain Filter Pills & Search Bar */}
          <div style={{ width: "100%", backgroundColor: "#FFFFFF", padding: "14px 20px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "16px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                <Filter size={15} color="#455A64" /> Domain Filters:
              </div>

              <div style={{ position: "relative", minWidth: "260px" }}>
                <Search size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "9px" }} />
                <input
                  type="text"
                  placeholder="Search title, tech stack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "7px 10px 7px 32px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "12px",
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
                      padding: "5px 12px",
                      borderRadius: "16px",
                      border: isActive ? "1px solid #2563EB" : "1px solid #CBD5E1",
                      backgroundColor: isActive ? "#2563EB" : "#F8FAFC",
                      color: isActive ? "#FFFFFF" : "#475569",
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
          <div style={{ width: "100%", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", boxSizing: "border-box" }}>
            {loading ? (
              <div style={{ padding: "20px", color: "#64748B", fontSize: "13px" }}>Loading catalogue items...</div>
            ) : filteredProjects.length === 0 ? (
              <div style={{ padding: "28px", textAlign: "center", color: "#64748B", fontSize: "13px" }}>
                No project topics found matching the selected domain filter.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F1F5F9", borderBottom: "2px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "80px" }}>Code</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>Project Title & Description</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "140px" }}>Domain</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "180px" }}>Tech Stack</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "140px" }}>Student Quota</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, width: "120px", textAlign: "center" }}>Action</th>
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
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "#2563EB", borderRight: "1px solid #E2E8F0", verticalAlign: "middle" }}>
                            {p.code}
                          </td>
                          <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0", verticalAlign: "middle" }}>
                            <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "13px", marginBottom: "3px" }}>{p.title}</div>
                            <div style={{ color: "#64748B", fontSize: "11px", lineHeight: 1.4 }}>{p.description}</div>
                          </td>
                          {/* Clean Aligned Domain Badge */}
                          <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0", verticalAlign: "middle" }}>
                            <span
                              style={{
                                display: "inline-block",
                                backgroundColor: "#EFF6FF",
                                color: "#1D4ED8",
                                fontSize: "11px",
                                fontWeight: 700,
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid #DBEAFE",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {p.domain}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "#059669", fontWeight: 600, borderRight: "1px solid #E2E8F0", fontSize: "11px", verticalAlign: "middle" }}>
                            {p.techStack}
                          </td>
                          {/* Clean Minimalist Progress Bar + 0/2 or 1/2 */}
                          <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0", verticalAlign: "middle" }}>
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
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569", minWidth: "24px" }}>
                                {selected}/{max}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center", verticalAlign: "middle" }}>
                            {isSelectedByMe ? (
                              <span style={{ fontSize: "11px", fontWeight: 700, color: "#059669", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <CheckCircle size={14} /> Selected
                              </span>
                            ) : mySelection ? (
                              <span style={{ fontSize: "11px", color: "#94A3B8" }}>Locked</span>
                            ) : isFull ? (
                              <span style={{ fontSize: "11px", color: "#DC2626", fontWeight: 600 }}>Full</span>
                            ) : (
                              <button
                                onClick={() => handleSelectProject(p.id)}
                                disabled={submittingId === p.id}
                                style={{
                                  backgroundColor: "#2563EB",
                                  color: "#FFFFFF",
                                  border: "none",
                                  padding: "6px 14px",
                                  borderRadius: "6px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  cursor: "pointer",
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
