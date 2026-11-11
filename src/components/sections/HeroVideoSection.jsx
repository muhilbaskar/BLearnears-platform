import React, { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://apidev.cloud/media-service/static/d17c2668-2313-4a29-8f11-fad0f002d087/b71380b9-e18c-443f-8d86-768ab65c7af5/aimode3/c09f24727ac5458fac0dd005b281c6e0.mp4";

// Add a real compressed poster (.webp in /public) for the best LCP, e.g. "/hero-poster.webp"
const POSTER_URL = "";

// Phones, slow networks, Data Saver and reduced-motion users get a tap-to-play
// video instead of a multi-MB autoplay download. This is the single biggest
// Lighthouse-mobile win for this page.
function canAutoplay() {
  if (typeof window === "undefined") return false;
  const c = navigator.connection;
  const slow = c && c.effectiveType && c.effectiveType !== "4g";
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return window.innerWidth >= 768 && !c?.saveData && !slow && !reduce;
}

export default function HeroVideoSection() {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autoplay] = useState(canAutoplay);
  const [src, setSrc] = useState(null); // nothing downloads until we decide

  // Autoplay devices: start the download AFTER the page has loaded and gone idle,
  // so the video never competes with critical resources.
  useEffect(() => {
    if (!autoplay) return undefined;
    let cancelled = false;
    const start = () => {
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 800));
      idle(() => !cancelled && setSrc(VIDEO_URL), { timeout: 3000 });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, [autoplay]);

  // Pause when off-screen / tab hidden
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;
    video.muted = true;
    let visible = true;
    const play = () => visible && !document.hidden && video.play().catch(() => {});
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) play();
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    const onVis = () => (document.hidden ? video.pause() : play());
    document.addEventListener("visibilitychange", onVis);
    play();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src]);

  return (
    <section className="w-full relative bg-gray-100">
      <div className="w-full overflow-hidden aspect-video relative bg-gradient-to-br from-[#2a1a6e] via-[#4a2bb8] to-[#a300d9]">
        {POSTER_URL && !isLoaded && (
          <img src={POSTER_URL} alt="" fetchpriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        )}

        {src && (
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src={src}
            aria-label="BLearners introduction video"
            onLoadedData={() => setIsLoaded(true)}
          />
        )}

        {!autoplay && !src && (
          <button
            type="button"
            onClick={() => setSrc(VIDEO_URL)}
            aria-label="Play introduction video"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 shadow-xl">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#8D00FF" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
