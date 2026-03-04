import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./AICoach.css";
import AppNavbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";
import ChallengeCard from "../challenges/ChallengeCard";
import api from "../../services/api";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const AICoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1);
  const [challenges, setChallenges] = useState([]);
  const chatEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  
  useEffect(() => {
    api.get("/Challenges")
      .then((res) => setChallenges(res.data))
      .catch((err) => console.error("Failed to load challenges:", err));
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "ai",
        text: `Hi ${user?.name}! 👋 How are you feeling today?`,
        time: getTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input, time: getTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (stage === 1) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Nice! Tell me your fitness goal or what kind of workout you're looking for and I'll suggest the best challenges for you! 💪",
            time: getTime(),
          },
        ]);
      }, 500);
      setStage(2);
      return;
    }

    await generateRecommendation(input);
    if (stage === 2) setStage("chat");
  };

  const generateRecommendation = async (userInput) => {
    setLoading(true);
    try {
      
      const challengeList = challenges
        .map((c) => `ID:${c.id} | "${c.title}" | ${c.category} | ${c.level} | ${c.duration} days`)
        .join("\n");

      const prompt = `
You are a fitness coach assistant. A user is asking for workout help.

User name: ${user?.name}
User message: "${userInput}"

Here is the available challenge pool:
${challengeList}

Instructions:
1. Write a short, friendly coaching response (2-3 sentences, no markdown symbols).
2. Then on a NEW LINE write exactly: SUGGEST_IDS:[comma-separated challenge IDs]
   - Pick 1 to 3 challenge IDs that best match the user's goal/request.
   - Only use IDs from the list above.
   - If no challenge fits, write SUGGEST_IDS:none

Example format:
Based on your goal, here are some great options for you!
SUGGEST_IDS:3,7
      `.trim();

      const result = await model.generateContent(prompt);
      const raw = result.response.text().replace(/\*\*/g, "").trim();

      
      const idMatch = raw.match(/SUGGEST_IDS:([\d,none]+)/);
      const coachText = raw.replace(/SUGGEST_IDS:[\d,none]+/, "").trim();

      let suggestedChallenges = [];
      if (idMatch && idMatch[1] !== "none") {
        const ids = idMatch[1].split(",").map((id) => id.trim());
        suggestedChallenges = challenges.filter((c) => ids.includes(String(c.id)));
      }

      
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: coachText, time: getTime() },
      ]);

      
      if (suggestedChallenges.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "",
            time: getTime(),
            challenges: suggestedChallenges,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, I had trouble generating a response. Please try again!",
          time: getTime(),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <AppNavbar />
      <div className="ai-container">
        <div className="ai-header">
          <h2>AI Workout Assistant</h2>
          <p>Hyper-personalized recommendations powered by AI.</p>
        </div>

        <div className="chat-card">
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index}>
                
                {msg.text ? (
                  <div className={`message ${msg.role}`}>
                    <div>{msg.text}</div>
                    <span className="time">{msg.time}</span>
                  </div>
                ) : null}

               
                {msg.challenges && msg.challenges.length > 0 && (
                  <div className="ai-challenge-suggestions">
                    <p className="suggestion-label">Recommended for you ✨</p>
                    <div className="suggestion-cards">
                      {msg.challenges.map((challenge) => (
                        <ChallengeCard
                          key={challenge.id}
                          challenge={challenge}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="message ai">Finding the best challenges for you...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask AI Coach something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AICoach;