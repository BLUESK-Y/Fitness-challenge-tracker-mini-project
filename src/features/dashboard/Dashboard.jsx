import React from 'react'
import AppNavbar from "../../components/navbar/navbar"
import LogForm from "../../components/LogForm/LogForm";
import ActivityChart from "../../components/ActivityChart/ActivityChart";
import "./Dashboard.css"
import CalendarView from '../../components/CalenderView/CalenderView';
import Badge from '../../components/badges/badge';
import JoinedChallenges from '../../components/JoinedChallenges';
import RecentSessions from '../../components/RecentSessions/RecentSessions';
import  { useEffect, useState } from "react";
import api from "../../services/api";
import {StreakIcon,dumbellIcon,stepCountIcon,caloriesIcon} from "../../assets"
import Footer from "../../components/footer/footer"
const Dashboard = () => {
  const [user, setUser] = useState(null);
const [logs, setLogs] = useState([]);

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) setUser(storedUser);

  fetchLogs();
}, []);

const fetchLogs = async () => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const res = await api.get(`/Logs?userId=${storedUser.id}`);
    setLogs(res.data);
  } catch (err) {
    console.error(err);
  }
};



// Total workouts
const totalWorkouts = logs.length;

// Total calories
const totalCalories = logs.reduce(
  (acc, log) => acc + (log.calories || 0),
  0
);

// steps calculation 
const totalSteps = logs.reduce(
  (acc, log) => acc + (log.steps || 0),
  0
);

//  streak 
const uniqueDays = new Set(
  logs.map((log) => new Date(log.date).toDateString())
);

const currentStreak = uniqueDays.size;
  return (
    <>
    <AppNavbar/>
    {/* DASHBOARD TOP SECTION */}
<div className="dashboard-top">

  <div className="welcome-row">
    <div>
      <h1>Welcome back, {user?.name || "User"}!</h1>
      <p>
        "Consistency is the key to breakthrough." You're doing great!
      </p>
    </div>

    
  </div>

  <div className="stats-grid">

    {/* STREAK */}
    <div className="stat-card">
      <div className="stat-icon">
        <img src={StreakIcon} alt=""/>
      </div>
      <div>
        <span className="badge green">Active</span>
        <p>Current Streak</p>
        <h2>{currentStreak} Days</h2>
      </div>
    </div>

    {/* WORKOUTS */}
    <div className="stat-card">
      <div className="stat-icon">
        <img src={dumbellIcon} alt=""/>
      </div>
      <div>
        <span className="badge green">Total</span>
        <p>Total Workouts</p>
        <h2>{totalWorkouts} Sess.</h2>
      </div>
    </div>

    {/* CALORIES */}
    <div className="stat-card">
      <div className="stat-icon">
        <img src={caloriesIcon} alt=""/>
      </div>
      <div>
        <span className="badge blue">Weekly</span>
        <p>Calories Burnt</p>
        <h2>{totalCalories} kcal</h2>
      </div>
    </div>

    {/* STEPS */}
    <div className="stat-card">
      <div className="stat-icon">
        <img src={stepCountIcon} alt=""/>
      </div>
      <div>
        <span className="badge green">Progress</span>
        <p>Steps Count</p>
        <h2>{totalSteps}</h2>
      </div>
    </div>

  </div>
</div>
  <div className="dashboard-container">

    {/* TOP ROW */}
    <div className="dashboard-grid-top">
      <ActivityChart />
      <CalendarView />
    </div>

    {/* MIDDLE ROW */}
    <div className="dashboard-grid-middle">
      <Badge />
      <LogForm />
    </div>

    {/* BOTTOM ROW */}
    <div className="dashboard-grid-bottom">
      <div className="bottom-left">
        <RecentSessions />
      </div>

      <div className="bottom-right">
        <JoinedChallenges />
      </div>
    </div>

  </div>
  <Footer/>
  </>
);
}

export default Dashboard