"use client";

import React from "react";

interface RectangleIconProps {
  className?: string;
}

const Rectangle: React.FC<RectangleIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    </svg>
  );
};

export default Rectangle;
