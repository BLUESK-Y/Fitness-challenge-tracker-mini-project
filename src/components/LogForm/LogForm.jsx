import React, { useState } from "react";
import api from "../../services/api";
import "./logform.css";

const LogForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    workoutType: "",
    duration: "",
    calories: "",
    steps: "",
  });

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    try {
      const newLog = {
        date: formData.date,
        workoutType: formData.workoutType,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
        steps: Number(formData.steps),
        userId: user.id,
      };

      await api.post("/Logs", newLog);

      alert("Workout logged successfully!");

      setFormData({
        date: "",
        workoutType: "",
        duration: "",
        calories: "",
        steps: "",
      });

    } catch (error) {
      console.error("Error logging workout:", error);
      alert("Failed to log workout. Check API structure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="log-card">
      <h3 className="log-title">Quick Log Workout</h3>

      <form onSubmit={handleSubmit} className="log-form">

        {/* Date */}
        <div className="log-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Workout Type */}
        <div className="log-group">
          <label>Workout Type</label>
          <select
            name="workoutType"
            value={formData.workoutType}
            onChange={handleChange}
            required
          >
            <option value="">Select Workout</option>
            <option value="Cardio">Cardio</option>
            <option value="Running">Running</option>
            <option value="Cycling">Cycling</option>
            <option value="Strength">Strength</option>
            <option value="Yoga">Yoga</option>
          </select>
        </div>

        {/* Duration */}
        <div className="log-group">
          <label>Duration (min)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
        </div>

        {/* Calories */}
        <div className="log-group">
          <label>Calories Burned</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />
        </div>

        {/* Steps */}
        <div className="log-group">
          <label>Steps</label>
          <input
            type="number"
            name="steps"
            value={formData.steps}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="log-btn" disabled={loading}>
          {loading ? "Logging..." : "Log Session"}
        </button>

      </form>
    </div>
  );
};

export default LogForm;