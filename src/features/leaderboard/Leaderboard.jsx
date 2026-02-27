import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./Leaderboard.css";
import AppNavbar from "../../components/navbar/navbar";
import {first,second,third} from "../../assets"
import Footer from "../../components/footer/footer"

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const topThree = rankings.slice(0, 3);
  const others = rankings.slice(3);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [logsRes, usersRes] = await Promise.all([
        api.get("/Logs"),
        api.get("/user"),
      ]);

      const logs = logsRes.data;
      const users = usersRes.data;

     
      const todayLogs = logs.filter((log) => log.date === today);

      
      const stepMap = {};

      todayLogs.forEach((log) => {
        if (!stepMap[log.userId]) {
          stepMap[log.userId] = 0;
        }
        stepMap[log.userId] += Number(log.steps || 0);
      });

      // Convert to leaderboard array
      const leaderboardData = Object.keys(stepMap).map((userId) => {
        const user = users.find(
          (u) => String(u.id) === String(userId)
        );

        return {
          id: userId,
          name: user?.name || "Unknown",
          steps: stepMap[userId],
        };
      });

      // Sort descending
      leaderboardData.sort((a, b) => b.steps - a.steps);

      setRankings(leaderboardData);
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return (
      (parts[0]?.[0] || "") +
      (parts[1]?.[0] || "")
    ).toUpperCase();
  };

  return (
    <>
    <AppNavbar/>
    <div className="leaderboard-container">
      <h2>Community Leaderboard</h2>
      <p>Top performers based on today’s step count</p>

      <div className="leaderboard-table">
        {/* PODIUM SECTION */}
{topThree.length > 0 && (
  <div className="podium">

    {/* 2nd Place */}
    {topThree[1] && (
      <div className="podium-card second">
        <div className="rank-badge">
          <img src={second} alt="" />
        </div>

        <div className="avatar big">
          {getInitials(topThree[1].name)}
        </div>

        <h3>{topThree[1].name}</h3>
        <p className="steps">{topThree[1].steps.toLocaleString()}</p>

        
      </div>
    )}

    {/* 1st Place */}
    {topThree[0] && (
      <div className="podium-card first">
        <div className="trophy">
          <img src={first} alt="" />
        </div>

        <div className="avatar biggest">
          {getInitials(topThree[0].name)}
        </div>

        <h3>{topThree[0].name}</h3>
        <p className="steps">{topThree[0].steps.toLocaleString()}</p>


      </div>
    )}

    {/* 3rd Place */}
    {topThree[2] && (
      <div className="podium-card third">
        <div className="rank-badge">
          <img src={third} alt="" />
        </div>

        <div className="avatar big">
          {getInitials(topThree[2].name)}
        </div>

        <h3>{topThree[2].name}</h3>
        <p className="steps">{topThree[2].steps.toLocaleString()}</p>

      </div>
    )}

  </div>
)}
        <div className="table-header">
          <span>Rank</span>
          <span>User</span>
          <span>Steps Today</span>
        </div>

        {rankings.length === 0 && (
          <div className="no-data">
            No activity recorded today.
          </div>
        )}

        {rankings.map((user, index) => (
          <div
            key={user.id}
            className={`table-row ${
              currentUser?.id === user.id ? "highlight" : ""
            }`}
          >
            <span className="rank">{index + 1}</span>

            <div className="user-cell">
              <div className="avatar">
                {getInitials(user.name)}
              </div>
              <span>
                {user.name}
                {currentUser?.id === user.id && (
                  <span className="you-tag">You</span>
                )}
              </span>
            </div>

            <span className="steps">
              {user.steps.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Leaderboard;