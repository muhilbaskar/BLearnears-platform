import React, { useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useInViewport from "../../hooks/useInViewport";
import { getPageScale } from "../../utils/pageScale";

// FIX: absolute "/src/..." import breaks in production -> relative import
import vectorImg from "../../assets/hero/Vector.svg";

import interactiveLogo from "../../assets/hero/interactive-b-book.svg";
import assignmentsLogo from "../../assets/hero/b-assignments.svg";
import classLogo from "../../assets/hero/b-class.svg";
import storeLogo from "../../assets/hero/b-store.svg";
import resultLogo from "../../assets/hero/b-result.svg";
import tabLogoImg from "../../assets/onetab/tab-logo.svg";

// Dummy video sources for testing; replace with local/CDN imports when ready
const interactiveVideo = "https://apidev.cloud/media-service/static/608e6cd1-b829-4767-a1a2-5bc1913b27d3/b9c026a2-e04a-4652-9ac1-dc9188bb83d5/aimode33/4b90a4de1bc644eca29dd0bcfb47ab65.mp4";
const assignmentsVideo = "https://apidev.cloud/media-service/static/608e6cd1-b829-4767-a1a2-5bc1913b27d3/b9c026a2-e04a-4652-9ac1-dc9188bb83d5/aimode33/3d77f243a7d5484d9be799b3b5d9c31c.mp4";
const classVideo = "https://apidev.cloud/media-service/static/d17c2668-2313-4a29-8f11-fad0f002d087/b71380b9-e18c-443f-8d86-768ab65c7af5/aimode3/45cb0b29dde442f8a58f849b8af1acd6.mp4";
const storeVideo = "https://apidev.cloud/media-service/static/e75e4664-1cb9-476c-95d1-dd92899c6980/2e033730-247f-43a4-9fa9-012ae6bf4aa8/Blendedflow24/a0de104e469d412ab269874bd657d03d.mp4";
const resultVideo = "https://apidev.cloud/media-service/static/e75e4664-1cb9-476c-95d1-dd92899c6980/2e033730-247f-43a4-9fa9-012ae6bf4aa8/Blendedflow24/6f3c24c3339145cba0484ce8b5f27f44.mp4";

// ---------------------------------------------------------------------------
// Laptop alignment (1024px -> 1919px)
// The hero was designed at ~1829px of layout width (the reference screenshot = a
// 1920px screen). On 1024px / 1440px laptops the page layout is narrower than that,
// so the heading, tablet and floating tags collided. Here the hero is laid out at
// exactly HERO_LAYOUT_W and scaled to fit, so every laptop shows the same
// proportions as the reference. Below 1024px and from 1920px up the zoom is 1
// (nothing changes). Tune HERO_LAYOUT_W: bigger = smaller hero, smaller = bigger hero.
// ---------------------------------------------------------------------------
const HERO_LAYOUT_W = 1829;
const HERO_ZOOM_MIN_W = 1024;
const HERO_ZOOM_MAX_W = 1920;

const getHeroZoom = () => {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w < HERO_ZOOM_MIN_W || w >= HERO_ZOOM_MAX_W) return 1;
  // the page itself is already zoomed by getPageScale(), so compensate for it
  return Math.round((w / (HERO_LAYOUT_W * getPageScale())) * 1000) / 1000;
};

