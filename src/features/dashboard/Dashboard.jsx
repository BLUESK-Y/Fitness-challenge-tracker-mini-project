import React from 'react'
import AppNavbar from "../../components/navbar/navbar"
import LogForm from "../../components/LogForm/LogForm";
import ActivityChart from "../../components/ActivityChart/ActivityChart";
import "./Dashboard.css"
import CalendarView from '../../components/CalenderView/CalenderView';
import Badge from '../../components/badges/badge';
const Dashboard = () => {
  return (
    <>
    <AppNavbar/>
    <ActivityChart />
    <CalendarView/>
    <Badge/>
    
    </>
    
  )
}

export default Dashboard