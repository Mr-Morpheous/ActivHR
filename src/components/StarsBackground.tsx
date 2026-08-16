import React from "react";

interface StarsBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const StarsBackground = ({ children, className }: StarsBackgroundProps) => {
  return (
    <div className={className}>
      <div className="stars-container">
        <div id="stars" />
        <div id="stars2" />
        <div id="stars3" />
        <div className="content-layer">{children}</div>
      </div>
    </div>
  );
};

export default StarsBackground;
