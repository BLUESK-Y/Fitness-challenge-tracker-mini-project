import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import "./SingleChallenge.css";
import AppNavbar from "../../../components/navbar/navbar";
import Footer from "../../../components/footer/footer";

const SingleChallenge = () => {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const [challenge, setChallenge] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [progress, setProgress] = useState(null);
  const [joining, setJoining] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);

  // fetch challenge + join status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [challengeRes, joinRes] = await Promise.all([
          api.get(`/challengeDetails/${id}`),
          api.get(`/UserChallenges?userId=${user.id}&challengeId=${id}`)
          .catch(err => {
          // MockAPI returns 404 when no records match 
          if (err.response?.status === 404) return { data: [] };
          throw err; 
        })
        ]);
        setChallenge(challengeRes.data);
        if (joinRes.data.length > 0) {
          setIsJoined(true);
          const progressRes = await api.get(
            `/UserChallengeProgress?userId=${user.id}&challengeId=${id}`
          );
          if (progressRes.data.length > 0) {
            const p = progressRes.data[0];
            setProgress(p);
            setActiveWeek((p.currentWeek || 1) - 1);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // join challenge
  const handleJoin = async () => {
    if (!user || joining) return;
    setJoining(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await api.post("/UserChallenges", {
        userId: user.id,
        challengeId: id,
        joinedDate: today,
      });
      const progressRes = await api.post("/UserChallengeProgress", {
        userId: user.id,
        challengeId: id,
        joinedDate: today,
        currentWeek: 1,
        completedWeeks: [],
        completedDays: [],
        percentComplete: 0,
        streak: 0,
        pointsEarned: 0,
      });
      setIsJoined(true);
      setProgress(progressRes.data);
      setActiveWeek(0);
      showToast("Successfully joined the challenge! 🎉");
    } catch (err) {
      console.error(err);
      showToast("Failed to join. Please try again.", "error");
    } finally {
      setJoining(false);
    }
  };

  // log today's workout
  const handleMarkDay = async () => {
  if (!progress || updating) return;
  setUpdating(true);
  try {
    const today = new Date().toISOString().split("T")[0];
    if (progress.completedDays.includes(today)) {
      showToast("Today's workout already logged ✓", "info");
      setUpdating(false);
      return;
    }

    const newDays = [...progress.completedDays, today];
    const newPercent = Math.min(
      Math.round((newDays.length / challenge.duration) * 100),
      100
    );
    const newWeek = Math.min(
      Math.ceil(newDays.length / 5) || 1,
      challenge.roadmap.length
    );
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().split("T")[0];
    const newStreak = progress.completedDays.includes(yStr)
      ? progress.streak + 1
      : 1;
    const newCompletedWeeks = [];
    for (let w = 1; w <= challenge.roadmap.length; w++) {
      if (newDays.length >= w * 5) newCompletedWeeks.push(w);
    }

    const updated = {
      ...progress,
      completedDays: newDays,
      currentWeek: newWeek,
      completedWeeks: newCompletedWeeks,
      percentComplete: newPercent,
      streak: newStreak,
      pointsEarned: progress.pointsEarned + 10,
    };

    //  Update progress + user totalPoints 
    await Promise.all([
      api.put(`/UserChallengeProgress/${progress.id}`, updated),
      api.put(`/user/${user.id}`, {
        ...user,
        totalPoints: (user.totalPoints || 0) + 10,
      }),
    ]);

    // Keep localStorage in sync 
    const updatedUser = { ...user, totalPoints: (user.totalPoints || 0) + 10 };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    setProgress(updated);
    setActiveWeek(newWeek - 1);
    showToast(`+10 pts! 🔥 Streak: ${newStreak} day${newStreak > 1 ? "s" : ""}`);
  } catch (err) {
    console.error(err);
    showToast("Failed to update progress.", "error");
  } finally {
    setUpdating(false);
  }
};

  if (!challenge) {
    return (
      <div className="sc-loading">
        <div className="sc-spinner" />
        <p>Loading challenge...</p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const alreadyLoggedToday = progress?.completedDays?.includes(todayStr);
  const currentWeekData = challenge.roadmap[activeWeek];

  return (
    <>
      <AppNavbar />

      {toast && (
        <div className={`sc-toast sc-toast--${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="sc-page">

        {/* HERO */}
        <section className="sc-hero">
          <img src={challenge.heroImage} alt="" className="sc-hero-bg" />
          <div className="sc-hero-overlay" />
          <div className="sc-hero-content">
            <div className="sc-tags">
              {challenge.tags?.map((tag, i) => (
                <span key={i} className="sc-tag">{tag}</span>
              ))}
              {isJoined && (
                <span className="sc-tag sc-tag--joined">✓ Joined</span>
              )}
            </div>
            <h1>{challenge.title}</h1>
            <div className="sc-coach-row">
              <img
                src={challenge.coach?.avatar}
                alt=""
                className="sc-avatar"
              />
              <span>
                with <strong>{challenge.coach?.name}</strong>
              </span>
              <span className="sc-rating">
                ⭐ {challenge.rating?.value}
                <small> ({challenge.rating?.reviews?.toLocaleString()} reviews)</small>
              </span>
            </div>
          </div>
        </section>

        {/* BODY */}
        <div className="sc-body">

          {/* LEFT */}
          <div className="sc-left">

            {/* Progress Panel — joined only */}
            {isJoined && progress && (
              <div className="sc-progress-panel">
                <div className="sc-progress-header">
                  <h2>Your Progress</h2>
                  <button
                    className={`sc-log-btn ${alreadyLoggedToday ? "sc-log-btn--done" : ""}`}
                    onClick={handleMarkDay}
                    disabled={updating || alreadyLoggedToday}
                  >
                    {alreadyLoggedToday
                      ? "✓ Today Logged"
                      : updating
                      ? "Saving..."
                      : "+ Log Today's Workout"}
                  </button>
                </div>

                <div className="sc-prog-bar-wrap">
                  <div className="sc-prog-bar-track">
                    <div
                      className="sc-prog-bar-fill"
                      style={{ width: `${progress.percentComplete}%` }}
                    />
                  </div>
                  <span>{progress.percentComplete}% Complete</span>
                </div>

                <div className="sc-stats-row">
                  <div className="sc-stat">
                    <strong>{progress.completedDays?.length || 0}</strong>
                    <span>Days Done</span>
                  </div>
                  <div className="sc-stat">
                    <strong>{progress.streak || 0} 🔥</strong>
                    <span>Day Streak</span>
                  </div>
                  <div className="sc-stat">
                    <strong>Week {progress.currentWeek}</strong>
                    <span>Current Week</span>
                  </div>
                  <div className="sc-stat">
                    <strong>{progress.pointsEarned} pts</strong>
                    <span>Points Earned</span>
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Schedule — joined only */}
            {isJoined && (
              <div className="sc-schedule-section">
                <h2>Weekly Schedule</h2>

                <div className="sc-week-tabs">
                  {challenge.roadmap.map((week, i) => {
                    const isCompleted = progress?.completedWeeks?.includes(week.week);
                    const isCurrent = progress?.currentWeek === week.week;
                    return (
                      <button
                        key={i}
                        className={`sc-week-tab
                          ${activeWeek === i ? "active" : ""}
                          ${isCompleted ? "completed" : ""}
                          ${isCurrent && !isCompleted ? "current" : ""}
                        `}
                        onClick={() => setActiveWeek(i)}
                      >
                        {isCompleted ? "✓ " : ""}Week {week.week}
                      </button>
                    );
                  })}
                </div>

                {currentWeekData && (
                  <div className="sc-days-grid">
                    {currentWeekData.days.map((day, i) => (
                      <div
                        key={i}
                        className={`sc-day-card ${day.type === "rest" ? "sc-day-card--rest" : ""}`}
                      >
                        <div className="sc-day-header">
                          <span className="sc-day-num">Day {day.day}</span>
                          {day.type === "rest" ? (
                            <span className="sc-rest-badge">Rest</span>
                          ) : (
                            <span className="sc-workout-badge">Workout</span>
                          )}
                        </div>
                        <p className="sc-day-name">{day.name}</p>
                        {day.type === "workout" && (
                          <div className="sc-day-meta">
                            <span>🔁 {day.sets} sets</span>
                            <span>📊 {day.reps}</span>
                          </div>
                        )}
                        {day.type === "rest" && (
                          <p className="sc-rest-msg">
                            Recovery is part of progress.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Roadmap */}
            <div className="sc-roadmap-section">
              <h2>The Journey Roadmap</h2>
              <div
                className="sc-roadmap-card"
                style={{
                  gridTemplateColumns: `repeat(${challenge.roadmap.length}, 1fr)`,
                }}
              >
                <div className="sc-progress-line" />
                {challenge.roadmap.map((week, i) => {
                  const isCompleted = progress?.completedWeeks?.includes(week.week);
                  const isCurrent =
                    progress?.currentWeek === week.week && isJoined;
                  return (
                    <div key={i} className="sc-roadmap-step">
                      <div
                        className={`sc-circle ${
                          isCompleted
                            ? "completed"
                            : isCurrent
                            ? "current"
                            : "locked"
                        }`}
                      >
                        {isCompleted ? "✓" : isCurrent ? week.week : "🔒"}
                      </div>
                      <p className="sc-week-label">Week {week.week}</p>
                      <small>{week.title}</small>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* About + Rules */}
            <div className="sc-about-rules">
              <div className="sc-about">
                <h2>About the Challenge</h2>
                <p>{challenge.overview?.short}</p>
                <p>{challenge.overview?.long}</p>
              </div>
              <div className="sc-rules">
                <h2>Program Rules</h2>
                <ul>
                  {challenge.rules?.map((rule, i) => (
                    <li key={i}>✔ {rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Benefits */}
            <div className="sc-benefits">
              <h2>What You'll Achieve</h2>
              <div className="sc-benefits-grid">
                {challenge.benefits?.map((b, i) => (
                  <div key={i} className="sc-benefit-card">
                    <h4>{b.title}</h4>
                    <p>{b.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="sc-right">
            <div className="sc-sticky-card">
              {!isJoined ? (
                <button
                  className="sc-join-btn"
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joining ? "Joining..." : "Join Challenge →"}
                </button>
              ) : (
                <div className="sc-joined-badge">✓ You're In!</div>
              )}

              <div className="sc-info-grid">
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
                  <strong>{challenge.participants?.toLocaleString()}</strong>
                </div>
                <div>
                  <span>Equipment</span>
                  <strong>{challenge.equipment}</strong>
                </div>
              </div>

              {isJoined && progress && (
                <div className="sc-joined-since">
                  <span>Joined on</span>
                  <strong>
                    {new Date(progress.joinedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </div>
              )}
            </div>

            <div className="sc-included-card">
              <h3>What's Included</h3>
              {challenge.included?.map((item, i) => (
                <div key={i} className="sc-included-item">
                  <span className="sc-check">✔</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SingleChallenge;