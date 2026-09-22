import React from "react";
import { CheckCircle2, Clock, FileText, AlertCircle, Award, ShieldCheck } from "lucide-react";

export default function MilestoneTimeline({ status }) {
  const steps = [
    { id: "SUBMITTED", label: "Proposal Submitted", icon: FileText },
    { id: "UNDER_REVIEW", label: "In Evaluation", icon: Clock },
    { id: "APPROVED", label: "Faculty Approved", icon: CheckCircle2 },
    { id: "READY_FOR_IP", label: "Patent Eligible", icon: ShieldCheck },
    { id: "IP_FILED", label: "IP Patent Filed", icon: Award },
  ];

  const getStepState = (stepId) => {
    if (status === "REJECTED") {
      if (stepId === "SUBMITTED") return "completed";
      if (stepId === "UNDER_REVIEW") return "rejected";
      return "pending";
    }

    if (status === "REVISION_REQUESTED") {
      if (stepId === "SUBMITTED") return "completed";
      if (stepId === "UNDER_REVIEW") return "warning";
      return "pending";
    }

    const order = ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "READY_FOR_IP", "IP_FILED"];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "pending";
  };

  return (
    <div style={{ padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
        {steps.map((step, idx) => {
          const state = getStepState(step.id);
          const Icon = step.icon;

          let bgColor = "#F1F5F9";
          let textColor = "#94A3B8";
          let borderColor = "#E2E8F0";

          if (state === "completed") {
            bgColor = "#059669";
            textColor = "#FFFFFF";
            borderColor = "#059669";
          } else if (state === "active") {
            bgColor = "#7C3AED";
            textColor = "#FFFFFF";
            borderColor = "#7C3AED";
          } else if (state === "warning") {
            bgColor = "#D97706";
            textColor = "#FFFFFF";
            borderColor = "#D97706";
          } else if (state === "rejected") {
            bgColor = "#DC2626";
            textColor = "#FFFFFF";
            borderColor = "#DC2626";
          }

          return (
            <React.Fragment key={step.id}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, flex: 1 }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: bgColor,
                    color: textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    border: `2px solid ${borderColor}`,
                    boxShadow: state === "active" ? "0 4px 12px rgba(124, 58, 237, 0.3)" : "none",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: state === "active" || state === "completed" ? "600" : "500",
                    color: state === "active" ? "#7C3AED" : state === "completed" ? "#0F172A" : "#64748B",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: "3px",
                    backgroundColor: state === "completed" ? "#059669" : "#E2E8F0",
                    marginTop: "-20px",
                    zIndex: 1,
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
