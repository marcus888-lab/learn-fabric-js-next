"use client";

import React from "react";

interface CircleIconProps {
  className?: string;
}

const Circle: React.FC<CircleIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

export default Circle;
