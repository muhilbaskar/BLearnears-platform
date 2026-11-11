import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { m, useInView } from "framer-motion";
import Galaxy from "../common/Galaxy";
import useInViewport from "../../hooks/useInViewport";
import { getPageScale } from "../../utils/pageScale";

// three.js + react-globe.gl are ~700 KB. They are now a SEPARATE chunk that is only
// downloaded when this section is about to scroll into view.
const loadGlobe = () => import("react-globe.gl");
const Globe = lazy(loadGlobe);

// Textures are now SELF-HOSTED in /public/textures (same origin, long-cache on your CDN)
// and compressed to WebP: 1.8 MB (unpkg JPG 4096px + PNG) -> ~220 KB (2048px WebP).
// A 1024px variant is used on Data Saver / 2G / very low-memory devices (~75 KB).
const BASE = import.meta.env.BASE_URL || "/";
const EARTH_TEXTURE = `${BASE}textures/earth-blue-marble.webp`;
const EARTH_TEXTURE_LITE = `${BASE}textures/earth-blue-marble-1024.webp`;
const BUMP_TEXTURE = `${BASE}textures/earth-topology.webp`;

const shouldUseLiteTexture = () => {
  if (typeof navigator === "undefined") return false;
  const c = navigator.connection;
  const slow = c && (c.saveData || /2g/.test(c.effectiveType || ""));
  return Boolean(slow) || (navigator.deviceMemory && navigator.deviceMemory <= 2);
};

// Original remote textures: used ONLY if the self-hosted files cannot be loaded
// (e.g. /public/textures was not deployed), so the Earth always shows.
const REMOTE_EARTH = "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const REMOTE_BUMP = "https://unpkg.com/three-globe/example/img/earth-topology.png";

const probeImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });

// Checks the local textures once (this also warms the browser cache) and falls back to the
// remote ones when a local file is missing / not an image.
let texturePromise = null;
const resolveTextures = () => {
  if (!texturePromise) {
    texturePromise = (async () => {
      const lite = shouldUseLiteTexture();
      const localEarth = lite ? EARTH_TEXTURE_LITE : EARTH_TEXTURE;
      const earthOk = await probeImage(localEarth);
      if (!earthOk) return { earth: REMOTE_EARTH, bump: lite ? undefined : REMOTE_BUMP };
      const bumpOk = lite ? false : await probeImage(BUMP_TEXTURE);
      return { earth: localEarth, bump: bumpOk ? BUMP_TEXTURE : undefined };
    })();
  }
  return texturePromise;
};

// Warm the browser cache BEFORE the section scrolls into view: the three.js chunk and the
// textures download in parallel, so the Earth appears the moment the user arrives.
let earthPrefetched = false;
const prefetchEarth = () => {
  if (earthPrefetched || typeof window === "undefined") return;
  earthPrefetched = true;
  loadGlobe().catch(() => { earthPrefetched = false; });
  resolveTextures();
};

