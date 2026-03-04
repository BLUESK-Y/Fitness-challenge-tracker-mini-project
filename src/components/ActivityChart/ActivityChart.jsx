import React, { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";
import api from "../../services/api";
import "./ActivityChart.css";

const ActivityChart = () => {
  const [view, setView] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [view]);

  const fetchLogs = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/Logs?userId=${user.id}`);

      const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Group by date and sum steps per day
      const grouped = {};
      sorted.forEach((log) => {
        const dateKey = new Date(log.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        grouped[dateKey] = (grouped[dateKey] || 0) + log.steps;
      });

      const entries = Object.entries(grouped);
      const sliced = view === "week" ? entries.slice(-7) : entries.slice(-30);

      setCategories(sliced.map(([date]) => date));
      setChartData(sliced.map(([, steps]) => steps));

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(() => ({
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent",
      animations: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3B82F6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 4,
      strokeWidth: 2,
    },
    grid: {
      borderColor: "rgba(255,255,255,0.08)",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: "#9CA3AF" },
        rotate: -30,
        hideOverlappingLabels: true,
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF" },
        formatter: (val) => `${Math.round(val / 1000)}k`,
      },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (val) => `${val.toLocaleString()} steps` },
    },
    noData: {
      text: "No activity data for this period",
      style: { color: "#9CA3AF", fontSize: "14px" },
    },
  }), [categories]);

  const series = [{ name: "Steps", data: chartData }];

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h4 className="activity-title">Activity Trend</h4>

        <div className="activity-filters">
          {["week", "month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`filter-btn ${view === v ? "active" : "inactive"}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="activity-loading">Loading...</div>
      ) : (
        <Chart key={view} options={options} series={series} type="area" height={320} />
      )}
    </div>
  );
};

export default ActivityChart;