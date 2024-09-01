import { React, isValidElement } from "react";
import CopyButton from "./CopyButton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypePrism from "@mapbox/rehype-prism";
import "prismjs/themes/prism-tomorrow.css";

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
              rehypePlugins={[rehypePrism]}
              components={{
                pre({ children }) {
                  const extractText = (child) => {
                    if (typeof child === "string") {
                      return child;
                    }
                    if (isValidElement(child)) {
                      return extractText(child.props.children);
                    }
                    if (Array.isArray(child)) {
                      return child.map(extractText).join("");
                    }
                    return "";
                  };

                  const codeText = extractText(children);

                  return (
                    <div className="relative rounded-xl">
                      <pre>{children}</pre>
                      <CopyButton
                        text={codeText}
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
