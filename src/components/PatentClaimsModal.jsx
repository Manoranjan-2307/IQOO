import React, { useState, useEffect } from "react";
import {
  X,
  FileCheck,
  ShieldAlert,
  Sparkles,
  Copy,
  Printer,
  ExternalLink,
  ChevronRight,
  Award,
  Layers,
  BookOpen,
  Check,
  RefreshCw,
  Sliders
} from "lucide-react";
import axios from "axios";

export default function PatentClaimsModal({ filing, project, onClose }) {
  const [activeTab, setActiveTab] = useState("CLAIMS");
  const [loading, setLoading] = useState(true);
  const [claimsData, setClaimsData] = useState(null);
  const [error, setError] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError(null);
      let res;
      if (filing && filing.id) {
        res = await axios.post(`/api/ip-filings/${filing.id}/generate-claims`);
      } else if (project && project.id) {
        res = await axios.post(`/api/ip-filings/project/${project.id}/generate-claims`);
      } else {
        res = await axios.post("/api/ip-filings/draft-claims", {
          title: "Intelligent Systems Innovation",
          domain: "Artificial Intelligence",
          abstractText: "Automated distributed computing architecture."
        });
      }

      if (res.data && res.data.claims) {
        setClaimsData(res.data.claims);
      } else if (res.data) {
        setClaimsData(res.data);
      }
    } catch (err) {
      console.error("Failed to generate patent claims:", err);
      setError("Unable to synthesize patent claims: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [filing?.id, project?.id]);

  const handleCopyText = (text, sectionKey) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const title = claimsData?.title || filing?.projectTitle || project?.title || "Campus Research Innovation";
  const appNo = claimsData?.applicationNo || filing?.applicationNo || "IN-PENDING";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: "16px",
      }}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          animation: "fadeIn 0.25s ease-out",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
            color: "#FFFFFF",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  backgroundColor: "rgba(124, 58, 237, 0.35)",
                  color: "#DDD6FE",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid rgba(196, 181, 253, 0.3)",
                }}
              >
                <Sparkles size={12} /> AI Patent Claims &amp; Prior-Art Radar
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#93C5FD",
                  backgroundColor: "rgba(30, 58, 138, 0.5)",
                  padding: "3px 8px",
                  borderRadius: "6px",
                }}
              >
                App #: {appNo}
              </span>
            </div>
            <h2 style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF" }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: "#FFFFFF",
              padding: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigator */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            padding: "0 24px",
            gap: "8px",
          }}
        >
          {[
            { id: "CLAIMS", label: "Formal Patent Claims", icon: FileCheck },
            { id: "RADAR", label: "Prior-Art Collision Radar", icon: ShieldAlert },
            { id: "DOSSIER", label: "Official IPO Form 2 Dossier", icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "14px 16px",
                  border: "none",
                  borderBottom: active ? "3px solid #6366F1" : "3px solid transparent",
                  backgroundColor: "transparent",
                  color: active ? "#4338CA" : "#64748B",
                  fontWeight: active ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                <Icon size={16} color={active ? "#4338CA" : "#64748B"} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px", backgroundColor: "#FFFFFF" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#64748B" }}>
              <RefreshCw className="spin" size={36} style={{ color: "#6366F1", marginBottom: "14px" }} />
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#1E293B" }}>
                Synthesizing Formal Patent Claims &amp; Prior-Art Radar...
              </div>
              <div style={{ fontSize: "13px", color: "#64748B", marginTop: "4px" }}>
                Analyzing technical disclosures against global patent registries (IPO, USPTO, EPO)
              </div>
            </div>
          ) : error ? (
            <div
              style={{
                backgroundColor: "#FEF2F2",
                border: "1px solid #FCA5A5",
                borderRadius: "12px",
                padding: "18px",
                color: "#991B1B",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <ShieldAlert size={24} />
              <div>
                <div style={{ fontWeight: 700 }}>Synthesis Failed</div>
                <div style={{ fontSize: "13px" }}>{error}</div>
              </div>
            </div>
          ) : claimsData ? (
            <>
              {/* Top Analytical Bar */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#EEF2FF",
                    border: "1px solid #C7D2FE",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#4338CA", textTransform: "uppercase" }}>
                    Novelty Index
                  </div>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#312E81", marginTop: "2px" }}>
                    {claimsData.noveltyScore}% Unique
                  </div>
                  <div style={{ fontSize: "11px", color: "#4338CA" }}>High Patent Grant Probability</div>
                </div>

                <div
                  style={{
                    backgroundColor: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#15803D", textTransform: "uppercase" }}>
                    Commercial Readiness
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#166534", marginTop: "4px" }}>
                    {claimsData.commercialReadinessTrl}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#FAF5FF",
                    border: "1px solid #E9D5FF",
                    borderRadius: "12px",
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#7E22CE", textTransform: "uppercase" }}>
                    IPC Classification
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#581C87", marginTop: "4px" }}>
                    {claimsData.ipcClassification}
                  </div>
                </div>
              </div>

              {/* TAB 1: FORMAL CLAIMS */}
              {activeTab === "CLAIMS" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {/* Field of Invention */}
                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "#F8FAFC",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                        Field of Invention
                      </span>
                      <button
                        onClick={() => handleCopyText(claimsData.fieldOfInvention, "field")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {copiedSection === "field" ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                        {copiedSection === "field" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, color: "#1E293B" }}>
                      {claimsData.fieldOfInvention}
                    </p>
                  </div>

                  {/* Independent Claim 1 */}
                  <div
                    style={{
                      border: "1px solid #C7D2FE",
                      borderRadius: "12px",
                      padding: "18px",
                      backgroundColor: "#F5F3FF",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 800,
                          color: "#6D28D9",
                          backgroundColor: "#EDE9FE",
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        Principal Independent Claim 1 (System)
                      </span>
                      <button
                        onClick={() => handleCopyText(claimsData.independentClaim1, "claim1")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#6D28D9",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 600,
                        }}
                      >
                        {copiedSection === "claim1" ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                        {copiedSection === "claim1" ? "Copied" : "Copy Claim 1"}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        lineHeight: 1.65,
                        color: "#1E1B4B",
                        whiteSpace: "pre-wrap",
                        fontFamily: "'Courier New', Courier, monospace",
                        backgroundColor: "#FFFFFF",
                        padding: "14px",
                        borderRadius: "8px",
                        border: "1px solid #DDD6FE",
                      }}
                    >
                      {claimsData.independentClaim1}
                    </pre>
                  </div>

                  {/* Dependent Claims */}
                  <div
                    style={{
                      border: "1px solid #E2E8F0",
                      borderRadius: "12px",
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                        Subordinate Dependent Claims (Claims 2 – 5)
                      </span>
                      <button
                        onClick={() => handleCopyText((claimsData.dependentClaims || []).join("\n\n"), "dependents")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {copiedSection === "dependents" ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                        {copiedSection === "dependents" ? "Copied" : "Copy All Claims"}
                      </button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {(claimsData.dependentClaims || []).map((cl, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "8px",
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            fontSize: "13px",
                            lineHeight: 1.5,
                            color: "#334155",
                          }}
                        >
                          {cl}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRIOR-ART COLLISION RADAR */}
              {activeTab === "RADAR" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div
                    style={{
                      backgroundColor: "#FFFBEB",
                      border: "1px solid #FDE68A",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <ShieldAlert size={22} color="#D97706" />
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400E" }}>
                        Global Patent Registry Collision Cross-Check
                      </div>
                      <div style={{ fontSize: "12px", color: "#B45309" }}>
                        Automated scan evaluated active patents across USPTO, Indian Patent Office (IPO), and EPO.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(claimsData.priorArtCollisions || []).map((col, idx) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #E2E8F0",
                          borderRadius: "12px",
                          padding: "16px",
                          backgroundColor: "#FFFFFF",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                          <div>
                            <span
                              style={{
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#1D4ED8",
                                backgroundColor: "#DBEAFE",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                marginRight: "8px",
                              }}
                            >
                              {col.jurisdiction}
                            </span>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>
                              {col.patentNumber}
                            </span>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155", marginTop: "4px" }}>
                              {col.title}
                            </div>
                          </div>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              color: col.overlapPercent > 10 ? "#DC2626" : "#059669",
                              backgroundColor: col.overlapPercent > 10 ? "#FEE2E2" : "#DCFCE7",
                              padding: "4px 10px",
                              borderRadius: "9999px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Overlap: {col.overlapPercent}%
                          </span>
                        </div>
                        <div
                          style={{
                            marginTop: "8px",
                            padding: "10px 12px",
                            borderRadius: "8px",
                            backgroundColor: "#F8FAFC",
                            border: "1px solid #E2E8F0",
                            fontSize: "12px",
                            color: "#475569",
                            lineHeight: 1.5,
                          }}
                        >
                          <strong style={{ color: "#0F172A" }}>Inventive Step Distinction:</strong> {col.distinction}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: OFFICIAL IPO FORM 2 DOSSIER PREVIEW */}
              {activeTab === "DOSSIER" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#F8FAFC",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>
                        FORM 2 - Complete Patent Specification (The Patents Act, 1970)
                      </div>
                      <div style={{ fontSize: "11px", color: "#64748B" }}>
                        Ready for submission to the Indian Patent Office (IPO)
                      </div>
                    </div>
                    <button
                      onClick={handlePrintDossier}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "8px",
                        backgroundColor: "#4338CA",
                        color: "#FFFFFF",
                        border: "none",
                        fontWeight: 600,
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Printer size={15} /> Print / Export Dossier
                    </button>
                  </div>

                  <div
                    style={{
                      border: "2px solid #CBD5E1",
                      borderRadius: "8px",
                      padding: "32px",
                      backgroundColor: "#FFFFFF",
                      fontFamily: "'Times New Roman', Times, serif",
                      color: "#0F172A",
                      lineHeight: 1.8,
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                      <div style={{ fontSize: "16px", fontWeight: "bold" }}>FORM 2</div>
                      <div style={{ fontSize: "13px", fontWeight: "bold" }}>THE PATENTS ACT 1970 (39 of 1970)</div>
                      <div style={{ fontSize: "12px" }}>&amp; The Patents Rules, 2003</div>
                      <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "8px", textDecoration: "underline" }}>
                        COMPLETE SPECIFICATION
                      </div>
                      <div style={{ fontSize: "12px" }}>(See section 10 and rule 13)</div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>1. TITLE OF THE INVENTION:</strong>
                      <div style={{ textTransform: "uppercase", fontWeight: "bold", marginLeft: "16px" }}>
                        {title}
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>2. APPLICANT(S):</strong>
                      <div style={{ marginLeft: "16px" }}>
                        Name: {filing?.studentName || project?.studentName || "Campus Institutional Researcher"}<br />
                        Nationality: Indian<br />
                        Address: Center for Research and IP, Academic Institution Campus.
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>3. PREAMBLE TO THE DESCRIPTION:</strong>
                      <div style={{ marginLeft: "16px" }}>
                        The following specification particularly describes the invention and the manner in which it is to be performed:
                      </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>FIELD OF THE INVENTION:</strong>
                      <p style={{ marginLeft: "16px" }}>{claimsData.fieldOfInvention}</p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>BACKGROUND AND PRIOR ART DEFICIENCIES:</strong>
                      <p style={{ marginLeft: "16px" }}>{claimsData.backgroundAndDeficiencies}</p>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                      <strong>WE CLAIM:</strong>
                      <div style={{ marginLeft: "16px" }}>
                        <p>{claimsData.independentClaim1}</p>
                        {(claimsData.dependentClaims || []).map((c, i) => (
                          <p key={i}>{c}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #E2E8F0",
            backgroundColor: "#F8FAFC",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "12px", color: "#64748B" }}>
            Generated by Nexus-AI Patent Intelligence Engine
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1px solid #CBD5E1",
              backgroundColor: "#FFFFFF",
              color: "#334155",
              fontWeight: 600,
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
