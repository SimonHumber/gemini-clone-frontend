import React, { useRef, useState, useEffect } from "react";
import sendArrow from "../assets/sendarrow.png";
import { IoIosAttach } from "react-icons/io";

const TextArea = ({ promptRef, handleEnterKey, className, handleSubmit }) => {
  const [prompt, setPrompt] = useState("");
  const textAreaRef = useRef(null);

  useEffect(() => {
    // Reset height to auto so that it shrinks when needed
    textAreaRef.current.style.height = "auto";

    // Calculate the height for 4 rows of text (approximate)
    const lineHeight = parseInt(
      window.getComputedStyle(textAreaRef.current).lineHeight,
      10,
    );
    const maxHeight = lineHeight * 4; // Height for 4 rows

    // Set height to scrollHeight to adjust the height based on content
    textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, maxHeight)}px`;

    // Set a maxHeight to ensure it doesn't grow beyond 4 rows
    textAreaRef.current.style.overflowY =
      textAreaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [prompt, handleSubmit]);

  return (
    <textarea
      ref={textAreaRef}
      className={className}
      placeholder="Ask ChatGPT..."
      value={promptRef.current}
      onChange={(event) => {
        promptRef.current = event.target.value;
        setPrompt(event.target.value);
      }}
      onKeyDown={handleEnterKey}
      style={{ resize: "none" }}
      aria-label="Enter prompt here"
      rows="1"
    />
  );
};
const Inputs = ({
  className,
  handleEnterKey,
  handleSubmit,
  socketOn,
  handleStop,
  handleUpload,
  promptRef,
  files,
  filePreview,
}) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  //refer to api documentation if they ever add more file support
  const imageFiles = ".png, .jpg, .jpeg, .webp, .heic, .heif";
  const videoFiles = ".mp4, .mpg, .mpeg, .mov, .avi, .flv, .webm, .wmv, .3gp";
  const audioFiles = ".wav, .mp3, .aiff, .aif, .aac, .ogg, .flac";
  const docFiles = ".pdf";
  const acceptedFiles =
    videoFiles + ", " + imageFiles + ", " + audioFiles + ", " + docFiles;

  return (
    <div className={className}>
      <div className="flex flex-col w-full">
        <div className="flex">
          {filePreview.map((file, index) => (
            <img src={file} className="w-10 h-10" />
          ))}
        </div>
        <TextArea
          promptRef={promptRef}
          handleEnterKey={handleEnterKey}
          handleSubmit={handleSubmit}
          className="p-2 pl-5 mt-3 mr-1 bg-[#121212] text-[#fbfbfb] text-xl rounded-3xl resize-none"
        />
      </div>
      <input
        type="file"
        accept={acceptedFiles}
        ref={fileInputRef}
        onChange={handleUpload}
        hidden
        multiple
      />
      <button onClick={triggerFileInput} aria-label="Upload file">
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
            promptRef === "" || files.length === 0
              ? "opacity-20 cursor-default"
              : "hover:brightness-50"
          }`}
          onClick={handleSubmit}
          disabled={promptRef === ""}
          aria-label="Send message"
        >
          <img
            src={sendArrow}
            alt="Send"
            className="w-7 h-7"
            aria-label="Send prompt"
          />
        </button>
      )}
    </div>
  );
};

export default Inputs;
