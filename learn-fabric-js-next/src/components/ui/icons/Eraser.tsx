"use client";

import React from "react";

interface EraserIconProps {
  className?: string;
}

const Eraser: React.FC<EraserIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M16.24 3.56l4.95 4.94c.78.79.78 2.05 0 2.83l-9.93 9.94a2 2 0 0 1-2.83 0l-4.95-4.94a2 2 0 0 1 0-2.83L13.41 3.56a2 2 0 0 1 2.83 0z" />
      <line
        x1="14"
        y1="11"
        x2="3"
        y2="22"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
};

export default Eraser;
