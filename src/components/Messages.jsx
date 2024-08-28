import React from "react";
import CopyButton from "./CopyButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const Messages = ({ messageHistory, messagesEndRef, className }) => {
  return (
    <div className={className}>
      {messageHistory.length > 0 ? (
        messageHistory.map((messageObject, index) => (
          <div className="mb-2" key={index}>
            <ReactMarkdown
              className={`prose prose-invert p-4 rounded-xl break-words overflow-wrap-anywhere
          ${messageObject.role === "user" ? "bg-[#444444] w-fit ml-auto" : "bg-none text-left"}`}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                pre({ children }) {
                  return (
                    <div className="relative rounded-xl">
                      <pre>{children}</pre>
                      <CopyButton
                        text={children.props.children}
                        className="absolute top-2 right-2"
                      />
                    </div>
                  );
                },
              }}
            >
              {messageObject.parts[0]}
            </ReactMarkdown>
            {messageObject.role === "model" ? (
              <CopyButton text={messageObject.parts[0]} className="mb-5 ml-4" />
            ) : null}
          </div>
        ))
      ) : (
        <div>No messages yet.</div>
      )}
      {/*TODO replace this empty div. invisible div to scroll down to on new message*/}
      <div ref={messagesEndRef} />
    </div>
  );
};
export default Messages;
