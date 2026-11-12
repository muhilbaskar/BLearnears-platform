import React, { useRef } from "react";
import { categories } from "../../data/content";
import useInViewport from "../../hooks/useInViewport";

// Marquee keyframes now live in index.css (no <style> injection on every render).

const CarouselRow = React.memo(function CarouselRow({ items, direction = "right" }) {
  // Tripled so the track always overflows for a seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden relative marquee-container">
      <div className="absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-[#F4F5F7] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-[#F4F5F7] to-transparent z-10 pointer-events-none" />

      <div className={`flex w-max gap-3 py-2 ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}>
        {tripled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            aria-hidden={index >= items.length ? "true" : undefined}
            className="flex items-center gap-3 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border border-slate-200 rounded-[2rem] text-[14px] sm:text-[16px] text-slate-800 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-purple-300 cursor-pointer transition-colors whitespace-nowrap"
          >
            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#D500FF] to-[#8D00FF] shadow-sm" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
});

export default function BoardsSection() {
  const ref = useRef(null);
  const inView = useInViewport(ref, { rootMargin: "50px" });

  return (
    <section ref={ref} className={`cv-auto pt-16 md:pt-24 pb-[30px] bg-[#F4F5F7] overflow-hidden ${inView ? "" : "is-paused"}`}>
      <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-['Sora'] text-[30px] sm:text-[42px] md:text-[52px] font-bold tracking-tight text-[#1A233A]">Any Board . Any Degree . Any Course.</h2>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <CarouselRow items={categories.boards} direction="right" />
          <CarouselRow items={categories.courses} direction="left" />
          <CarouselRow items={categories.degrees} direction="right" />
        </div>
      </div>
    </section>
  );
}
