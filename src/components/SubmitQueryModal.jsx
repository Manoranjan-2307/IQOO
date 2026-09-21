import React, { useState } from "react";
import { MessageSquare, Send, HelpCircle } from "lucide-react";
import axios from "axios";

export default function SubmitQueryModal({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Topic Selection");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id || !subject || !message) return;

    setSubmitting(true);
    try {
      await axios.post("/api/academic-queries", {
        senderId: user.id,
        category,
        subject,
        message,
      });

      setSuccessMsg("Query submitted! You will receive a notification when Academic Office responds.");
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setSuccessMsg("");
        setIsOpen(false);
      }, 2500);
    } catch (err) {
      alert("Failed to submit query. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          backgroundColor: "#F1F5F9",
          border: "1px solid #CBD5E1",
          borderRadius: "8px",
          padding: "6px 12px",
          color: "#334155",
          fontSize: "12px",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <HelpCircle size={15} color="#2563EB" /> Ask Academic Office
      </button>

      {isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, fontFamily: "'Poppins', sans-serif" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", width: "100%", maxWidth: "480px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1E293B", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
              <HelpCircle size={20} color="#2563EB" /> Contact Academic Office
            </h3>
            <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "16px" }}>
              Submit a support query or feedback regarding S5 topics, mentor mapping, or deadlines.
            </p>

            {successMsg ? (
              <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #86EFAC", padding: "14px", borderRadius: "8px", color: "#166534", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px" }}>
                    <option value="Topic Selection">Topic Selection / Catalogue</option>
                    <option value="Guide Allocation">Guide Allocation Request</option>
                    <option value="Timetable & Deadlines">Timetable & Deadlines</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>Subject *</label>
                  <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Requesting topic swap for S5-03" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>Message *</label>
                  <textarea required rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your query or feedback..." style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                  <button type="button" onClick={() => setIsOpen(false)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", color: "#475569", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                  <button type="submit" disabled={submitting} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#2563EB", color: "#FFFFFF", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                    {submitting ? "Submitting..." : "Send Query"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
