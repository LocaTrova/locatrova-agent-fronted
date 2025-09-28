import React, { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  interval?: number; // ms
  className?: string;
}

export default function RotatingWord({
  words,
  interval = 1800,
  className,
}: RotatingWordProps) {
  const safeWords = words && words.length > 0 ? words : [""];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Clamp index when words array length changes
    setIndex(prev => Math.min(prev, Math.max(0, safeWords.length - 1)));
  }, [safeWords.length]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % safeWords.length);
    }, interval);
    return () => clearInterval(id);
  }, [safeWords.length, interval]);

  return (
    <span
      className={className ?? "inline-block"}
      aria-live="polite"
      aria-atomic="true"
    >
      {safeWords[index]}
    </span>
  );
}
