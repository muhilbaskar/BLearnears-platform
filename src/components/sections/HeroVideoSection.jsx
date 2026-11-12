import React, { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

// Import the local video asset. Vite will handle hashing and caching.
import heroVideo from "../../assets/videos/heroVideo.mp4";

// OPTIONAL: If you have a smaller version for mobile, import it here.
// Leave as null if not using.
const VIDEO_URL_SMALL = null;

// Poster = a compressed still frame of the video at public/hero-poster.webp
const POSTER_URL = `${import.meta.env.BASE_URL || "/"}hero-poster.webp`;

const getConnection = () =>
  typeof navigator === "undefined" ? undefined : navigator.connection || navigator.mozConnection || navigator.webkitConnection;

// Decide ONCE how this device should play the video:
//  - Data Saver, 2G and reduced-motion users get a tap-to-play button (no silent multi-MB download)
//  - phones and 3G connections use the small file when one is configured
//  - everyone else (phones included) autoplays so the hero is alive immediately
function decidePlayback() {
  if (typeof window === "undefined") return { autoplay: false, url: heroVideo };
  const c = getConnection();
  const type = c?.effectiveType;
  const veryslow = type === "slow-2g" || type === "2g";
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const useSmall = Boolean(VIDEO_URL_SMALL) && (window.innerWidth < 768 || type === "3g");
  
  // 3G without a small file would stutter, so keep tap-to-play there
  const tooSlowForFull = type === "3g" && !VIDEO_URL_SMALL;
  return {
    autoplay: !c?.saveData && !veryslow && !reduce && !tooSlowForFull,
    url: useSmall ? VIDEO_URL_SMALL : heroVideo,
  };
}

export default function HeroVideoSection() {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playback] = useState(decidePlayback);
  const { autoplay, url } = playback;
  const [src, setSrc] = useState(autoplay ? url : null); // Set src immediately if autoplay is allowed
  const [blocked, setBlocked] = useState(false); // browser refused autoplay (e.g. iOS Low Power Mode)
  const [posterOk, setPosterOk] = useState(true); // flips to false if /hero-poster.webp does not exist

  // Pause when off-screen / tab hidden & handle play states
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return undefined;
    video.muted = true;
    video.defaultMuted = true;
    let visible = true;

    const play = () => {
      if (!visible || document.hidden) return;
      const p = video.play();
      if (p && p.catch) {
        p.catch((err) => {
          // If autoplay is blocked, show the play button fallback
          if (err && err.name === "NotAllowedError") setBlocked(true);
        });
      }
    };

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
    
    // Attempt to play immediately if autoplay is true
    if (autoplay) play();

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src, autoplay]);

  const manualPlay = () => {
    if (!src) {
      setSrc(url);
      return;
    }
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().then(() => setBlocked(false)).catch(() => {});
    }
  };

  const showPlayButton = (!autoplay && !src) || blocked;

  return (
    <section className="w-full relative bg-gray-100">
      <div className="w-full overflow-hidden aspect-video relative bg-gradient-to-br from-[#2a1a6e] via-[#4a2bb8] to-[#a300d9]">
        
        {/* Poster Image */}
        {posterOk && (
          <img
            src={POSTER_URL}
            alt=""
            fetchPriority="high"
            decoding="async"
            onError={() => setPosterOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Loading Spinner - Shows while video is buffering */}
        {!isLoaded && src && !blocked && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Loader2 
              size={48} 
              className="text-[#8D00FF] animate-spin drop-shadow-md" 
              aria-hidden="true" 
            />
          </div>
        )}

        {/* Video Element */}
        {src && (
          <video
            ref={videoRef}
            className={`relative z-10 w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
            preload="auto"
            poster={posterOk ? POSTER_URL : undefined}
            src={src}
            aria-label="BLearners introduction video"
            // Hide spinner and fade in only once frames are actually playing
            onPlaying={() => {
              setIsLoaded(true);
              setBlocked(false);
            }}
            onLoadedData={() => setIsLoaded(true)}
          />
        )}

        {/* Tap-to-play button fallback (Data Saver / 2G / Blocked Autoplay) */}
        {showPlayButton && (
          <button
            type="button"
            onClick={manualPlay}
            aria-label="Play introduction video"
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
          >
            <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 shadow-xl hover:scale-105 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#8D00FF" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}