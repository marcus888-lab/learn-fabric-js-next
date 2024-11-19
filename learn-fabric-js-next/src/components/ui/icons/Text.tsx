"use client";

import React from "react";

interface TextIconProps {
  className?: string;
}

const Text: React.FC<TextIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7V4h16v3M10 20h4M12 4v16" />
    </svg>
  );
};

export default Text;
