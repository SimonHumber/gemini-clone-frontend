import React from "react";
import sendArrow from "../assets/sendarrow.png";

const Inputs = ({
  className,
  handleEnterKey,
  handleSubmit,
  setPrompt,
  prompt,
}) => {
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
    </div>
  );
};

export default Inputs;
