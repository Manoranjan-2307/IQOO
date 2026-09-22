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
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(15, 23, 42, 0.04)",
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
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
            }}
          >
            <Layers size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "19px", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
                Nexus<span style={{ color: "#7C3AED" }}>-AI</span>
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 500, color: "#64748B" }}>
              Institutional Research &amp; IP Management
            </p>
          </div>
        </div>

        {/* Notifications, Ask Academic Office & User Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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
                padding: "6px 14px",
                borderRadius: "12px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  backgroundColor:
                    user.role === "FACULTY"
                      ? "#059669"
                      : user.role === "IP_CELL"
                      ? "#7C3AED"
                      : user.role === "ACADEMIC_OFFICE"
                      ? "#6366F1"
                      : user.role === "ADMIN"
                      ? "#D97706"
                      : "#2563EB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: "13px",
                  fontWeight: 700,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#64748B", lineHeight: 1 }}>
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
