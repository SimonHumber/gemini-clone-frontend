import React, { useRef, useState } from "react";
import sendArrow from "../assets/sendarrow.png";
import { IoIosAttach } from "react-icons/io";

const Inputs = ({
  className,
  handleEnterKey,
  handleSubmit,
  setPrompt,
  prompt,
  socketOn,
  handleStop,
  handleUpload,
}) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={className}>
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />
      <button onClick={triggerFileInput}>
        <IoIosAttach className="w-7 h-7 ml-2 mr-2" color="white" />
      </button>
      {socketOn ? (
        <button
          id="stop"
          className="p-1 text-white"
          onClick={handleStop}
          aria-label="Stop Generating Response"
        >
          STOP
        </button>
      ) : (
        <button
          id="send"
          className={`p-1 ${
            prompt === "" ? "opacity-20 cursor-default" : "hover:brightness-50"
          }`}
          onClick={handleSubmit}
          disabled={prompt === ""}
          aria-label="Send message"
        >
          <img src={sendArrow} alt="Send" className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default Inputs;
