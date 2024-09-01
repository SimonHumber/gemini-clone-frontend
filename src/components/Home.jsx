import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./styles.css";
import Messages from "./Messages";
import Inputs from "./Inputs";

const Home = () => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [socketOn, setSocketOn] = useState(false);
  const [files, setFiles] = useState([]);
  const promptRef = useRef("");
  const messagesEndRef = useRef(null); // Create a ref for auto scrolling
  const socketRef = useRef(null);

  const handleSubmit = async () => {
    var promptObject = {
      role: "user",
      parts: [promptRef.current],
      hasFiles: false,
    };
    files.length > 0 && (promptObject.hasFiles = true);
    setMessageHistory([...messageHistory, promptObject]);
    if (files.length > 0) {
      var formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }
      await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });
    }
    promptRef.current = "";
    setFiles([]);

    try {
      // Create a Socket.IO connection
      socketRef.current = io("http://localhost:8080");

      socketRef.current.on("connect", () => {
        console.log("Connected to server");
        setSocketOn(true);
        socketRef.current.send(promptObject); // Sending a prompt
      });

      //custom event, backend emits response
      socketRef.current.on("response", (data) => {
        console.log("Received:", data);
        var responseObject = { role: "model", parts: [data] };
        setMessageHistory((prevHistory) => [...prevHistory, responseObject]); //append response to message history
        socketRef.current.close(); // Close the connection after receiving the response
      });

      //when socket is closed this will run
      socketRef.current.on("disconnect", () => {
        setSocketOn(false);
        console.log("Connection closed");
      });

      //if backend is off, this will run
      socketRef.current.on("connect_error", (error) => {
        socketRef.current.close();
        console.error(error);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStop = () => {
    socketRef.current.close();
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      handleSubmit(); // Call submit function
    }
  };

  const handleUpload = (e) => {
    setFiles(e.target.files);
  };

  useEffect(() => {
    // Scroll to bottom whenever messageHistory changes
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  return (
    <div className="font-sans bg-[#212121] flex flex-col items-center h-screen">
      <div className="w-full md:w-8/12 lg:w-7/12 h-11/12 flex flex-col mt-3">
        <header className="text-3xl text-[#dadada] mb-5 text-center pb-5 border-b border-gray-600">
          CPAN226CHAT
        </header>
        <Messages
          className="h-[75vh] overflow-y-auto text-[#d6d6d6] p-2 mb-3"
          messageHistory={messageHistory}
          messagesEndRef={messagesEndRef}
        />
        <Inputs
          className="flex pt-2 border-t border-[#a5a5a5]"
          handleEnterKey={handleEnterKey}
          handleSubmit={handleSubmit}
          socketOn={socketOn}
          socketRef={socketRef}
          handleStop={handleStop}
          setFile={setFiles}
          handleUpload={handleUpload}
          promptRef={promptRef}
          files={files}
        />
      </div>
    </div>
  );
};

export default Home;
