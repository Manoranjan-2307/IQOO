import React, { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Info, Sparkles } from "lucide-react";
import axios from "axios";

export default function NotificationDropdown({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const [resList, resCount] = await Promise.all([
        axios.get(`/api/notifications?userId=${user.id}`),
        axios.get(`/api/notifications/unread-count?userId=${user.id}`),
      ]);
      setNotifications(resList.data || []);
      setUnreadCount(resCount.data?.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/notifications/read-all?userId=${user.id}`);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "relative",
          background: "#F1F5F9",
          border: "1px solid #E2E8F0",
          borderRadius: "50%",
          width: "38px",
          height: "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <Bell size={18} color="#475569" />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              backgroundColor: "#EF4444",
              color: "#FFFFFF",
              borderRadius: "50%",
              width: "18px",
              height: "18px",
              fontSize: "10px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #FFFFFF",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "46px",
            width: "360px",
            backgroundColor: "#FFFFFF",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #E2E8F0",
            zIndex: 1000,
            overflow: "hidden",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#F8FAFC",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bell size={16} color="#4B5D8C" />
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: "#DBEAFE",
                    color: "#1E40AF",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: "12px",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563EB",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: "320px", overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "#94A3B8",
                  fontSize: "13px",
                }}
              >
                No notifications yet.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.read && markAsRead(item.id)}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #F1F5F9",
                    backgroundColor: item.read ? "#FFFFFF" : "#EFF6FF",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: item.read ? "#334155" : "#1E40AF",
                      }}
                    >
                      {item.title}
                    </span>
                    <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
