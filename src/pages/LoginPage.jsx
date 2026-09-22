import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Building, User, Layers, Sparkles } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const response = await axios.post("/api/auth/register", {
          fullName,
          email,
          password,
          role,
          department,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "ACADEMIC_OFFICE") {
          navigate("/academics/catalogue");
        } else if (user.role === "IP_CELL") {
          navigate("/ip-tracker");
        } else if (user.role === "FACULTY" || user.role === "ADMIN") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      } else {
        const response = await axios.post("/api/auth/login", {
          email,
          password,
          role,
        });

        const { user } = response.data;
        login(user);

        if (user.role === "ACADEMIC_OFFICE") {
          navigate("/academics/catalogue");
        } else if (user.role === "IP_CELL") {
          navigate("/ip-tracker");
        } else if (user.role === "FACULTY" || user.role === "ADMIN") {
          navigate("/faculty/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || (isSignUp ? "Registration failed." : "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (userType) => {
    if (userType === "student") {
      setEmail("alex.student@campus.edu");
      setPassword("student123");
      setRole("STUDENT");
    } else if (userType === "faculty") {
      setEmail("robert.faculty@campus.edu");
      setPassword("faculty123");
      setRole("FACULTY");
    } else if (userType === "ipcell") {
      setEmail("ipcell@campus.edu");
      setPassword("admin123");
      setRole("IP_CELL");
    } else if (userType === "academics") {
      setEmail("academics@campus.edu");
      setPassword("admin123");
      setRole("ACADEMIC_OFFICE");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Poppins', sans-serif",
        padding: "24px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
          padding: "36px 32px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px auto",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
            }}
          >
            <Layers size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Nexus<span style={{ color: "#7C3AED" }}>-AI</span>
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0, fontWeight: 500 }}>
            {isSignUp ? "Register a new campus researcher profile" : "Academic Research & IP Filing Lifecycle"}
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div
          style={{
            backgroundColor: "#F3E8FF",
            border: "1px solid #DDD6FE",
            borderRadius: "14px",
            padding: "12px 14px",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <Sparkles size={14} color="#7C3AED" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Quick Demo Fill Persona
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { key: "student", label: "Student" },
              { key: "faculty", label: "Mentor" },
              { key: "ipcell", label: "IP Cell" },
              { key: "academics", label: "Office" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => fillQuickLogin(p.key)}
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor: "#FFFFFF",
                  color: "#7C3AED",
                  border: "1px solid #DDD6FE",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role Segment Toggle for Sign Up */}
        {isSignUp && (
          <div
            style={{
              display: "flex",
              backgroundColor: "#F8FAFC",
              borderRadius: "12px",
              padding: "4px",
              marginBottom: "18px",
              border: "1px solid #E2E8F0",
            }}
          >
            {["STUDENT", "FACULTY", "IP_CELL"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "8px 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: role === r ? "#FFFFFF" : "transparent",
                  color: role === r ? "#7C3AED" : "#64748B",
                  boxShadow: role === r ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                  cursor: "pointer",
                }}
              >
                {r === "IP_CELL" ? "IP Cell" : r.charAt(0) + r.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#F8FAFC",
                    color: "#0F172A",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
              Campus Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#0F172A",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "10px 12px 10px 38px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#0F172A",
                  fontSize: "13px",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "6px" }}>
                Department
              </label>
              <div style={{ position: "relative" }}>
                <Building size={16} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "12px" }} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 38px",
                    borderRadius: "12px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#F8FAFC",
                    color: "#0F172A",
                    fontSize: "13px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="CSE">CSE (Computer Science &amp; Engineering)</option>
                  <option value="AI&DS">AI&amp;DS (AI &amp; Data Science)</option>
                  <option value="AI&ML">AI&amp;ML (AI &amp; Machine Learning)</option>
                  <option value="IT">IT (Information Technology)</option>
                  <option value="CSBS">CSBS (Computer Science &amp; Business Systems)</option>
                  <option value="ECE">ECE (Electronics &amp; Communication)</option>
                  <option value="EEE">EEE (Electrical &amp; Electronics)</option>
                  <option value="IP Cell">IP Cell</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: "linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)",
              marginTop: "8px",
              transition: "transform 0.15s ease"
            }}
          >
            {loading ? "Authenticating..." : isSignUp ? "Create Nexus-AI Account" : "Access Portal"}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "#64748B" }}>
          {isSignUp ? "Already registered on Nexus-AI? " : "New researcher or student? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#7C3AED",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
              fontSize: "13px",
            }}
          >
            {isSignUp ? "Sign In" : "Register Here"}
          </button>
        </div>
      </div>
    </div>
  );
}