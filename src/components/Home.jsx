import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./styles.css";
import Messages from "./Messages";
import Inputs from "./Inputs";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const messagesEndRef = useRef(null); // Create a ref for auto scrolling

  const handleSubmit = () => {
    console.log(prompt);
    var promptObject = { role: "user", parts: [prompt] };
    setMessageHistory([...messageHistory, promptObject]);

    try {
      // Create a Socket.IO connection
      const socket = io("http://localhost:8080");
      setPrompt(""); //clear prompt after sending

      socket.on("connect", () => {
        console.log("Connected to server");
        socket.send(promptObject); // Sending a prompt
      });

      //custom event, backend emits response
      socket.on("response", (data) => {
        console.log("Received:", data);
        var responseObject = { role: "model", parts: [data] };
        setMessageHistory((prevHistory) => [...prevHistory, responseObject]); //append response to message history
        socket.close(); // Close the connection after receiving the response
      });

      //when socket is closed this will run
      socket.on("disconnect", () => {
        console.log("Connection closed");
      });

      //if backend is off, this will run
      socket.on("connect_error", (error) => {
        socket.close();
        console.error(error);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEnterKey = (event) => {
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
    <div className="font-sans bg-[#212121] flex flex-col items-center h-screen m-0">
      <div className="p-5gw-full md:w-8/12 lg:w-7/12 h-11/12 flex flex-col mt-3">
        <header className="w-full text-3xl text-[#dadada] mb-5 text-center pb-5 border-b border-gray-600 m-auto">
          CPAN226CHAT
        </header>
        <Messages
          className="m-auto h-[75vh] w-full overflow-y-auto mb-2 text-[#d6d6d6] p-2 bg-[#212121]"
          messageHistory={messageHistory}
          messagesEndRef={messagesEndRef}
        />
        <Inputs
          className="w-full m-auto flex items-center pt-2 border-t border-[#a5a5a5]"
          handleEnterKey={handleEnterKey}
          handleSubmit={handleSubmit}
          setPrompt={setPrompt}
          prompt={prompt}
        />
      </div>
    </div>
  );
};

export default Home;
