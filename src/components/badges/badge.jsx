import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./badge.css";

// SVGs
import earlyPlain from "../../assets/badges/early riser-b.svg";
import earlyGlow from "../../assets/badges/early riser-g.svg";

import hydrationPlain from "../../assets/badges/hydration-b.svg";
import hydrationGlow from "../../assets/badges/hydration-g.svg";

import peakPlain from "../../assets/badges/peak performer-b.svg";
import peakGlow from "../../assets/badges/peak performer-g.svg";

import flexibilityPlain from "../../assets/badges/flexibility-b.svg";
import flexibilityGlow from "../../assets/badges/flexibility-g.svg";

import consistencyPlain from "../../assets/badges/consistency-b.svg";
import consistencyGlow from "../../assets/badges/consistency-g.svg";

import nightPlain from "../../assets/badges/Night owl-b.svg";
import nightGlow from "../../assets/badges/Night owl-g.svg";



const Badge = () => {
  const [logs, setLogs] = useState([]);
  const [badges, setBadges] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await api.get(`/Logs?userId=${user.id}`);
      setLogs(res.data);
      evaluateBadges(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /*  BADGE CRITERIA LOGIC  */

  const evaluateBadges = (data) => {
    // Early Riser: 3 workouts before 7 AM
    const early = data.filter((log) => {
      if (!log.time) return false; // if time not stored
      const hour = parseInt(log.time.split(":")[0]);
      return hour < 7;
    }).length >= 3;

    // Hydration Hero: 5+ workouts
    const hydration = data.length >= 5;

    // Peak Performer: 10,000+ steps in a workout
    const peak = data.some((log) => log.steps >= 10000);

    // Flexibility King: 3+ Yoga sessions
    const flexibility =
      data.filter((log) => log.workoutType === "Yoga").length >= 3;

    // Night Owl: 3 workouts after 9 PM
    const night = data.filter((log) => {
      if (!log.time) return false;
      const hour = parseInt(log.time.split(":")[0]);
      return hour >= 21;
    }).length >= 3;

    // Consistency King: 7 total logs 
    const consistency = data.length >= 7;

    setBadges({
      early,
      hydration,
      peak,
      flexibility,
      night,
      consistency,
    });
  };

  /*BADGE CONFIG */

  const badgeList = [
    {
      name: "Early Riser",
      achieved: badges.early,
      glow: earlyGlow,
      plain: earlyPlain,
    },
    {
      name: "Hydration Hero",
      achieved: badges.hydration,
      glow: hydrationGlow,
      plain: hydrationPlain,
    },
    {
      name: "Peak Performer",
      achieved: badges.peak,
      glow: peakGlow,
      plain: peakPlain,
    },
    {
      name: "Flexibility King",
      achieved: badges.flexibility,
      glow: flexibilityGlow,
      plain: flexibilityPlain,
    },
    {
      name: "Consistency King",
      achieved: badges.consistency,
      glow: consistencyGlow,
      plain: consistencyPlain,
    },
    {
      name: "Night Owl Workout",
      achieved: badges.night,
      glow: nightGlow,
      plain: nightPlain,
    },
  ];

  /* SORT: UNLOCKED FIRST  */

  const sortedBadges = [...badgeList].sort(
    (a, b) => Number(b.achieved) - Number(a.achieved)
  );

  return (
    <div className="badge-card">
      <h4>Badge Achievements</h4>

      <div className="badge-grid">
        {sortedBadges.map((badge) => (
          <div
            key={badge.name}
            className={`badge-item ${
              badge.achieved ? "unlocked" : "locked"
            }`}
          >
            <img
              src={badge.achieved ? badge.glow : badge.plain}
              alt={badge.name}
            />
            <p>{badge.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Badge;