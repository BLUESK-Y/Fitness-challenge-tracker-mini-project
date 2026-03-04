import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Leaderboard.css";
import AppNavbar from "../../components/navbar/navbar";
import { first, second, third } from "../../assets";
import Footer from "../../components/footer/footer";

const TABS = [
  { key: "points", label: "Total Points", icon: "🏆" },
  { key: "steps", label: "Steps Today", icon: "👟" },
  { key: "calories", label: "Calories Today", icon: "🔥" },
];

const Leaderboard = () => {
  const [tab, setTab] = useState("points");
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const topThree = rankings.slice(0, 3);

  useEffect(() => {
    fetchLeaderboard();
  }, [tab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const [logsRes, usersRes] = await Promise.all([
        api.get("/Logs"),
        api.get("/user"),
      ]);

      const logs = logsRes.data;
      const users = usersRes.data;
      const todayLogs = logs.filter((log) => log.date === today);

      
      const todayStatsMap = {};
      todayLogs.forEach((log) => {
        const uid = String(log.userId);
        if (!todayStatsMap[uid])
          todayStatsMap[uid] = { steps: 0, calories: 0, duration: 0 };
        todayStatsMap[uid].steps += Number(log.steps || 0);
        todayStatsMap[uid].calories += Number(log.calories || 0);
        todayStatsMap[uid].duration += Number(log.duration || 0);
      });

      let leaderboardData = [];

      if (tab === "points") {
        leaderboardData = users
          .filter((u) => (u.totalPoints || 0) > 0)
          .map((u) => {
            const uid = String(u.id);
            const ts = todayStatsMap[uid] || { steps: 0, calories: 0, duration: 0 };
            return { id: uid, name: u.name, value: u.totalPoints || 0, ...ts };
          });
      } else {
        leaderboardData = Object.keys(todayStatsMap).map((userId) => {
          const user = users.find((u) => String(u.id) === userId);
          const ts = todayStatsMap[userId];
          return {
            id: userId,
            name: user?.name || "Unknown",
            value: tab === "steps" ? ts.steps : ts.calories,
            totalPoints: user?.totalPoints || 0,
            ...ts,
          };
        });
      }

      leaderboardData.sort((a, b) => b.value - a.value);
      setRankings(leaderboardData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
  };

  const formatValue = (val) => {
    if (tab === "points") return `${val.toLocaleString()} pts`;
    if (tab === "steps") return `${val.toLocaleString()} steps`;
    return `${val.toLocaleString()} kcal`;
  };

  const userRank =
    rankings.findIndex((r) => String(r.id) === String(currentUser?.id)) + 1;

  // Podium order
  const podiumSlots = [
    { player: topThree[1], cls: "second", img: second, height: 150 },
    { player: topThree[0], cls: "first",  img: first,  height: 190 },
    { player: topThree[2], cls: "third",  img: third,  height: 130 },
  ];

  return (
    <>
      <AppNavbar />
      <div className="lb-page">

        {/* HEADER */}
        <div className="lb-header">
          <div className="lb-header-text">
            <h1 className="lb-title">Community Leaderboard</h1>
            <p className="lb-subtitle">See how you stack up against the community</p>
          </div>
          {currentUser && userRank > 0 && (
            <div className="lb-rank-pill">
              <span className="lb-rank-pill-label">Your Rank</span>
              <span className="lb-rank-pill-num">#{userRank}</span>
            </div>
          )}
        </div>

        {/* TABS */}
        <div className="lb-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`lb-tab ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="lb-loading">
            <div className="lb-spinner" />
            <p>Loading rankings...</p>
          </div>
        ) : rankings.length === 0 ? (
          <div className="lb-empty">
            <span className="lb-empty-icon">🏜️</span>
            <p>No data yet</p>
            <small>
              {tab !== "points"
                ? "No activity recorded today."
                : "No points earned yet."}
            </small>
          </div>
        ) : (
          <div className="lb-body">

            {/* PODIUM */}
            {topThree.length >= 1 && (
              <div className="lb-podium">
                {podiumSlots.map(({ player, cls, img, height }, i) => {
                  if (!player) return <div key={i} className="lb-podium-placeholder" />;
                  const isYou = String(player.id) === String(currentUser?.id);
                  return (
                    <div key={player.id} className={`lb-podium-card ${cls} ${isYou ? "is-you" : ""}`}>
                      <img src={img} alt={cls} className="lb-medal-img" />
                      <div className={`lb-podium-avatar lb-av-${cls}`}>
                        {getInitials(player.name)}
                      </div>
                      <p className="lb-podium-name">{player.name}</p>
                      <p className="lb-podium-value">{formatValue(player.value)}</p>
                      {isYou && <span className="lb-you-chip">You</span>}
                      <div
                        className={`lb-podium-base ${cls}`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* TABLE */}
            <div className="lb-table">
              <div className="lb-table-head">
                <span>Rank</span>
                <span>Athlete</span>
                <span>{tab === "points" ? "Points" : tab === "steps" ? "Steps" : "Calories"}</span>
                <span>Steps Today</span>
                <span>Calories</span>
                <span>Duration</span>
              </div>

              {rankings.map((user, index) => {
                const isYou = String(user.id) === String(currentUser?.id);
                return (
                  <div
                    key={user.id}
                    className={`lb-table-row ${isYou ? "lb-you-row" : ""}`}
                  >
                    <span className="lb-rank">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                    </span>

                    <div className="lb-user-cell">
                      <div className={`lb-avatar lb-av-${["gold","silver","bronze","blue","purple"][index % 5]}`}>
                        {getInitials(user.name)}
                      </div>
                      <span className="lb-user-name">
                        {user.name}
                        {isYou && <span className="lb-you-tag">You</span>}
                      </span>
                    </div>

                    <span className="lb-val-primary">{formatValue(user.value)}</span>

                    <span className="lb-val-stat">
                      {user.steps > 0
                        ? `👟 ${user.steps.toLocaleString()}`
                        : <span className="lb-nil">—</span>}
                    </span>

                    <span className="lb-val-stat">
                      {user.calories > 0
                        ? `🔥 ${user.calories.toLocaleString()} kcal`
                        : <span className="lb-nil">—</span>}
                    </span>

                    <span className="lb-val-stat">
                      {user.duration > 0
                        ? `⏱ ${user.duration} min`
                        : <span className="lb-nil">—</span>}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Leaderboard;