// Global city coordinates (lat/lng) — EXPANDED
const CITIES = [
  // 0-3 Europe (West)
  { name: "London", lat: 51.5, lng: -0.12 },
  { name: "Paris", lat: 48.85, lng: 2.35 },
  { name: "Madrid", lat: 40.4, lng: -3.7 },
  { name: "Berlin", lat: 52.52, lng: 13.405 },

  // 4-6 Europe (East / North)
  { name: "Moscow", lat: 55.75, lng: 37.6 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "Rome", lat: 41.9, lng: 12.5 },

  // 7-9 Africa
  { name: "Cairo", lat: 30.05, lng: 31.25 },
  { name: "Lagos", lat: 6.5, lng: 3.38 },
  { name: "Nairobi", lat: -1.29, lng: 36.82 },

  // 10-12 Africa (South / West)
  { name: "Johannesburg", lat: -26.2, lng: 28.05 },
  { name: "Dakar", lat: 14.7, lng: -17.45 },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898 },

  // 13-14 Middle East
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Istanbul", lat: 41.0082, lng: 28.9784 },

  // 15-25 India
  { name: "Delhi", lat: 28.6, lng: 77.2 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },

  // 26-28 India (East / South)
  { name: "Guwahati", lat: 26.1445, lng: 91.7362 },
  { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  { name: "Bhubaneswar", lat: 20.2961, lng: 85.8245 },

  // 29-33 Asia (East / Southeast)
  { name: "Singapore", lat: 1.35, lng: 103.8 },
  { name: "Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Tokyo", lat: 35.6762, lng: 139.6503 },

  // 34-35 Asia (East)
  { name: "Seoul", lat: 37.5665, lng: 126.978 },
  { name: "Shanghai", lat: 31.2304, lng: 121.4737 },

  // 36-37 Oceania
  { name: "Sydney", lat: -33.87, lng: 151.2 },
  { name: "Melbourne", lat: -37.8136, lng: 144.9631 },

  // 38-42 North America
  { name: "New York", lat: 40.7, lng: -74.0 },
  { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Mexico City", lat: 19.4326, lng: -99.1332 },

  // 43-45 South America
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Buenos Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Bogotá", lat: 4.711, lng: -74.0721 },
];

// Connection pairs between cities by index — EXPANDED
const LINKS = [
  // Europe internal
  [0, 1], // London - Paris
  [0, 2], // London - Madrid
  [0, 3], // London - Berlin
  [1, 3], // Paris - Berlin
  [1, 6], // Paris - Rome
  [3, 4], // Berlin - Moscow
  [3, 5], // Berlin - Stockholm
  [4, 5], // Moscow - Stockholm
  [4, 14], // Moscow - Istanbul
  [6, 7], // Rome - Cairo
  [1, 12], // Paris - Casablanca

  // Europe ↔ Africa
  [2, 12], // Madrid - Casablanca
  [0, 8], // London - Lagos
  [0, 11], // London - Dakar
  [3, 7], // Berlin - Cairo
  [4, 13], // Moscow - Dubai

  // Africa internal
  [8, 9], // Lagos - Nairobi
  [8, 11], // Lagos - Dakar
  [9, 10], // Nairobi - Johannesburg
  [7, 13], // Cairo - Dubai
  [12, 11], // Casablanca - Dakar

  // Middle East ↔ Asia
  [13, 15], // Dubai - Delhi
  [13, 16], // Dubai - Mumbai
  [13, 29], // Dubai - Singapore
  [14, 15], // Istanbul - Delhi

  // India internal
  [15, 16], // Delhi - Mumbai
  [15, 17], // Delhi - Bengaluru
  [15, 19], // Delhi - Kolkata
  [15, 20], // Delhi - Hyderabad
  [16, 17], // Mumbai - Bengaluru
  [16, 18], // Mumbai - Chennai
  [16, 21], // Mumbai - Pune
  [16, 22], // Mumbai - Ahmedabad
  [17, 18], // Bengaluru - Chennai
  [17, 20], // Bengaluru - Hyderabad
  [17, 27], // Bengaluru - Kochi
  [18, 27], // Chennai - Kochi
  [19, 26], // Kolkata - Guwahati
  [19, 28], // Kolkata - Bhubaneswar
  [20, 21], // Hyderabad - Pune
  [21, 22], // Pune - Ahmedabad
  [22, 23], // Ahmedabad - Jaipur
  [23, 15], // Jaipur - Delhi
  [23, 24], // Jaipur - Lucknow
  [24, 25], // Lucknow - Chandigarh
  [24, 19], // Lucknow - Kolkata
  [25, 15], // Chandigarh - Delhi
  [26, 28], // Guwahati - Bhubaneswar
  [28, 18], // Bhubaneswar - Chennai

  // India ↔ World
  [16, 13], // Mumbai - Dubai
  [15, 29], // Delhi - Singapore
  [17, 29], // Bengaluru - Singapore
  [18, 29], // Chennai - Singapore
  [16, 38], // Mumbai - New York
  [15, 0], // Delhi - London
  [17, 38], // Bengaluru - New York

  // Asia internal
  [29, 30], // Singapore - Bangkok
  [29, 31], // Singapore - Jakarta
  [29, 32], // Singapore - Hong Kong
  [29, 33], // Singapore - Tokyo
  [30, 32], // Bangkok - Hong Kong
  [31, 36], // Jakarta - Sydney
  [32, 33], // Hong Kong - Tokyo
  [32, 34], // Hong Kong - Seoul
  [32, 35], // Hong Kong - Shanghai
  [33, 34], // Tokyo - Seoul
  [33, 35], // Tokyo - Shanghai
  [33, 39], // Tokyo - Los Angeles
  [33, 36], // Tokyo - Sydney
  [34, 35], // Seoul - Shanghai

  // Oceania
  [36, 37], // Sydney - Melbourne
  [36, 29], // Sydney - Singapore

  // North America internal
  [38, 39], // New York - Los Angeles
  [38, 40], // New York - Chicago
  [38, 41], // New York - Toronto
  [39, 40], // Los Angeles - Chicago
  [39, 42], // Los Angeles - Mexico City
  [40, 41], // Chicago - Toronto

  // North America ↔ Europe
  [38, 0], // New York - London
  [38, 1], // New York - Paris
  [41, 0], // Toronto - London

  // North America ↔ South America
  [38, 43], // New York - São Paulo
  [42, 43], // Mexico City - São Paulo
  [42, 44], // Mexico City - Buenos Aires

  // South America internal
  [43, 44], // São Paulo - Buenos Aires
  [43, 45], // São Paulo - Bogotá
  [44, 45], // Buenos Aires - Bogotá

  // South America ↔ Europe/Africa
  [43, 2], // São Paulo - Madrid
  [45, 11], // Bogotá - Dakar

  // Transatlantic / Transpacific highlights
  [39, 33], // Los Angeles - Tokyo
  [39, 36], // Los Angeles - Sydney
  [38, 13], // New York - Dubai
  [38, 16], // New York - Mumbai
  [38, 33], // New York - Tokyo
];

// Arc data derived from the city links
const ARCS = LINKS.map(([a, b], i) => ({
  startLat: CITIES[a].lat,
  startLng: CITIES[a].lng,
  endLat: CITIES[b].lat,
  endLng: CITIES[b].lng,
  time: 2200 + (i % 4) * 500,
}));


// Full set for desktop, lighter subsets for phones / low-core CPUs
const ARCS_LITE = ARCS.filter((_, i) => i % 2 === 0);
// Pulsing rings are the most expensive part (each ring spawns meshes continuously),
// so only major hubs get them instead of all 46 cities.
const RING_HUB_NAMES = ["London", "Paris", "Cairo", "Dubai", "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Singapore", "Tokyo", "Sydney", "New York", "Los Angeles", "S\u00e3o Paulo", "Lagos"];
const RINGS_FULL = CITIES.filter((c) => RING_HUB_NAMES.includes(c.name));
const RINGS_LITE = CITIES.filter((c) => ["London", "Dubai", "Delhi", "Bengaluru", "Singapore", "Tokyo", "New York", "S\u00e3o Paulo"].includes(c.name));

const ARC_GRADIENT = ["rgba(79,216,255,0.05)", "rgba(79,216,255,0.15)", "rgba(255,255,255,0.85)", "rgba(255,209,102,0.55)", "rgba(255,209,102,0)"];

// IMPORTANT: accessor functions live at module level. Before, `() => ARC_GRADIENT`
// etc. were re-created on every render, and react-globe.gl treats a new function as
// "data changed" and rebuilds all arcs/rings geometry on each resize/state update.
const arcColor = () => ARC_GRADIENT;
const arcDash = (d) => d.time;
const pointColor = () => "#ffd166";
const ringColor = () => (t) => `rgba(255,209,102,${1 - t})`;
const RENDERER_HQ = { antialias: true, alpha: true, powerPreference: "high-performance" };
const RENDERER_LITE = { antialias: false, alpha: true, powerPreference: "default" };

const detectLowPower = () => {
  if (typeof window === "undefined") return false;
  const cores = navigator.hardwareConcurrency || 8;
  const mem = navigator.deviceMemory || 8;
  return window.innerWidth < 768 || cores <= 4 || mem <= 4;
};

// Mobile/tablet (< lg) globe size
const getMobileGlobeSize = () => {
  if (typeof window === "undefined") return null;
  if (window.innerWidth >= 1024) return null;
  return Math.round(Math.min(window.innerWidth * 0.95, window.innerHeight * 0.6));
};

// ---------------------------------------------------------------------------
// Laptop L (1440px) + 4K (2560px) "stage" layout
// For viewport widths STAGE_MIN..STAGE_MAX the section is drawn as a fixed
// 1920 x 1080 stage whose proportions are measured from the 1024px reference
// screenshot, then scaled to the REAL section width (scrollbar excluded).
// Other widths use your original layout, untouched.
// ---------------------------------------------------------------------------
const STAGE_W = 1920;
const STAGE_H = 915;
const STAGE_MIN = 1400;
const STAGE_MAX = 3839;

// Globe: visible sphere ~619px (react-globe.gl sphere = ~0.734 x canvas) centred at x=409
const STAGE_GLOBE = 840;
const STAGE_GLOBE_CX = 409;
// Card: 862 x 525, left edge at x=986, vertically centred
const STAGE_CARD_LEFT = 986;
const STAGE_CARD_W = 862;

const inStageRange = () =>
  typeof window !== "undefined" && window.innerWidth >= STAGE_MIN && window.innerWidth <= STAGE_MAX;

function useStageScale(sectionRef) {
  const [scale, setScale] = useState(() => (inStageRange() ? window.innerWidth / STAGE_W : null));

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!inStageRange()) {
          setScale((prev) => (prev === null ? prev : null));
          return;
        }
        // use the real section width so a vertical scrollbar does not break the fit
        const w = sectionRef.current ? sectionRef.current.clientWidth : window.innerWidth;
        const next = w / STAGE_W;
        setScale((prev) => (prev !== null && Math.abs(prev - next) < 0.0005 ? prev : next));
      });
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" && sectionRef.current ? new ResizeObserver(update) : null;
    if (observer) observer.observe(sectionRef.current);
    return () => {
      window.removeEventListener("resize", update);
      if (observer) observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return scale;
}