function useHeroZoom() {
  const [zoom, setZoom] = useState(getHeroZoom);
  React.useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setZoom(getHeroZoom()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return zoom;
}

// Same helper as Navbar/Footer: "/#section" from other pages, plain "#section" on home.
// This makes the hero buttons work from /privacy-policy and /terms-conditions too.
const useAnchor = () => {
  const { pathname } = useLocation();
  return (hash) => (pathname === "/" ? hash : `/${hash}`);
};

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const textGradient = {
  background: "linear-gradient(87.24deg, #8D00FF 1.33%, #D500FF 33.15%, #EF00FF 42.68%, #E132F7 56.89%, #D002FF 74.17%, #CF02FF 97.01%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
};

const TAG_BASE =
  "absolute bg-white w-10 h-10 sm:w-auto sm:h-auto justify-center sm:justify-start sm:px-4 sm:py-2 rounded-full sm:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center gap-0 sm:gap-2 text-[13px] font-medium text-gray-700 z-20 animate-bounce cursor-pointer hover:bg-gray-50 transition-colors";

// Same 5 floating tags, same positions as before - just no copy/paste
const TAGS = [
  { key: "book", video: interactiveVideo, icon: interactiveLogo, alt: "Interactive", label: "b-Book", pos: "absolute -top-[-25%] left-0 sm:-left-[-1%] md:-left-[-8.5%] lg:-left-[-12%]" },
  { key: "assign", video: assignmentsVideo, icon: assignmentsLogo, alt: "Assignments", label: "b-Assignments", pos: "bottom-[26%] -left-0 sm:-left-[-12%] md:-left-[-1.5%] lg:-left-[-4.5%]" },
  { key: "class", video: classVideo, icon: classLogo, alt: "Class", label: "b-Class", pos: "top-[10%] -right-1 sm:right-0 md:-right-[-8.5%] lg:-right-[14%]" },
  { key: "store", video: storeVideo, icon: storeLogo, alt: "Store", label: "more..", pos: "-bottom-[-6%] right-0 sm:right-0 md:right-[9%] lg:-right-[13.5%]" },
  { key: "result", video: resultVideo, icon: resultLogo, alt: "Result", label: "b-Result", pos: "bottom-[45%] -right-1 sm:right-0 md:right-[7.5%] lg:-right-[15%]" },
];

// Order in which videos auto-play in the loop: start with b-Class, then the rest
const AUTOPLAY_ORDER = ["class", "book", "assign", "store", "result"];

const FloatingTag = React.memo(function FloatingTag({ tag, onSelect }) {
  return (
    <button type="button" onClick={() => onSelect(tag.video)} aria-label={`Show ${tag.label} preview`} className={`${tag.pos} ${TAG_BASE}`}>
      <img src={tag.icon} alt="" width="20" height="20" decoding="async" className="w-5 h-5 sm:w-4 sm:h-4 object-contain" />
      <span className="hidden sm:inline">{tag.label}</span>
    </button>
  );
});

// Small inline spinner shown over the tablet while the active video buffers
const VideoSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white/25 border-t-white animate-spin" />
  </div>
);

