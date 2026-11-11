import React from "react";

// Marquee CSS now lives in index.css (was re-injected as a <style> tag on every render)
const MESSAGE =
  "Witness the Future of Education @ BTS, Bangalore · 17th – 19th Nov, 2026 in Hall 04";

const StatusBar = () => (
  <div
    className="
      flex items-center justify-center
      w-full min-h-[40px] py-2 lg:py-0
      box-border
      px-4 sm:px-8 lg:px-[140.4px]
      bg-[linear-gradient(128.51deg,#CB02FF_18.44%,#C402FF_33.03%,#4A54ED_83.76%)]
      text-white font-medium text-[12px] sm:text-[14px] tracking-wide
    "
  >
    {/* Location pin (stays fixed) */}
    <div className="flex items-center mr-2 shrink-0" aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>

    <div className="flex-1 overflow-hidden lg:flex-none">
      <div className="marquee-track flex w-max lg:w-auto">
        <span className="whitespace-nowrap pr-12 lg:pr-0">{MESSAGE}</span>
        {/* Duplicate for a seamless loop (hidden on desktop) */}
        <span aria-hidden="true" className="whitespace-nowrap pr-12 lg:hidden">
          {MESSAGE}
        </span>
      </div>
    </div>
  </div>
);

export default React.memo(StatusBar);
