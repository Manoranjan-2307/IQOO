import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { MessageSquare, Send, CheckCircle, Clock, Filter, Search, User } from "lucide-react";
import axios from "axios";

export default function AcademicHelpdesk() {
  const [queries, setQueries] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("OPEN");
  const [loading, setLoading] = useState(true);

  // Reply Modal State
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, [selectedStatus]);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/academic-queries?status=${selectedStatus}`);
      setQueries(res.data || []);
    } catch (err) {
      console.error("Failed to load academic queries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedQuery || !replyMessage) return;

    setReplying(true);
    try {
      await axios.post(`/api/academic-queries/${selectedQuery.id}/reply`, {
        replyMessage,
      });

      setSelectedQuery(null);
      setReplyMessage("");
      fetchQueries();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send resolution.");
    } finally {
      setReplying(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F7FC", fontFamily: "'Poppins', sans-serif" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar activeTab="academics-helpdesk" />

        <main style={{ flex: 1, padding: "28px 36px", width: "100%", boxSizing: "border-box" }}>
          {/* Header Title (Clean) */}
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
              Academic Helpdesk
            </h1>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            {["OPEN", "RESOLVED", "ALL"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: selectedStatus === status ? "1px solid #7C3AED" : "1px solid #E2E8F0",
                  backgroundColor: selectedStatus === status ? "#F3E8FF" : "#FFFFFF",
                  color: selectedStatus === status ? "#7C3AED" : "#64748B",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {status === "OPEN" ? "Pending Queries" : status === "RESOLVED" ? "Resolved Queries" : "All History"}
              </button>
            ))}
          </div>

          {/* Queries Table with Compact Gridlines */}
          <div style={{ width: "100%", backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "20px", boxSizing: "border-box" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1E293B", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageSquare size={18} color="#2563EB" /> Queries List ({queries.length})
            </h2>

            {loading ? (
              <p style={{ color: "#64748B", fontSize: "13px" }}>Loading queries...</p>
            ) : queries.length === 0 ? (
              <p style={{ color: "#64748B", fontSize: "13px" }}>No queries found in this status queue.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#F1F5F9", borderBottom: "2px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "140px" }}>Sender</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "80px" }}>Role</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "130px" }}>Category</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0" }}>Subject & Message</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, borderRight: "1px solid #E2E8F0", width: "100px" }}>Status</th>
                      <th style={{ padding: "12px 16px", color: "#334155", fontWeight: 700, textAlign: "center", width: "140px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queries.map((q) => (
                      <tr key={q.id} style={{ borderBottom: "1px solid #E2E8F0" }}>
                        <td style={{ padding: "12px 16px", fontWeight: 700, color: "#1E293B", borderRight: "1px solid #E2E8F0" }}>
                          {q.sender?.fullName}
                        </td>
                        <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ backgroundColor: q.userRole === "STUDENT" ? "#E0F2FE" : "#ECFDF5", color: q.userRole === "STUDENT" ? "#0369A1" : "#166534", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px" }}>
                            {q.userRole}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#475569", fontWeight: 600, borderRight: "1px solid #E2E8F0" }}>
                          {q.category}
                        </td>
                        <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0" }}>
                          <div style={{ fontWeight: 700, color: "#2563EB", fontSize: "13px", marginBottom: "3px" }}>{q.subject}</div>
                          <div style={{ color: "#334155", fontSize: "12px", lineHeight: 1.4 }}>{q.message}</div>
                          {q.replyMessage && (
                            <div style={{ marginTop: "8px", backgroundColor: "#F0FDF4", border: "1px solid #86EFAC", padding: "8px 12px", borderRadius: "6px", color: "#166534", fontSize: "11px" }}>
                              <strong>Academic Resolution Sent:</strong> {q.replyMessage}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px 16px", borderRight: "1px solid #E2E8F0" }}>
                          <span style={{ backgroundColor: q.status === "RESOLVED" ? "#DCFCE7" : "#FEF3C7", color: q.status === "RESOLVED" ? "#166534" : "#92400E", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "6px" }}>
                            {q.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", textAlign: "center" }}>
                          {q.status === "OPEN" ? (
                            <button
                              onClick={() => setSelectedQuery(q)}
                              style={{
                                backgroundColor: "#2563EB",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Send size={12} /> Respond & Notify
                            </button>
                          ) : (
                            <span style={{ fontSize: "11px", color: "#059669", fontWeight: 700 }}>Resolved</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Reply Modal */}
          {selectedQuery && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
              <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", width: "100%", maxWidth: "520px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1E293B", marginBottom: "4px" }}>
                  Respond & Notify User
                </h3>
                <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "16px" }}>
                  Replying to <strong>{selectedQuery.sender?.fullName}</strong> regarding <em>'{selectedQuery.subject}'</em>.
                </p>

                <form onSubmit={handleSendReply}>
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Academic Office Resolution Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your resolution, guidance, or status update here. This will trigger an instant notification to the user..."
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button type="button" onClick={() => setSelectedQuery(null)} style={{ padding: "8px 14px", borderRadius: "6px", border: "1px solid #CBD5E1", backgroundColor: "#FFFFFF", color: "#475569", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={replying} style={{ padding: "8px 16px", borderRadius: "6px", border: "none", backgroundColor: "#2563EB", color: "#FFFFFF", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                      {replying ? "Sending..." : "Send Resolution & Notify User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