export default function HeroSection() {
  const [activeVideo, setActiveVideo] = useState(classVideo);
  // Track which video key is active so we can advance the autoplay sequence
  const [activeKey, setActiveKey] = useState("class");
  // Loading state per video key (true = spinner visible)
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const inView = useInViewport(sectionRef, { rootMargin: "100px" });
  const heroZoom = useHeroZoom();
  const anchor = useAnchor();
  // Don't even set a video src until the tablet is near the viewport.
  // (Removed the page-idle gate so the video starts loading immediately on page load.)
  const near = useInViewport(sectionRef, { rootMargin: "200px", once: true });

  // Play only while the tablet is on screen
  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, activeVideo]);

  // Whenever the active video changes, reset the spinner
  React.useEffect(() => {
    setIsLoading(true);
  }, [activeVideo]);

  // Advance to the next video in the autoplay order (continuous loop)
  const goToNext = useCallback(() => {
    setActiveKey((prevKey) => {
      const idx = AUTOPLAY_ORDER.indexOf(prevKey);
      const nextKey = AUTOPLAY_ORDER[(idx + 1) % AUTOPLAY_ORDER.length];
      const nextTag = TAGS.find((t) => t.key === nextKey);
      if (nextTag) setActiveVideo(nextTag.video);
      return nextKey;
    });
  }, []);

  // User clicked a floating tag: switch video + key immediately (resets sequence)
  const handleSelect = useCallback((video, key) => {
    setActiveVideo(video);
    setActiveKey(key);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{
        zoom: heroZoom === 1 ? undefined : heroZoom,
        backgroundColor: "#f8f9fa",
        backgroundImage: `
          radial-gradient(50% 50% at 20% 80%, rgba(199, 233, 255, 0.5) 0%, rgba(199, 233, 255, 0) 70%),
          radial-gradient(60% 60% at 70% 30%, rgba(216, 215, 255, 0.55) 0%, rgba(216, 215, 255, 0) 70%)
        `,
      }}
    >
      {/* Bottom-left illustration (desktop) */}
      <div className="absolute bottom-0 left-0 md:left-4 lg:left-4 pointer-events-none z-0 hidden lg:block">
        <img src={vectorImg} alt="" width="150" height="260" loading="lazy" decoding="async" className="w-[120px] md:w-[160px] lg:w-[150px] object-contain" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 min-[1024px]:gap-20 items-center relative z-10">
        {/* Left: text */}
        <div className="w-full min-[1024px]:-ml-18">
          <m.div initial="hidden" animate="visible" variants={stagger}>
            <m.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-purple-200 bg-white/50 text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D00FF]" />
                <span style={textGradient}>Blended Education Ecosystem</span>
              </span>
            </m.div>

            <m.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.1] text-[#0B0F19] mb-6 tracking-tight lg:whitespace-nowrap">
              Experience the Future of <br />
              <span style={textGradient}>Education</span>
            </m.h1>

            <m.p variants={fadeInUp} className="text-[17px] text-[#6B7280] mb-10 max-w-[500px] leading-relaxed">
              Blended Education Ecosystem brings together curriculum, human expertise, blended intelligence and technology to create a more personalized, engaging and collaborative learning experience.
            </m.p>

            <div className="flex items-center gap-4 sm:gap-6 lg:block">
              <img
                src={vectorImg}
                alt="Student walking with tablet"
                width="160"
                height="280"
                decoding="async"
                className="lg:hidden shrink-0 pointer-events-none w-[90px] min-[375px]:w-[110px] sm:w-[140px] md:w-[160px] h-auto object-contain"
              />
              <div className="flex-1 min-w-0 lg:flex-none">
                <m.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-8">
                  <Link
                    to={anchor("#features")}
                    className="bg-gradient-to-r from-[#D600FF] to-[#6B2CFF] hover:opacity-90 text-white px-4 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[15px] transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                  >
                    Explore BLearners <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link
                    to={anchor("#bee")}
                    className="bg-white text-[#0B0F19] border border-gray-200 px-4 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold text-[13px] sm:text-[15px] hover:bg-gray-50 transition-colors shadow-sm text-center"
                  >
                    Discover BEE
                  </Link>
                </m.div>

                <m.p variants={fadeInUp} className="text-[13px] sm:text-[15px] text-[#4B5563] font-medium">
                  By Blended Pedagogy
                </m.p>
              </div>
            </div>
          </m.div>
        </div>

        {/* Right: tablet + floating tags */}
        <div className="w-full">
          <m.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center lg:justify-end mt-6 lg:mt-0"
          >
            {TAGS.map((t) => (
              <FloatingTag key={t.key} tag={t} onSelect={(video) => handleSelect(video, t.key)} />
            ))}

            <div className="w-full max-w-[340px] sm:max-w-none h-[520px] sm:w-[420px] sm:h-[600px] lg:w-[480px] lg:h-[680px] bg-[#1a1a1a] rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative z-10 p-3 md:p-4 flex flex-col">
              <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden rounded-[2rem] md:rounded-[2.5rem]">
                {isLoading && <VideoSpinner />}
                {near && (
                  <video
                    ref={videoRef}
                    key={activeVideo}
                    src={`${activeVideo}#t=0.1`}
                    preload="auto"
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                    aria-hidden="true"
                    onLoadedData={() => setIsLoading(false)}
                    onCanPlay={() => setIsLoading(false)}
                    onPlaying={() => setIsLoading(false)}
                    onWaiting={() => setIsLoading(true)}
                    onEnded={goToNext}
                  />
                )}
              </div>

              <img
                src={tabLogoImg}
                alt=""
                width="12"
                height="12"
                className="absolute bottom-1 md:bottom-[0%] left-1/2 -translate-x-1/2 z-40 w-[10px] md:w-[12px] h-auto object-contain drop-shadow-lg"
              />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}