import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

const CopyButton = ({ text, className }) => {
  return (
    <CopyToClipboard text={text} className={className}>
      <button>
        <FaCopy />
      </button>
    </CopyToClipboard>
  );
};

export default CopyButton;
