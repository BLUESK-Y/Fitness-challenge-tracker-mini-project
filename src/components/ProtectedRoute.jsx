import {Routes,Route} from "react-router-dom";
import Landing from "../pages/landing";
import Dashboard from "../features/dashboard/Dashboard";
import Challenges from "../features/challenges/Challenges";
import Leaderboard from "../features/leaderboard/Leaderboard";
import AICoach from "../features/aiCoach/AICoach"

const AppRoutes = ()=> {
    return (
        <Routes>
            <Route path="/" element={<Landing/>}/>

            <Route
                path="/Dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/Challenges" 
                element={
                    <ProtectedRoute>
                        <Challenges/>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}