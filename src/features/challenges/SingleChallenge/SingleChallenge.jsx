import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import "./singleChallenge.css";
import AppNavbar from "../../../components/navbar/navbar";
import Footer from "../../../components/footer/footer";

const SingleChallenge = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      const res = await api.get(`/challengeDetails/${id}`);
      setChallenge(res.data);
    };
    fetchChallenge();
  }, [id]);

  const handleJoin = async () => {
  try {
    const updatedData = {
      ...challenge,
      status: "Joined",
    };

    await api.put(`/challengeDetails/${id}`, updatedData);

    setChallenge(updatedData);
  } catch (error) {
    console.error("Error joining challenge:", error);
  }
};

  if (!challenge) return <div className="loading">Loading...</div>;

  return (
    <>
    <AppNavbar/>
    <div className="single-page">

      {/* HERO */}
      <section className="hero">
        <img src={challenge.heroImage} alt="" className="hero-bg" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <div className="tag-container">
            {challenge.tags?.map((tag, index) => (
              <span key={index} className="tag-pill">{tag}</span>
            ))}
          </div>

          <h1>{challenge.title}</h1>

          <div className="coach-row">
            <img
              src={challenge.coach?.avatar}
              alt=""
              className="coach-avatar"
            />
            <span>
              with <strong>{challenge.coach?.name}</strong>
            </span>
            <span className="rating">
              ⭐ {challenge.rating?.value}
              <small> ({challenge.rating?.reviews})</small>
            </span>
          </div>
        </div>
      </section>

      <div className="content-wrapper">

        {/* LEFT SIDE */}
        <div className="left-content">

          {/* JOURNEY ROADMAP */}
          <div className="roadmap-section">
            <h2>The Journey Roadmap</h2>

            <div
  className="roadmap-card"
  style={{
    gridTemplateColumns: `repeat(${challenge.roadmap.length}, 1fr)`
  }}
>
  <div className="progress-line"></div>

  {challenge.roadmap.map((week, index) => (
    <div key={index} className="roadmap-step">
      <div className={`circle ${week.status}`}>
        {week.status === "completed" ? "✓" : "🔒"}
      </div>
      <p className="week-title">Week {week.week}</p>
      <small>{week.title}</small>
    </div>
  ))}
</div>
          </div>

          {/* ABOUT + RULES  */}
          <div className="about-rules-grid">

            <div className="about-section">
              <h2>About the Challenge</h2>
              <p>{challenge.overview?.short}</p>
              <p>{challenge.overview?.long}</p>
            </div>

            <div className="rules-section">
              <h2>Program Rules</h2>
              <ul>
                {challenge.rules?.map((rule, index) => (
                  <li key={index}>✔ {rule}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* BENEFITS */}
          <div className="benefits-section">
            <h2>What You'll Achieve</h2>

            <div className="benefits-grid">
              {challenge.benefits?.map((b, index) => (
                <div key={index} className="benefit-card">
                  <h4>{b.title}</h4>
                  <p>{b.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-content">

          {/* JOIN CARD */}
          <div className="sticky-card">
            <button
              className={`join-btn ${
                challenge.status === "Joined" ? "joined" : ""
              }`}
              onClick={handleJoin}
              disabled={challenge.status === "Joined"}
            >
              {challenge.status === "Joined"
                ? "✓ Joined"
                : "Join Challenge →"}
            </button>

            <div className="info-grid">
              <div>
                <span>Duration</span>
                <strong>{challenge.duration} Days</strong>
              </div>
              <div>
                <span>Skill Level</span>
                <strong>{challenge.level}</strong>
              </div>
              <div>
                <span>Participants</span>
                <strong>{challenge.participants}</strong>
              </div>
              <div>
                <span>Equipment</span>
                <strong>{challenge.equipment}</strong>
              </div>
            </div>
          </div>

          {/* INCLUDED CARD  */}
          <div className="included-card">
            <h3>What's Included</h3>

            {challenge.included?.map((item, index) => (
              <div key={index} className="included-item">
                <span>✔</span>
                <p>{item}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default SingleChallenge;