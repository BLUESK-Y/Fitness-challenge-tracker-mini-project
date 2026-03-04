import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RecentSessions.css";

const workoutEmoji = {
  Cardio: "🏃",
  Running: "👟",
  Cycling: "🚴",
  Strength: "🏋️",
  Yoga: "🧘",
};

const RecentSessions = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        
        const res = await api.get(`/Logs?userId=${user.id}`);

        
        const sorted = [...res.data]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setLogs(sorted);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="recent-section">
      <h2>Recent Sessions</h2>

      {loading ? (
        <p className="empty-text">Loading...</p>
      ) : logs.length === 0 ? (
        <p className="empty-text">No sessions logged yet.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="session-card">
            <div className="session-emoji">
              {workoutEmoji[log.workoutType] || "💪"}
            </div>

            <div className="session-left">
              <h4>{log.workoutType}</h4>
              <p>
                {formatDate(log.date)} • {log.duration} mins •{" "}
                {log.calories} kcal
                {log.steps ? ` • ${log.steps.toLocaleString()} steps` : ""}
              </p>
            </div>

            <div className="session-status">
              <span className="completed">✓ Done</span>
              <small>{log.time}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentSessions;