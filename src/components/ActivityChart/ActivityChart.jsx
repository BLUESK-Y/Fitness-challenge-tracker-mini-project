import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import api from "../../services/api";

const ActivityChart = () => {
  const [view, setView] = useState("week");
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, [view]);

  const fetchLogs = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/Logs?userId=${user.id}`);

      const sorted = res.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const sliced =
        view === "week"
          ? sorted.slice(-7)
          : sorted.slice(-30);

      setChartData(sliced.map((log) => log.steps));
      setCategories(
        sliced.map((log) =>
          new Date(log.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      background: "transparent"
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#3B82F6"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    markers: {
      size: 4,
      strokeWidth: 2
    },
    grid: {
      borderColor: "rgba(255,255,255,0.08)",
      strokeDashArray: 4
    },
    xaxis: {
      categories: categories,
      labels: {
        style: { colors: "#9CA3AF" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF" },
        formatter: (val) => `${Math.round(val / 1000)}k`
      }
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => `${val.toLocaleString()} steps`
      }
    }
  };

  const series = [
    {
      name: "Steps",
      data: chartData
    }
  ];

  return (
    <div className="activity-card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h4 style={{ color: "white" }}>Activity Trend</h4>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setView("week")}
            style={{
              background: view === "week" ? "#2563EB" : "#0f172a",
              color: "white",
              border: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Week
          </button>

          <button
            onClick={() => setView("month")}
            style={{
              background: view === "month" ? "#2563EB" : "#0f172a",
              color: "white",
              border: "none",
              padding: "6px 14px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Month
          </button>
        </div>
      </div>

      <Chart options={options} series={series} type="area" height={320} />
    </div>
  );
};

export default ActivityChart;