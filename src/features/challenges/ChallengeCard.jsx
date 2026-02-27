import React from "react";
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({ challenge, isJoined = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/challenges/${challenge.id}`);
  };

  return (
    <div className="challenge-card">

      {/* IMAGE SECTION */}
      <div className="challenge-image">
        <img
          src={challenge.image}
          alt={challenge.title}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x250?text=No+Image";
          }}
        />

        {/* TAG (NEW / TRENDING) */}
        {challenge.tag && (
          <span
            className={`challenge-tag ${challenge.tag.toLowerCase()}`}
          >
            {challenge.tag}
          </span>
        )}
      </div>

      {/* CONTENT SECTION */}
      <div className="challenge-content">

        <div className="challenge-category">
          {challenge.category}
        </div>

        <h3 className="challenge-title">
          {challenge.title}
        </h3>

        <div className="challenge-meta">
          <span>{challenge.duration} Days</span>
          <span>{challenge.level}</span>
          <span>{challenge.joined} joined</span>
        </div>

        <button
  className={`join-btn ${isJoined ? "Joined" : ""}`}
>
  {isJoined ? "✓ Joined" : "Join Challenge"}
</button>

      </div>

    </div>
  );
};

export default ChallengeCard;