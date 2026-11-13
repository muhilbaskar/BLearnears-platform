import React from "react";

/**
 * TabletLoader
 * ------------
 * Pure-CSS loading animation that matches the look of loading.json
 * (8 dots orbiting and collapsing in a pink -> orange gradient).
 * No extra dependencies — safe drop-in for "inside tablet" loading states.
 *
 * Props:
 *   size  – outer box size in px (default 48)
 *   label – optional accessible label (default "Loading")
 */
export default function TabletLoader({ size = 48, label = "Loading" }) {
  return (
    <div
      className="tablet-loader"
      style={{ width: size, height: size }}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="tablet-loader-dot"
          style={{
            transform: `rotate(${i * 45}deg) translateY(-38%)`,
            animationDelay: `${i * 0.09}s`,
            background: `hsl(${320 - i * 18}, 100%, 65%)`,
          }}
        />
      ))}
    </div>
  );
}