import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FaCopy } from "react-icons/fa";

const CopyButton = ({ text }) => {
  return (
    <CopyToClipboard text={text}>
      <button className="absolute top-2 right-2 bg-gray-700 text-white rounded hover:bg-gray-600 focus:outline-none">
        <FaCopy />
      </button>
    </CopyToClipboard>
  );
};

export default CopyButton;
