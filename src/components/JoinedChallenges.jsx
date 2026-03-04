import React, { useEffect, useState } from "react";
import api from "../services/api";
import ChallengeCard from "../features/challenges/ChallengeCard";
import "./JoinedChallenges.css";

const JoinedChallenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJoinedChallenges = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        
        const [userChallengesRes, challengesRes] = await Promise.all([
          api.get(`/UserChallenges?userId=${user.id}`).catch((err) => {
            if (err.response?.status === 404) return { data: [] };
            throw err;
          }),
          api.get("/Challenges"),
        ]);

        const joinedIds = userChallengesRes.data.map((uc) => String(uc.challengeId));
        const filtered = challengesRes.data.filter((c) =>
          joinedIds.includes(String(c.id))
        );

        setJoinedChallenges(filtered);
      } catch (error) {
        console.error("Error fetching joined challenges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedChallenges();
  }, []);

  return (
    <div className="joined-section">
      <h2>My Joined Challenges</h2>

      {loading ? (
        <p className="joined-empty">Loading...</p>
      ) : joinedChallenges.length === 0 ? (
        <p className="joined-empty">You haven't joined any challenges yet.</p>
      ) : (
        <div className="joined-grid">
          {joinedChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isJoined={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JoinedChallenges;