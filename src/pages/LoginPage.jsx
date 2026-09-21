import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, School, User, Building, Layers, Award, Sparkles, CheckCircle2 } from "lucide-react";
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
        background: "linear-gradient(135deg, #EEF4F8 0%, #F6F9FC 100%)",
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
          maxWidth: "420px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #D9E2EC",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
          padding: "32px 28px",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "linear-gradient(135deg, #4B5D8C 0%, #3F507A 100%)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto",
              boxShadow: "0 2px 10px rgba(75, 93, 140, 0.3)",
            }}
          >
            <Layers size={26} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1F2937", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            Nexus-AI Platform
          </h2>
          <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>
            {isSignUp ? "Register a new campus researcher profile" : "Academic Research & IP Filing Lifecycle"}
          </p>
        </div>

        {/* Quick Demo Credentials */}
        <div
          style={{
            backgroundColor: "#EEF4F8",
            border: "1px solid #D9E2EC",
            borderRadius: "10px",
            padding: "10px 12px",
            marginBottom: "18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
            <Sparkles size={13} color="#4B5D8C" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#4B5D8C", textTransform: "uppercase" }}>
              Quick Demo Fill
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => fillQuickLogin("student")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#E8EDF7",
                color: "#4B5D8C",
                border: "1px solid #D9E2EC",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("faculty")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#ECFDF5",
                color: "#008000",
                border: "1px solid #A7F3D0",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              👨‍🏫 Mentor
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("ipcell")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#F5F3FF",
                color: "#7C3AED",
                border: "1px solid #DDD6FE",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🏛️ IP Cell
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin("academics")}
              style={{
                flex: 1,
                padding: "5px 4px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: "#FEF3C7",
                color: "#D97706",
                border: "1px solid #FDE68A",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🏫 Office
            </button>
          </div>
        </div>

        {/* Role Segment Toggle for Sign Up */}
        {isSignUp && (
          <div
            style={{
              display: "flex",
              backgroundColor: "#EEF4F8",
              borderRadius: "8px",
              padding: "3px",
              marginBottom: "16px",
              border: "1px solid #D9E2EC",
            }}
          >
            {["STUDENT", "FACULTY", "IP_CELL"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  flex: 1,
                  padding: "6px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  border: "none",
                  borderRadius: "6px",
                  backgroundColor: role === r ? "#FFFFFF" : "transparent",
                  color: role === r ? "#4B5D8C" : "#64748B",
                  boxShadow: role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
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
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "12px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1F2937", marginBottom: "4px" }}>
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  style={{
                    width: "100%",
                    padding: "9px 10px 9px 34px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#F8FAFC",
                    color: "#1F2937",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1F2937", marginBottom: "4px" }}>
              Campus Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campus.edu"
                style={{
                  width: "100%",
                  padding: "9px 10px 9px 34px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#1F2937",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1F2937", marginBottom: "4px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "9px 10px 9px 34px",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  backgroundColor: "#F8FAFC",
                  color: "#1F2937",
                  fontSize: "13px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#1F2937", marginBottom: "4px" }}>
                Department
              </label>
              <div style={{ position: "relative" }}>
                <Building size={15} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "11px" }} />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "9px 10px 9px 34px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    backgroundColor: "#F8FAFC",
                    color: "#1F2937",
                    fontSize: "13px",
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
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #4B5D8C 0%, #3F507A 100%)",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 10px rgba(75, 93, 140, 0.25)",
              marginTop: "6px",
            }}
          >
            {loading ? "Authenticating..." : isSignUp ? "Create Nexus-AI Account" : "Access Portal"}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#64748B" }}>
          {isSignUp ? "Already registered on Nexus-AI? " : "New researcher or student? "}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#4B5D8C",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0,
              fontSize: "12px",
            }}
          >
            {isSignUp ? "Sign In" : "Register Here"}
          </button>
        </div>
      </div>
    </div>
  );
}