import React from "react";
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge, isJoined = false }) => {
  const navigate = useNavigate();

  return (
    <div className="challenge-card" onClick={() => navigate(`/challenges/${challenge.id}`)}>

      {/* IMAGE */}
      <div className="challenge-image">
        <img
          src={challenge.image}
          alt={challenge.title}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
          }}
        />

        {/* NEW / TRENDING badge */}
        {challenge.tag && (
          <span className={`challenge-tag ${challenge.tag.toLowerCase()}`}>
            {challenge.tag}
          </span>
        )}

        {/* Joined overlay badge */}
        {isJoined && (
          <span className="challenge-joined-badge">✓ Joined</span>
        )}
      </div>

      {/* CONTENT */}
      <div className="challenge-content">
        <div className="challenge-category">{challenge.category}</div>
        <h3 className="challenge-title">{challenge.title}</h3>

        <div className="challenge-meta">
          <span>⏱ {challenge.duration} Days</span>
          <span>🎯 {challenge.level}</span>
          <span>👥 {challenge.joined?.toLocaleString()} joined</span>
        </div>

        
        <button
          className={`join-btn ${isJoined ? "joined" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/challenges/${challenge.id}`);
          }}
        >
          {isJoined ? "✓ Joined" : "Join Challenge →"}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;