"use client";

import React, { useRef, useState } from "react";

function isRTL(text: string) {
  return /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text);
}

export interface InfoCardProps {
  image?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: readonly (readonly [string, string])[];
  width?: number;
  height?: number | "auto";
  borderColor?: string;
  borderBgColor?: string;
  borderWidth?: number;
  borderPadding?: number;
  cardBgColor?: string;
  shadowColor?: string;
  patternColor1?: string;
  patternColor2?: string;
  textColor?: string;
  hoverTextColor?: string;
  fontFamily?: string;
  rtlFontFamily?: string;
  effectBgColor?: string;
  contentPadding?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  image,
  icon,
  title,
  description,
  features,
  width = 388,
  height = 378,
  borderColor = "#DAFF3E",
  borderBgColor = "#242424",
  borderWidth = 3,
  borderPadding = 14,
  cardBgColor = "#000",
  patternColor1 = "rgba(230,230,230,0.15)",
  patternColor2 = "rgba(240,240,240,0.15)",
  textColor = "#f5f5f5",
  hoverTextColor = "#242424",
  fontFamily = "'Roboto Mono', monospace",
  rtlFontFamily = "'Montserrat', sans-serif",
  effectBgColor = "#DAFF3E",
  contentPadding = "10px 16px",
}) => {
  const [hovered, setHovered] = useState(false);
  const borderRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const border = borderRef.current;
    if (!border) return;
    const rect = border.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    border.style.setProperty("--rotation", `${angle}rad`);
  };

  const rtl = isRTL(title) || isRTL(description);
  const effectiveFont = rtl ? rtlFontFamily : fontFamily;
  const titleDirection = isRTL(title) ? "rtl" : "ltr";
  const descDirection = isRTL(description) ? "rtl" : "ltr";

  const innerWidth = 354;

  const pattern =
    `linear-gradient(45deg, ${patternColor1} 25%, transparent 25%, transparent 75%, ${patternColor2} 75%),` +
    `linear-gradient(-45deg, ${patternColor2} 25%, transparent 25%, transparent 75%, ${patternColor1} 75%)`;

  const borderGradient = `conic-gradient(from var(--rotation,0deg), ${borderColor} 0deg, ${borderColor} 90deg, ${borderBgColor} 90deg, ${borderBgColor} 360deg)`;

  return (
    <div
      ref={borderRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (borderRef.current) borderRef.current.style.setProperty("--rotation", "0deg");
      }}
      style={{
        width,
        height: height === "auto" ? "auto" : height,
        border: `${borderWidth}px solid transparent`,
        borderRadius: "1em",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        backgroundImage: `linear-gradient(${cardBgColor}, ${cardBgColor}), ${borderGradient}`,
        padding: borderPadding,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "box-shadow 0.3s",
        position: "relative",
        fontFamily: effectiveFont,
      } as React.CSSProperties}
    >
      <div
        style={{
          width: innerWidth,
          minHeight: height === "auto" ? 300 : undefined,
          borderRadius: "1em",
          background: cardBgColor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundImage: pattern,
          backgroundSize: "20.84px 20.84px",
          padding: "0 0 8px 0",
        }}
      >
        {icon ? (
          <div style={{ padding: "20px 16px 0" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 6,
                background: `${effectBgColor}22`,
                color: effectBgColor,
              }}
            >
              {icon}
            </span>
          </div>
        ) : image ? (
          <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
            <img
              src={image}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ) : null}

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            padding: contentPadding,
            minHeight: 0,
          }}
        >
          <h1
            style={{
              fontSize: 21,
              fontWeight: "bold",
              letterSpacing: "-.01em",
              lineHeight: "normal",
              marginBottom: 5,
              marginTop: icon ? 10 : 0,
              color: hovered ? hoverTextColor : textColor,
              transition: "color 0.3s ease",
              position: "relative",
              overflow: "hidden",
              direction: titleDirection,
              width: "auto",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 10,
                padding: "2px 4px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {title}
            </span>
            <span
              style={{
                clipPath: hovered
                  ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                  : "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
                transformOrigin: "center",
                transition: "all cubic-bezier(.1,.5,.5,1) 0.4s",
                position: "absolute",
                left: -4,
                right: -4,
                top: -4,
                bottom: -4,
                zIndex: 0,
                backgroundColor: effectBgColor,
              }}
            />
          </h1>

          <p
            style={{
              fontSize: 14,
              color: textColor,
              direction: descDirection,
              marginBottom: features ? 12 : 0,
              opacity: 0.85,
            }}
          >
            {description}
          </p>

          {features && (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, borderTop: `1px solid ${borderColor}33` }}>
              {features.map(([name, desc]) => (
                <li
                  key={name}
                  style={{
                    padding: "8px 0",
                    borderBottom: `1px solid ${borderColor}1a`,
                    fontSize: 12.5,
                  }}
                >
                  <span style={{ fontWeight: 600, color: textColor }}>{name}</span>
                  <span style={{ display: "block", color: textColor, opacity: 0.65, marginTop: 2 }}>{desc}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};