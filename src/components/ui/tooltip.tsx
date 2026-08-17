"use client";

import * as React from "react";

type TooltipProps = {
  text: string;
  children: React.ReactNode;
  className?: string;
};

export function Tooltip({ text, children, className }: TooltipProps) {
  const [visible, setVisible] = React.useState(false);

  return (
    <span
      className={`relative inline-flex ${className || ""}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md"
        >
          {text}
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-foreground" />
        </span>
      )}
    </span>
  );
}
