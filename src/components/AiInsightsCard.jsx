import React, { useState } from "react";
import { Sparkles, RefreshCw, Award, ShieldAlert, Cpu, Rocket, ChevronDown, ChevronUp, FileText } from "lucide-react";
import axios from "axios";

export default function AiInsightsCard({ project, onProjectUpdated, onOpenPatentStudio }) {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [msg, setMsg] = useState(null);

  if (!project) return null;

  const handleRefreshInsights = async () => {
    try {
      setLoading(true);
      setMsg(null);
      const res = await axios.post(`/api/projects/${project.id}/ai-insights`);
      if (res.data && res.data.project) {
        if (onProjectUpdated) {
          onProjectUpdated(res.data.project);
        }
        setMsg("✓ High-depth AI evaluation updated!");
        setTimeout(() => setMsg(null), 3500);
      }
    } catch (err) {
      console.error("Failed to re-analyze project:", err);
      setMsg("Failed to re-analyze: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const rawSummary = project.summary || "";

  // Parse structured sections from markdown if present
  const parseMarkdownSections = (text) => {
    if (!text) return [];
    const parts = text.split(/###\s+/);
    const sections = [];
    parts.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;
      const firstLineBreak = trimmed.indexOf("\n");
      if (firstLineBreak > -1) {
        const title = trimmed.substring(0, firstLineBreak).trim();
        const body = trimmed.substring(firstLineBreak).trim();
        sections.push({ title, body });
      } else {
        sections.push({ title: "Analysis", body: trimmed });
      }
    });
    return sections;
  };

  const sections = parseMarkdownSections(rawSummary);

  return (
    <div
      style={{
        border: "1px solid #C7D2FE",
        boxShadow: "0 4px 16px rgba(99, 102, 241, 0.08)",
        background: "linear-gradient(180deg, #F5F3FF 0%, #EEF2FF 100%)",
        borderRadius: "14px",
        padding: "18px 20px",
        marginBottom: "20px",
        position: "relative",
      }}
    >
      {/* Header Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              backgroundColor: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)",
            }}
          >
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1E1B4B" }}>
                AI Research &amp; Patentability Insights
              </h4>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4338CA",
                  backgroundColor: "#E0E7FF",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  border: "1px solid #C7D2FE",
                }}
              >
                ✨ Deep Analytical Engine
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "#6366F1" }}>
              Comprehensive evaluation of research novelty, methodology &amp; IP viability
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={handleRefreshInsights}
            disabled={loading}
            title="Re-run deep AI evaluation"
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #C7D2FE",
              backgroundColor: "#FFFFFF",
              color: "#4338CA",
              fontSize: "12px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <RefreshCw size={13} className={loading ? "spin" : ""} />
            {loading ? "Analyzing..." : "Re-Analyze"}
          </button>

          {onOpenPatentStudio && (
            <button
              onClick={() => onOpenPatentStudio(project)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4F46E5",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0 2px 4px rgba(79, 70, 229, 0.2)",
              }}
            >
              <Award size={13} />
              Patent Studio
            </button>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#64748B",
              padding: "4px",
            }}
          >
            {collapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {msg && (
        <div
          style={{
            fontSize: "12px",
            color: msg.startsWith("✓") ? "#15803D" : "#B91C1C",
            backgroundColor: msg.startsWith("✓") ? "#DCFCE7" : "#FEE2E2",
            padding: "6px 12px",
            borderRadius: "6px",
            marginBottom: "10px",
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      {/* Body Content */}
      {!collapsed && (
        <div style={{ marginTop: "10px" }}>
          {!rawSummary ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: "#64748B", fontSize: "13px" }}>
              No AI evaluation generated yet. Click "Re-Analyze" to evaluate this research proposal.
            </div>
          ) : sections.length > 1 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {sections.map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E0E7FF",
                    borderRadius: "10px",
                    padding: "12px 16px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#1E1B4B",
                      marginBottom: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {sec.title}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.6,
                      color: "#334155",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {sec.body}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "14px 16px",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#1E293B",
                border: "1px solid #E0E7FF",
              }}
            >
              {rawSummary}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
