import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import SubmitQueryModal from "./SubmitQueryModal";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "64px",
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #D9E2EC",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        fontFamily: "'Poppins', sans-serif",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Nexus-AI Heading */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #4B5D8C 0%, #3F507A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(75, 93, 140, 0.25)",
            }}
          >
            <Layers size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#1F2937", letterSpacing: "-0.5px" }}>
                Nexus-AI
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "#64748B" }}>
              Research Lifecycle &amp; IP Hub
            </p>
          </div>
        </div>

        {/* Notifications, Ask Academic Office & User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {user && (user.role === "STUDENT" || user.role === "FACULTY") && (
            <SubmitQueryModal user={user} />
          )}
          {user && <NotificationDropdown user={user} />}

          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #D9E2EC",
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor:
                    user.role === "FACULTY"
                      ? "#059669"
                      : user.role === "IP_CELL"
                      ? "#7C3AED"
                      : user.role === "ACADEMIC_OFFICE"
                      ? "#D97706"
                      : "#4B5D8C",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1F2937", lineHeight: 1.2 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "10px", color: "#64748B", lineHeight: 1 }}>
                  {user.role}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
