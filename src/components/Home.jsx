import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Home = () => {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const handleSubmit = async () => {
    setMessageHistory([...messageHistory, message]);
    const flaskEndpoint = "http://localhost:8080/open_socket"; // Trigger the Flask endpoint

    try {
      // Trigger the Flask endpoint
      await axios.post(flaskEndpoint);

      // Create a Socket.IO connection
      const socket = io("http://localhost:8080"); // Correct WebSocket URL

      // Return a promise that resolves when the response is received
      const waitForResponse = new Promise((resolve, reject) => {
        socket.on("connect", () => {
          console.log("Connected to server");
          socket.send(message); // Sending a message
          setMessage(""); //clear prompt after sending message;
        });

        socket.on("response", (data) => {
          console.log("Received:", data);
          setMessageHistory((prevHistory) => [...prevHistory, data]);
          socket.close(); // Close the connection after receiving the response
          resolve(data); // Resolve the promise with the received data
        });

        socket.on("disconnect", () => {
          console.log("Connection closed");
        });

        socket.on("error", (error) => {
          console.error("Socket.IO Error:", error);
          reject(error); // Reject the promise if an error occurs
        });
      });

      // Await the response from the promise
      await waitForResponse;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div>
      <header className="chat-header">CPAN226CHAT</header>
      <div className="chat-container">
        <div id="messages-container">
          <div id="messages">test1</div>
          {messageHistory.length > 0 ? (
            messageHistory.map((messageItem, index) => (
              <ReactMarkdown
                key={index}
                id="messages"
                remarkPlugins={[remarkGfm]}
              >
                {messageItem}
              </ReactMarkdown>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            id="message"
            className="message-input"
            placeholder="Ask ChatGPT..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button id="send" className="message-button" onClick={handleSubmit}>
            {/* <img */}
            {/*   src="{{ url_for('static', filename='4414831.png') }}" */}
            {/*   alt="Send" */}
            {/*   className="send-icon" */}
            {/* /> */}
            enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