function RealEarth({ active, visible, lowPower, fixedSize = null, stageScale = null, onReady }) {
  const globeRef = useRef(null);
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });
  const [mobileSize, setMobileSize] = useState(getMobileGlobeSize);
  const [textures, setTextures] = useState(null); // { earth, bump } once resolved
  useEffect(() => {
    let cancelled = false;
    resolveTextures().then((t) => { if (!cancelled) setTextures(t); });
    return () => { cancelled = true; };
  }, []);
  const handleReady = useCallback(() => {
    setReady(true);
    if (onReady) onReady();
  }, [onReady]);

  // rAF-throttled resize (was firing setState on every resize event)
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMobileSize((prev) => {
        const next = getMobileGlobeSize();
        return prev === next ? prev : next;
      }));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  // One-time renderer setup once the globe exists
  useEffect(() => {
    const globe = globeRef.current;
    if (!ready || !globe) return;

    const renderer = globe.renderer?.();
    if (renderer) {
      renderer.setClearColor(0x000000, 0);
      // Cap pixel ratio: a 3x phone / 2x laptop would otherwise render 4-9x the pixels
      // multiply by the laptop page-scale so we do not render 2560px of pixels on a 1440px screen
      // In stage mode the canvas is CSS-scaled by stageScale, so use that instead.
      const scaleFactor = stageScale ?? getPageScale();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.5) * scaleFactor);
    }

    const controls = globe.controls();
    controls.autoRotateSpeed = 1.25;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0;

    globe.pointOfView({ lat: 20, lng: 20, altitude: 2.3 }, 0);
  }, [ready, lowPower, stageScale]);

  // Rotate only while the entrance has happened; stop the WHOLE render loop when off-screen
  useEffect(() => {
    const globe = globeRef.current;
    if (!ready || !globe) return;
    globe.controls().autoRotate = active;
    if (visible) globe.resumeAnimation?.();
    else globe.pauseAnimation?.();
  }, [ready, active, visible]);

  // Desktop: follow container size (only update state when it really changed)
  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const size = Math.round(Math.max(width, height));
      if (size > 0) setDimensions((d) => (d.width === size ? d : { width: size, height: size }));
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const globeWidth = fixedSize ?? mobileSize ?? dimensions.width;
  const globeHeight = fixedSize ?? mobileSize ?? dimensions.height;

  return (
    <div
      ref={containerRef}
      style={fixedSize ? { width: fixedSize, height: fixedSize, minHeight: fixedSize, flexShrink: 0 } : { minHeight: mobileSize || undefined }}
      className={
        fixedSize
          ? "flex items-center justify-center relative"
          : "w-full lg:h-full lg:min-h-[600px] xl:min-h-[700px] 2xl:min-h-[800px] fhd:min-h-[900px] qhd:min-h-[1100px] min-[3840px]:min-h-[1400px] flex items-center justify-center relative"
      }
    >
      <Suspense fallback={null}>
        {textures && (
        <Globe
          ref={globeRef}
          onGlobeReady={handleReady}
          width={globeWidth}
          height={globeHeight}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={textures.earth}
          bumpImageUrl={lowPower ? undefined : textures.bump}
          showAtmosphere
          atmosphereColor="#4fd8ff"
          atmosphereAltitude={0.22}
          rendererConfig={lowPower ? RENDERER_LITE : RENDERER_HQ}
          arcsData={lowPower ? ARCS_LITE : ARCS}
          arcColor={arcColor}
          arcStroke={0.45}
          arcAltitudeAutoScale={0.4}
          arcDashLength={0.35}
          arcDashGap={1.6}
          arcDashAnimateTime={arcDash}
          arcCurveResolution={lowPower ? 24 : 40}
          arcCircularResolution={4}
          pointsData={CITIES}
          pointLat="lat"
          pointLng="lng"
          pointColor={pointColor}
          pointAltitude={0.012}
          pointRadius={0.35}
          pointResolution={8}
          ringsData={lowPower ? RINGS_LITE : RINGS_FULL}
          ringLat="lat"
          ringLng="lng"
          ringColor={ringColor}
          ringMaxRadius={3}
          ringResolution={lowPower ? 24 : 40}
          ringPropagationSpeed={1.6}
          ringRepeatPeriod={lowPower ? 2600 : 1800}
        />
        )}
      </Suspense>
    </div>
  );
}

