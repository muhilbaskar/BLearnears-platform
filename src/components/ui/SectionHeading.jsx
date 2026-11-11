import React from "react";
import { m } from "framer-motion"; // `m` + LazyMotion (set up in App.jsx) = smaller bundle

const GRADIENT = "linear-gradient(128.51deg, #CB02FF 18.44%, #C402FF 33.03%, #4A54ED 83.76%)";

// Styles hoisted to module scope: no new objects on every render
const featuresBadgeWrap = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: "3.8px 11.8px",
  gap: "8px",
  background: "#FFFFFF",
  border: "1px solid #E2E4EF",
  borderRadius: "26843500px",
  height: "25.6px",
  marginBottom: "16px",
};
const featuresDot = { width: "6px", height: "6px", borderRadius: "50%", background: GRADIENT, flexShrink: 0 };
const featuresBadgeText = {
  fontFamily: "Manrope, sans-serif",
  fontWeight: 600,
  fontSize: "12px",
  lineHeight: "16px",
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  textAlign: "center",
  background: GRADIENT,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
  display: "inline-block",
};
const featuresTitle = {
  fontFamily: "Sora, sans-serif",
  fontWeight: 600,
  fontSize: "clamp(30px, 6vw, 48px)",
  lineHeight: "clamp(34px, 6.5vw, 48px)",
  letterSpacing: "-0.96px",
  textAlign: "center",
  color: "#111827",
  maxWidth: "800px",
  marginBottom: "16px",
};
const featuresSubtitle = {
  fontFamily: "Manrope, sans-serif",
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "28px",
  letterSpacing: "0px",
  textAlign: "center",
  color: "#6B7280",
  maxWidth: "600px",
};

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

function SectionHeading({ badge, title, subtitle, light = false, variant }) {
  const isFeatures = variant === "features";

  return (
    <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
      {badge && (
        <m.div
          {...fade}
          style={isFeatures ? featuresBadgeWrap : undefined}
          className={!isFeatures ? `font-semibold text-sm tracking-widest uppercase mb-2 block ${light ? "text-purple-400" : "text-purple-600"}` : undefined}
        >
          {isFeatures && <span style={featuresDot} />}
          <span style={isFeatures ? featuresBadgeText : undefined}>{badge}</span>
        </m.div>
      )}

      <m.h2
        {...fade}
        transition={{ delay: 0.1 }}
        style={isFeatures ? featuresTitle : undefined}
        className={!isFeatures ? `text-3xl md:text-4xl font-bold mb-4 ${light ? "text-white" : "text-gray-900"}` : undefined}
      >
        {title}
      </m.h2>

      {subtitle && (
        <m.p
          {...fade}
          transition={{ delay: 0.2 }}
          style={isFeatures ? featuresSubtitle : undefined}
          className={!isFeatures ? `max-w-2xl mx-auto ${light ? "text-gray-400" : "text-gray-600"}` : undefined}
        >
          {subtitle}
        </m.p>
      )}
    </div>
  );
}

export default React.memo(SectionHeading);
