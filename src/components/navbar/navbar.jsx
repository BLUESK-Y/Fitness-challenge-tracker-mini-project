import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {logo} from "../../assets";
import "./navbar.css";

const AppNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get logged user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="app-navbar">
            <Container fluid>
                {/* Logo / Brand */}
                <Navbar.Brand as={Link} to="/dashboard" className="brand">
                    <img src={logo} className="brand-icon"></img>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">

                {/* Center Links */}
                <Nav className="mx-auto nav-links">

                <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className={location.pathname === "/dashboard" ? "active" : ""}
                >
                    Dashboard
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/leaderboard"
                    className={location.pathname === "/leaderboard" ? "active" : ""}
                >
                    Leaderboard
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/challenges"
                    className={location.pathname === "/challenges" ? "active" : ""}
                >
                    Challenges
                </Nav.Link>

                <Nav.Link
                    as={Link}
                    to="/ai-coach"
                    className={location.pathname === "/ai-coach" ? "active" : ""}
                >
                    AI Coach
                </Nav.Link>

                </Nav>

                {/* Right Section */}
                <div className="nav-right">

                    {/* Profile Circle */}
                    <div className="profile-circle">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    {/* Logout */}
                    <a className="logout-btn" onClick={handleLogout}>
                        Logout
                    </a>

                </div>

            </Navbar.Collapse>
        </Container>
    </Navbar>
  );
};

export default AppNavbar;