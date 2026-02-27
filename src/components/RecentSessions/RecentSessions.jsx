import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RecentSessions.css";

const RecentSessions = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
  const fetchLogs = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const res = await api.get("/Logs");

      const today = new Date().toISOString().split("T")[0];

      // Filter:
      // 1. Only current user
      // 2. Only today's logs
      const filteredLogs = res.data
        .filter(
          (log) =>
            String(log.userId) === String(user.id) &&
            log.date === today
        )
        .reverse();

      setLogs(filteredLogs);

    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  fetchLogs();
}, []);

  return (
    <div className="recent-section">
      <h2>Recent Sessions</h2>

      {logs.length === 0 ? (
        <p className="empty-text">No sessions logged yet.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="session-card">
            <div className="session-left">
              <h4>{log.workoutType}</h4>

<p>
  {log.date} • {log.duration} mins • {log.calories} kcal • {log.steps} steps
</p>
            </div>

            <div className="session-status">
              <span className="completed">Completed</span>
              <small>{log.challengeName}</small>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecentSessions;