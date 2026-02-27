import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./AICoach.css";
import AppNavbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer"

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

const AICoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(1); 
  const chatEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

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
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      text: input,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (stage === 1) {
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Nice! Are you ready to get moving today? 💪",
            time: getTime(),
          },
        ]);
      }, 500);

      setStage(2);
      return;
    }

    if (stage === 2) {
      await generateWorkout();
      setStage("chat");
      return;
    }
    if (stage === "chat") {
      await generateWorkout(); 
      return;
    }
  };
  const generateWorkout = async () => {
    setLoading(true);

    try {
      const prompt = `
        You are a fitness coach.

        User name: ${user?.name}
        User request: ${input}

        Suggest ONE workout.
        Format cleanly.
        No markdown symbols.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      text = text.replace(/\*\*/g, "");

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text,
          time: getTime(),
        },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <>
    <AppNavbar/>
    <div className="ai-container">
      <div className="ai-header">
        <h2>AI Workout Assistant</h2>
        <p>Hyper-personalized recommendations powered by AI.</p>
      </div>

      <div className="chat-card">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div>{msg.text}</div>
              <span className="time">{msg.time}</span>
            </div>
          ))}

          {loading && (
            <div className="message ai">Preparing your workout...</div>
          )}

          <div ref={chatEndRef}></div>
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
    <Footer/>
  </>
  );
};

export default AICoach;