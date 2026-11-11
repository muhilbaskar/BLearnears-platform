import React, { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://apidev.cloud/media-service/static/d17c2668-2313-4a29-8f11-fad0f002d087/b71380b9-e18c-443f-8d86-768ab65c7af5/aimode3/c09f24727ac5458fac0dd005b281c6e0.mp4";

// OPTIONAL but strongly recommended (see step 4 of the guide):
// a 720p / ~1-2 MB copy of the same video. Phones and 3G connections use it, so playback
// starts fast and never stutters. Leave "" to keep using VIDEO_URL everywhere.
const VIDEO_URL_SMALL = "";

// Poster = a compressed still frame of the video at public/hero-poster.webp (see the ffmpeg
// command in the notes). It paints immediately and becomes the page's LCP image, instead of
// the LCP waiting for the video's first frame. If the file is missing the poster hides itself
// (onError) and the section looks/behaves exactly as before.
const POSTER_URL = `${import.meta.env.BASE_URL || "/"}hero-poster.webp`;

const getConnection = () =>
  typeof navigator === "undefined" ? undefined : navigator.connection || navigator.mozConnection || navigator.webkitConnection;

// Decide ONCE how this device should play the video:
//  - Data Saver, 2G and reduced-motion users get a tap-to-play button (no silent multi-MB download)
//  - phones and 3G connections use the small file when one is configured
//  - everyone else (phones included, unlike before) autoplays so the hero is alive immediately
function decidePlayback() {
  if (typeof window === "undefined") return { autoplay: false, url: VIDEO_URL };
  const c = getConnection();
  const type = c?.effectiveType;
  const veryslow = type === "slow-2g" || type === "2g";
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const useSmall = Boolean(VIDEO_URL_SMALL) && (window.innerWidth < 768 || type === "3g");
  // 3G without a small file would stutter, so keep tap-to-play there
  const tooSlowForFull = type === "3g" && !VIDEO_URL_SMALL;
  return {
    autoplay: !c?.saveData && !veryslow && !reduce && !tooSlowForFull,
    url: useSmall ? VIDEO_URL_SMALL : VIDEO_URL,
  };
}

export default function HeroVideoSection() {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playback] = useState(decidePlayback);
  const { autoplay, url } = playback;
  const [src, setSrc] = useState(null); // nothing downloads until we decide
  const [blocked, setBlocked] = useState(false); // browser refused autoplay (e.g. iOS Low Power Mode)
  const [posterOk, setPosterOk] = useState(true); // flips to false if /hero-poster.webp does not exist

  // Autoplay devices: start the download AFTER the page has loaded and gone idle,
  // so the video never competes with critical resources.
  useEffect(() => {
    if (!autoplay) return undefined;
    let cancelled = false;
    const start = () => {
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
      idle(() => !cancelled && setSrc(url), { timeout: 1500 });
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", start);
    };
  }, [autoplay, url]);

  // Pause when off-screen / tab hidden
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
    play();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [src]);

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
        {posterOk && (
          // Stays mounted UNDER the video (the video is `relative` and later in the DOM), so the
          // video fades in over the poster instead of over the bare gradient.
          <img
            src={POSTER_URL}
            alt=""
            fetchPriority="high"
            decoding="async"
            onError={() => setPosterOk(false)}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {src && (
          <video
            ref={videoRef}
            className={`relative w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
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
            // fade in only once frames are really playing (no frozen first frame while buffering)
            onPlaying={() => {
              setIsLoaded(true);
              setBlocked(false);
            }}
            onLoadedData={() => setIsLoaded(true)}
          />
        )}

        {showPlayButton && (
          <button
            type="button"
            onClick={manualPlay}
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