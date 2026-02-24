import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AppRoutes from "./components/ProtectedRoute"
import Landing from "./pages/landing"
import Dashboard from './features/dashboard/Dashboard';
import AICoach from './features/aiCoach/AICoach';
import Challenges from './features/challenges/Challenges';
import Leaderboard from './features/leaderboard/Leaderboard';
import AppNavbar from "./components/navbar/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
    <Router>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/leaderboard" element={<Leaderboard />} />
    <Route path="/challenges" element={<Challenges />} />
    <Route path="/ai-coach" element={<AICoach />} />
  </Routes>
</Router>
    <Landing/>
    
 
    </>
  )
}

export default App