const ease = [0.22, 1, 0.36, 1];
const earthVariants = { hidden: { opacity: 0, x: -120, scale: 0.92 }, visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 1.1, ease } } };
const cardVariants = { hidden: { opacity: 0, x: 120 }, visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease, delay: 0.25 } } };
const labelVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.55, ease: "easeOut" } } };
const headingVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.7, ease: "easeOut" } } };
const descVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.85, ease: "easeOut" } } };

const galaxyStyle = { position: "absolute", inset: 0, width: "100%", height: "100%" };
const accentStyle = { background: "linear-gradient(90deg, rgba(241, 196, 94, 0) 0%, rgba(241, 196, 94, 0.75) 50%, rgba(241, 196, 94, 0) 100%)" };

// Fixed pixel values for the 1920 x 1080 stage (Laptop L + 4K), from the 1024px reference
const stageCardStyle = {
  width: STAGE_CARD_W,
  minHeight: 525,
  gap: 26,
  padding: "60px 56px",
  borderRadius: 40,
};
const stageAccentStyle = { ...accentStyle, width: 700, height: 4, borderTopLeftRadius: 40 };
const stageLabelStyle = { fontSize: 15, letterSpacing: 6.5, lineHeight: "20px" };
const stageTitleStyle = { fontSize: 72, lineHeight: 1.15 };
const stageDescStyle = { fontSize: 24, maxWidth: 770, lineHeight: 1.65 };

