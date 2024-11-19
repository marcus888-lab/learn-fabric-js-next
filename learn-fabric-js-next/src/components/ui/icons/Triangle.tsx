"use client";

import React from "react";

interface TriangleIconProps {
  className?: string;
}

const Triangle: React.FC<TriangleIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <polygon points="12 2 2 22 22 22" />
    </svg>
  );
};

export default Triangle;
