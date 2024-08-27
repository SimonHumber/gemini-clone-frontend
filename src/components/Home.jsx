import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks"; //so that line breaks in prompts show
import sendArrow from "../assets/sendarrow.png";
import CopyButton from "./CopyButton";
import "./styles.css";

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const messagesEndRef = useRef(null); // Create a ref for auto scrolling

  const handleSubmit = () => {
    console.log(prompt);
    setMessageHistory([...messageHistory, prompt]);

    try {
      // Create a Socket.IO connection
      const socket = io("http://localhost:8080");
      setPrompt(""); //clear prompt after sending

      socket.on("connect", () => {
        console.log("Connected to server");
        socket.send(prompt); // Sending a prompt
      });

      //custom event, backend emits response
      socket.on("response", (data) => {
        console.log("Received:", data);
        setMessageHistory((prevHistory) => [...prevHistory, data]); //append response to message history
        socket.close(); // Close the connection after receiving the response
      });

      //when socket is closed this will run
      socket.on("disconnect", () => {
        console.log("Connection closed");
      });

      //if backend is off, this will run
      socket.on("connect_error", (error) => {
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
      <div className="p-5gw-full md:w-8/12 lg:w-7/12 h-11/12 flex flex-col ">
        <header className="w-full text-3xl text-[#dadada] mb-5 text-center pb-10 border-b border-gray-600 m-auto">
          CPAN226CHAT
        </header>
        <div className="m-auto h-[70vh] w-full overflow-y-auto mb-2 text-[#d6d6d6] p-2 bg-[#212121]">
          {messageHistory.length > 0 ? (
            messageHistory.map((messageItem, index) => (
              <ReactMarkdown
                key={index}
                className="prose prose-invert mb-2 ml-auto mr-auto p-4 rounded-xl bg-[#121212] text-left"
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  pre({ children }) {
                    //TODO put a title above codeblock
                    return (
                      <div className="relative rounded-xl">
                        <pre>{children}</pre>
                        <CopyButton text={children.props.children} />
                      </div>
                    );
                  },
                }}
              >
                {messageItem}
              </ReactMarkdown>
            ))
          ) : (
            <div>No messages yet.</div>
          )}
          {/*TODO replace this empty div. invisible div to scroll down to on new message*/}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full m-auto flex items-center pt-2 border-t border-[#a5a5a5]">
          <textarea
            className="w-full p-2 pl-5 mr-1 bg-[#121212] text-[#fbfbfb] text-xl rounded-full"
            placeholder="Ask ChatGPT..."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={handleEnterKey}
            rows="2"
            style={{ resize: "none" }}
            aria-label="Enter prompt here"
          />
          <button
            id="send"
            className={`p-1 ${
              prompt === ""
                ? "opacity-20 cursor-default"
                : "hover:brightness-50"
            }`}
            onClick={handleSubmit}
            disabled={prompt === ""}
            aria-label="Send message"
          >
            <img src={sendArrow} alt="Send" className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
