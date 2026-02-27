import React, { useEffect, useState } from "react";
import api from "../services/api";
import ChallengeCard from "../features/challenges/ChallengeCard"; 

const JoinedChallenges = () => {
  const [joinedChallenges, setJoinedChallenges] = useState([]);

  useEffect(() => {
    const fetchJoinedChallenges = async () => {
      try {
        //to check which are joined
        const detailsRes = await api.get("/challengeDetails");

        const joinedDetails = detailsRes.data.filter(
          (item) => item.status === "Joined"
        );

        const joinedIds = joinedDetails.map((item) => item.id);

        if (joinedIds.length === 0) {
          setJoinedChallenges([]);
          return;
        }

        // to Get all challenges
        const challengesRes = await api.get("/Challenges");

        // Filters only joined ones
        const filtered = challengesRes.data.filter((challenge) =>
          joinedIds.includes(challenge.id)
        );

        setJoinedChallenges(filtered);

      } catch (error) {
        console.error("Error fetching joined challenges:", error);
      }
    };

    fetchJoinedChallenges();
  }, []);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>My Joined Challenges</h2>

      {joinedChallenges.length === 0 ? (
        <p>You haven’t joined any challenges yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
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