export default function GlobalSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });   // entrance animation
  const farScreen = useInViewport(sectionRef, { rootMargin: "1500px", once: true }); // prefetch chunk + textures
  const nearScreen = useInViewport(sectionRef, { rootMargin: "800px", once: true }); // start loading WebGL
  const onScreen = useInViewport(sectionRef, { rootMargin: "0px" });     // run / pause WebGL
  const [lowPower] = useState(detectLowPower);
  const stageScale = useStageScale(sectionRef); // null everywhere except 1400-3839px

  useEffect(() => {
    if (farScreen) prefetchEarth();
  }, [farScreen]);

  // Two WebGL contexts compiling at once = long main-thread stall + janky first frames.
  // The Earth goes first; the Galaxy shader background starts right after it is ready
  // (or after 2.5s at the latest). The section background is already #0c0b16, so no flash.
  const [earthReady, setEarthReady] = useState(false);
  const [galaxyTimeout, setGalaxyTimeout] = useState(false);
  const handleEarthReady = useCallback(() => setEarthReady(true), []);
  useEffect(() => {
    if (!nearScreen) return undefined;
    const id = setTimeout(() => setGalaxyTimeout(true), 2500);
    return () => clearTimeout(id);
  }, [nearScreen]);
  const galaxyOn = nearScreen && (earthReady || galaxyTimeout);
  const isStage = stageScale !== null;

  // Section: in stage mode it is exactly as tall as the scaled 1920x1080 stage
  const sectionStyle = isStage
    ? { height: STAGE_H * stageScale, minHeight: 0, paddingTop: 0, paddingBottom: 0 }
    : undefined;

  return (
    <section
      ref={sectionRef}
      style={sectionStyle}
      className="relative w-full min-h-screen py-12 lg:h-auto lg:py-24 xl:py-32 2xl:py-40 fhd:py-48 qhd:py-64 bg-[#0c0b16] overflow-hidden flex flex-col lg:flex-row items-center justify-center"
    >
      {/* Galaxy shader background (mounted only when near the viewport, cheaper settings on weak devices) */}
      <div className="absolute inset-0 z-0 w-full h-full bg-[#0c0b16] overflow-hidden" aria-hidden="true">
        {galaxyOn && (
          <Galaxy
            transparent={false}
            backgroundColor="#0c0b16"
            density={1}
            glowIntensity={0.3}
            flareIntensity={1}
            starSpeed={0.5}
            mouseRepulsion={!lowPower}
            clickWarp={!lowPower}
            hueShift={140}
            saturation={0}
            starSize={1}
            twinkleIntensity={0.3}
            speed={1}
            rotationSpeed={0.1}
            layers={lowPower ? 3 : 4}
            direction="forward"
            repulsionStrength={2}
            mouseInteraction={!lowPower}
            intro={!lowPower}
            lightMode={false}
            dpr={(lowPower ? 0.75 : 1) * getPageScale()}
            maxFps={lowPower ? 30 : 60}
            style={galaxyStyle}
          />
        )}
      </div>

      {isStage ? (
        /* ===== Laptop L (1440px) + 4K (2560px): fixed 1920x1080 stage, scaled ===== */
        <div
          className="z-10"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: STAGE_W,
            height: STAGE_H,
            transform: `scale(${stageScale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Left: 3D Earth (sphere centre at x = 409, y = 540) */}
          <m.div
            variants={earthVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="pointer-events-none bg-transparent"
            style={{
              position: "absolute",
              left: STAGE_GLOBE_CX - STAGE_GLOBE / 2,
              top: STAGE_H / 2 - STAGE_GLOBE / 2,
              width: STAGE_GLOBE,
              height: STAGE_GLOBE,
            }}
          >
            {nearScreen ? (
              <RealEarth active={isInView} visible={onScreen} lowPower={lowPower} fixedSize={STAGE_GLOBE} stageScale={stageScale} onReady={handleEarthReady} />
            ) : (
              <div style={{ width: STAGE_GLOBE, height: STAGE_GLOBE }} aria-hidden="true" />
            )}
          </m.div>

          {/* Right: content card */}
          <m.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="z-10"
            style={{
              position: "absolute",
              left: STAGE_CARD_LEFT,
              top: 0,
              width: STAGE_CARD_W,
              height: STAGE_H,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="glass-card relative flex flex-col justify-center items-center text-center overflow-hidden"
              style={stageCardStyle}
            >
              <div className="absolute top-0 left-0" style={stageAccentStyle} />

              <m.p
                variants={labelVariants}
                className="font-['JetBrains_Mono'] font-bold whitespace-nowrap text-[#4AD496] uppercase"
                style={stageLabelStyle}
              >
                Empowering Education Worldwide
              </m.p>

              <m.h2
                variants={headingVariants}
                className="whitespace-nowrap font-bold text-white tracking-tight"
                style={stageTitleStyle}
              >
                Connecting Globally
              </m.h2>

              <m.p
                variants={descVariants}
                className="text-white/90 mx-auto"
                style={stageDescStyle}
              >
                Get connected to any classroom. Learn beyond boundaries. Teach anyone anywhere - Experience BLearners TAB for Seamless Education.
              </m.p>
            </div>
          </m.div>
        </div>
      ) : (
        /* ===== All other screens: your original layout, unchanged ===== */
        <div className="max-w-[1920px] w-full mx-auto px-0 lg:px-12 xl:px-20 2xl:px-24 fhd:px-32 qhd:px-48 min-[3840px]:px-64 relative z-10 grid lg:grid-cols-2 gap-0 lg:gap-8 xl:gap-16 2xl:gap-24 items-center">
          {/* Left: 3D Earth */}
          <m.div
            variants={earthVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-[1] w-full flex items-center justify-center pointer-events-none bg-transparent"
          >
            {nearScreen ? <RealEarth active={isInView} visible={onScreen} lowPower={lowPower} onReady={handleEarthReady} /> : <div className="w-full min-h-[300px] lg:min-h-[600px]" aria-hidden="true" />}
          </m.div>

          {/* Right: content card */}
          <m.div
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10 w-full flex justify-center lg:justify-end px-4 md:px-16 lg:px-0"
          >
            <div className="glass-card relative flex flex-col justify-center items-center text-center overflow-hidden w-full max-w-[720px] xl:max-w-[760px] 2xl:max-w-[820px] fhd:max-w-[900px] qhd:max-w-[1100px] min-[3840px]:max-w-[1500px] min-h-[352px] xl:min-h-[380px] 2xl:min-h-[420px] fhd:min-h-[480px] qhd:min-h-[600px] min-[3840px]:min-h-[800px] gap-[8.7px] lg:gap-[12px] xl:gap-[14px] 2xl:gap-[18px] fhd:gap-[24px] qhd:gap-[32px] min-[3840px]:gap-[48px] pt-[27px] lg:pt-[30px] xl:pt-[40px] 2xl:pt-[50px] fhd:pt-[60px] qhd:pt-[80px] min-[3840px]:pt-[110px] px-[25.4px] lg:px-[25px] xl:px-[32px] 2xl:px-[40px] fhd:px-[50px] qhd:px-[70px] min-[3840px]:px-[100px] pb-[25.4px] lg:pb-[30px] xl:pb-[40px] 2xl:pb-[50px] fhd:pb-[60px] qhd:pb-[80px] min-[3840px]:pb-[110px] rounded-[20px] xl:rounded-[24px] 2xl:rounded-[28px] fhd:rounded-[32px] qhd:rounded-[42px] min-[3840px]:rounded-[56px] [container-type:inline-size]">
              <div
                className="absolute top-0 left-0 w-[400px] xl:w-[460px] 2xl:w-[520px] fhd:w-[600px] qhd:w-[740px] min-[3840px]:w-[1000px] h-[2px] xl:h-[2.5px] 2xl:h-[3px] fhd:h-[3.5px] qhd:h-[4.5px] min-[3840px]:h-[6px] rounded-tl-[20px] xl:rounded-tl-[24px] 2xl:rounded-tl-[28px] fhd:rounded-tl-[32px] qhd:rounded-tl-[42px] min-[3840px]:rounded-tl-[56px]"
                style={accentStyle}
              />

              <m.p
                variants={labelVariants}
                className="font-['JetBrains_Mono'] font-bold whitespace-nowrap [--f:12px] [--ls:3px] xl:[--f:13px] 2xl:[--f:14px] fhd:[--f:16px] fhd:[--ls:3.5px] qhd:[--f:19px] qhd:[--ls:4.5px] min-[3840px]:[--f:24px] min-[3840px]:[--ls:6px] text-[length:min(var(--f),calc((3.3cqw-min(var(--ls),0.9cqw))/0.62))] tracking-[min(var(--ls),0.9cqw)] leading-[16px] xl:leading-[17px] 2xl:leading-[18px] fhd:leading-[20px] qhd:leading-[24px] min-[3840px]:leading-[30px] text-[#4AD496] uppercase mb-2 xl:mb-2.5 2xl:mb-3 fhd:mb-3.5 qhd:mb-4.5 min-[3840px]:mb-6"
              >
                Empowering Education Worldwide
              </m.p>

              <m.h2
                variants={headingVariants}
                className="whitespace-nowrap [--f:30px] sm:[--f:36px] md:[--f:48px] lg:[--f:56px] xl:[--f:60px] 2xl:[--f:64px] fhd:[--f:80px] qhd:[--f:100px] min-[3840px]:[--f:140px] text-[length:min(var(--f),9.9cqw)] font-bold text-white tracking-tight leading-tight"
              >
                Connecting Globally
              </m.h2>

              <m.p
                variants={descVariants}
                className="text-white/90 text-[16px] md:text-[18px] xl:text-[19px] 2xl:text-[20px] fhd:text-[24px] qhd:text-[30px] min-[3840px]:text-[42px] leading-relaxed max-w-[520px] xl:max-w-[560px] 2xl:max-w-[600px] fhd:max-w-[720px] qhd:max-w-[920px] min-[3840px]:max-w-[1300px] mx-auto mt-2 xl:mt-2.5 2xl:mt-3 fhd:mt-4 qhd:mt-5 min-[3840px]:mt-7"
              >
                Get connected to any classroom. Learn beyond boundaries. Teach anyone anywhere - Experience BLearners TAB for Seamless Education.
              </m.p>
            </div>
          </m.div>
        </div>
      )}
    </section>
  );
}