import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SidebarItem({ to, iconClass, title }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <NavLink
        to={to}
        title={title}
        style={({ isActive }) => ({
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isActive ? "#7C3AED" : "#64748B",
          backgroundColor: isActive ? "#F3E8FF" : "transparent",
          border: isActive ? "1px solid #DDD6FE" : "1px solid transparent",
          textDecoration: "none",
          transition: "all 0.2s ease",
          boxShadow: isActive ? "0 4px 12px rgba(124, 58, 237, 0.2)" : "none",
        })}
      >
        <i className={iconClass} style={{ fontSize: "1.25rem" }}></i>
      </NavLink>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleExit = () => {
    logout();
    navigate("/login");
  };

  const isStudent = user.role === "STUDENT";
  const isFaculty = user.role === "FACULTY";
  const isIpCell = user.role === "IP_CELL";
  const isAcademics = user.role === "ACADEMIC_OFFICE";
  const isAdmin = user.role === "ADMIN";

  return (
    <aside
      style={{
        width: "68px",
        minWidth: "68px",
        maxWidth: "68px",
        flexShrink: 0,
        position: "sticky",
        top: "64px",
        height: "calc(100vh - 64px)",
        maxHeight: "calc(100vh - 64px)",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #D9E2EC",
        padding: "24px 0 16px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        zIndex: 90,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          width: "100%",
          flex: 1,
          overflowY: "auto",
        }}
      >
        {isAcademics && (
          <>
            <SidebarItem
              to="/academics/catalogue"
              iconClass="bi bi-journal-plus"
              title="S5 Catalogue Management"
            />
            <SidebarItem
              to="/academics/mentor-allocation"
              iconClass="bi bi-person-check"
              title="Smart Guide Allocation"
            />
            <SidebarItem
              to="/academics/helpdesk"
              iconClass="bi bi-chat-left-text"
              title="Academic Helpdesk Hub"
            />
          </>
        )}

        {isStudent && (
          <>
            <SidebarItem
              to="/student/catalogue"
              iconClass="bi bi-journal-bookmark"
              title="S5 Project Catalogue Selection"
            />
            <SidebarItem
              to="/student/mini-project"
              iconClass="bi bi-kanban"
              title="Semester Mini-Project Tracker"
            />
            <SidebarItem
              to="/student/dashboard"
              iconClass="bi bi-journal-text"
              title="Research Papers & Proposals"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
              title="IP Tracker"
            />
          </>
        )}

        {isFaculty && (
          <>
            <SidebarItem
              to="/faculty/weekly-review"
              iconClass="bi bi-calendar-check"
              title="Weekly Log & Deliverables Review"
            />
            <SidebarItem
              to="/faculty/dashboard"
              iconClass="bi bi-check2-square"
              title="Research Paper Reviews"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
              title="IP Tracker"
            />
          </>
        )}

        {isIpCell && (
          <>
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
              title="IP Filing Tracker"
            />
            <SidebarItem
              to="/faculty/dashboard"
              iconClass="bi bi-journal-text"
              title="Research Projects"
            />
          </>
        )}

        {isAdmin && (
          <>
            <SidebarItem
              to="/academics/catalogue"
              iconClass="bi bi-journal-plus"
              title="S5 Catalogue Management"
            />
            <SidebarItem
              to="/academics/mentor-allocation"
              iconClass="bi bi-person-check"
              title="Smart Guide Allocation"
            />
            <SidebarItem
              to="/academics/helpdesk"
              iconClass="bi bi-chat-left-text"
              title="Academic Helpdesk Hub"
            />
            <SidebarItem
              to="/ip-tracker"
              iconClass="bi bi-shield-check"
              title="IP Tracker"
            />
          </>
        )}
      </div>

      <div
        style={{
          marginTop: "auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "16px",
          borderTop: "1px solid #D9E2EC",
        }}
      >
        <button
          onClick={handleExit}
          title="Sign Out"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            border: "1px solid #D9E2EC",
            backgroundColor: "#F8FAFC",
            color: "#64748B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#FEF2F2";
            e.currentTarget.style.color = "#DC2626";
            e.currentTarget.style.borderColor = "#FCA5A5";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#F8FAFC";
            e.currentTarget.style.color = "#64748B";
            e.currentTarget.style.borderColor = "#D9E2EC";
          }}
        >
          <i className="bi bi-box-arrow-right" style={{ fontSize: "1.25rem" }}></i>
        </button>
      </div>
    </aside>
  );
}
