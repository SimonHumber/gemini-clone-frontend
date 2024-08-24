import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import sendArrow from "../assets/sendarrow.png";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const messagesEndRef = useRef(null); // Create a ref for scrolling

  const handleSubmit = () => {
    setMessageHistory([...messageHistory, prompt]);

    try {
      // Create a Socket.IO connection
      const socket = io("http://localhost:8080");

      socket.on("connect", () => {
        console.log("Connected to server");
        socket.send(prompt); // Sending a prompt
        setPrompt(""); //clear prompt after sending
      });

      socket.on("response", (data) => {
        console.log("Received:", data);
        setMessageHistory((prevHistory) => [...prevHistory, data]); //append response to message history
        socket.close(); // Close the connection after receiving the response
      });

      socket.on("disconnect", () => {
        console.log("Connection closed");
      });

      socket.on("error", (error) => {
        console.error("Socket.IO Error:", error);
      });

      // Await the response from the promise
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      handleSubmit(); // Call submit function
    }
  };
  useEffect(() => {
    // Scroll to bottom whenever messageHistory changes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);
  return (
    <div>
      <header className="chat-header">CPAN226CHAT</header>
      <div className="chat-container">
        <div id="messages-container">
          {messageHistory.length > 0 ? (
            messageHistory.map((messageItem, index) => (
              <div id="messages">
                <ReactMarkdown
                  key={index}
                  id="messages"
                  remarkPlugins={[remarkGfm]}
                >
                  {messageItem}
                </ReactMarkdown>
              </div>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
          {/*invisible div to scroll down to on new message*/}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <textarea
            id="message"
            className="message-input"
            placeholder="Ask ChatGPT..."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleKeyDown} // Handle key events
            rows="2" // Adjust rows as needed
            style={{ resize: "none" }} //remove resizing button on bottom right corner
          />
          <button
            id="send"
            className="message-button"
            onClick={handleSubmit}
            disabled={prompt === ""} //if textarea empty, cannot submit
          >
            <img src={sendArrow} alt="Send" className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
