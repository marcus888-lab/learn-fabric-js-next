"use client";

import React from "react";

interface BrushIconProps {
  className?: string;
}

const Brush: React.FC<BrushIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.37 2.63a1.414 1.414 0 0 0-2 0L11 8.99l-1.414-1.414a1.414 1.414 0 1 0-2 2L9 11l-5.36 5.36a2.5 2.5 0 0 0-.64 2.34l.67 2.68a.5.5 0 0 0 .61.61l2.68.67a2.5 2.5 0 0 0 2.34-.64L13 15l1.414 1.414a1.414 1.414 0 1 0 2-2L15 13l6.36-6.36a1.414 1.414 0 0 0 0-2z" />
    </svg>
  );
};

export default Brush;
