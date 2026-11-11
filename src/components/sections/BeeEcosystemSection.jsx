import React, { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import useInViewport from "../../hooks/useInViewport";
import { getPageScale } from "../../utils/pageScale";

import bClassIcon from "../../assets/orbit/b-class.svg";
import bNoteIcon from "../../assets/orbit/b-note.svg";
import bLearnersIcon from "../../assets/orbit/b-learners-tab.svg";
import bAdminIcon from "../../assets/orbit/b-administrator.svg";
import bBookIcon from "../../assets/orbit/b-book.svg";
import curriculumIcon from "../../assets/orbit/curriculum.svg";
import bParentsIcon from "../../assets/orbit/b-parents.svg";
import bTeachersIcon from "../../assets/orbit/b-teachers.svg";
import bResultIcon from "../../assets/orbit/b-result.svg";
import bStudentsIcon from "../../assets/orbit/b-students.svg";
import bAssignmentIcon from "../../assets/orbit/b-assignment.svg";
import galaxyBg from "../../assets/orbit/galaxy-bg.png";

/* ------------------------------------------------------------------ */
/* Star field                                                          */
/* The old version rendered ~220 framer-motion <div>s (JS-driven, with */
/* animated box-shadow = repaint every frame). Now each layer is ONE   */
/* element whose many stars are box-shadows, animated by CSS on the    */
/* GPU (transform/opacity only). Seeded RNG => identical every render. */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shadows(count, seed, make) {
  const r = rng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = (r() * 100).toFixed(2); // vw
    const y = Math.round(r() * 1300); // px (section overflow is clipped)
    out.push(`${x}vw ${y}px ${make(r)}`);
  }
  return out.join(",");
}

const GLOW_COLORS = ["255,255,255", "160,200,255", "200,150,255", "255,220,150"];

const STAR_LAYERS = {
  far: shadows(80, 11, () => "0 0 rgba(255,255,255,.75)"),
  near: shadows(34, 22, () => "0 0 6px 1px rgba(180,200,255,.9)"),
  glow: shadows(28, 33, (r) => {
    const c = GLOW_COLORS[Math.floor(r() * GLOW_COLORS.length)];
    return `0 0 10px 3px rgba(${c},.85)`;
  }),
  float: shadows(22, 44, () => "0 0 4px 1px rgba(255,255,255,.8)"),
};

const SHOOTING = [
  { top: "8%", left: "6%", delay: "1s", dur: "13s" },
  { top: "22%", left: "38%", delay: "6s", dur: "17s" },
  { top: "5%", left: "62%", delay: "10s", dur: "15s" },
];

/* ------------------------------------------------------------------ */
/* Orbit styles                                                        */
/* Font size / line-height live in Tailwind classes (see OrbitRing)    */
/* so they can grow on laptop / laptop-L / 4K screens.                 */
/* ------------------------------------------------------------------ */
const orbitLabelStyle = {
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 400,
  letterSpacing: "1px",
  verticalAlign: "middle",
};

const orb = (mid, border, glow) => ({
  background: `radial-gradient(100.42% 100.42% at 30% 28%, rgba(239, 250, 255, 0.9) 0%, ${mid} 58%, #030819 100%)`,
  border: `1.31px solid ${border}`,
  boxShadow: `0px 0px 15.72px 1.31px ${glow}59 inset, 0px 0px 23.58px 0px ${glow}73`,
});

const bNoteStyle = {
  background: "radial-gradient(100.42% 100.42% at 30% 28%, rgba(239, 250, 255, 0.9) 0%, #7F7051 58%, #030819 100%)",
  border: "1px solid #F1C45E8C",
  boxShadow: "0px 0px 12px 1px #F1C45E59 inset, 0px 0px 18px 0px #F1C45E73",
};

const OUTER_ITEMS = [
  { icon: bLearnersIcon, alt: "B-Learners", style: orb("#AC7F5E", "#AC7F5E8C", "#B671F9"), color: "#AC7F5E", lines: ["B-Learners", "TAB Platform"] },
  { icon: bAdminIcon, alt: "b-Administrator", style: orb("#952E2B", "#952E2B8C", "#B671F9"), color: "#FC8181", lines: ["b-Administrator"] },
  { icon: curriculumIcon, alt: "Curriculum", style: orb("#335F9D", "#59A6FF8C", "#59A6FF"), color: "#63B3ED", lines: ["Curriculum", "& Syllabus"] },
  { icon: bParentsIcon, alt: "b-Parents", style: orb("#FF8D28", "#FF8D288C", "#B671F9"), color: "#F6AD55", lines: ["b-Parents"] },
  { icon: bTeachersIcon, alt: "b-Teachers", style: orb("#E46962", "#E469628C", "#B671F9"), color: "#E46962", lines: ["b-Teachers"] },
  { icon: bResultIcon, alt: "b-Result", style: orb("#7F7051", "#F1C45E8C", "#F1C45E"), color: "#B89B5E", lines: ["b-Result"] },
];

const INNER_ITEMS = [
  { icon: bNoteIcon, alt: "b-Note", style: bNoteStyle, color: "#B89B5E", lines: ["b-Note"] },
  { icon: bClassIcon, alt: "b-Class", style: orb("#634596", "#B671F98C", "#B671F9"), color: "#8B5CF6", lines: ["b-Class"] },
  { icon: bBookIcon, alt: "b-Book", style: orb("#20828F", "#27EAEA8C", "#27EAEA"), color: "#4FD1C5", lines: ["b-Book"] },
  { icon: bAssignmentIcon, alt: "b-Assignment", style: orb("#335F9D", "#59A6FF8C", "#59A6FF"), color: "#5A7BC0", lines: ["b-Assignment"] },
  { icon: bStudentsIcon, alt: "b-Students", style: orb("#34C759", "#34C7598C", "#B671F9"), color: "#34C759", lines: ["b-Students"] },
];

// One generic ring (was 11 hand-copied blocks). Same geometry & animation.
// Icon circles, icons and labels are bigger from 1024px up (lg:), and are
// re-proportioned to the design screenshot from 2200px up (min-[2200px]:).
//
// MOBILE-ONLY ADDITION: below 640px the icon circle is slightly smaller
// (w-8 h-8) and the icon inside it is slightly smaller (w-4 h-4), so that
// the icons stay visually proportionate inside the now-smaller inner ring.
// sm: and up are byte-for-byte identical to the original.
const OrbitRing = React.memo(function OrbitRing({ items, sizeClass, borderClass, duration, ringReverse, gap }) {
  const step = 360 / items.length;
  return (
    <div className={`absolute ${sizeClass} rounded-full border ${borderClass} flex items-center justify-center`}>
      <div
        className="absolute inset-0 animate-spin-slow"
        style={{ animationDuration: `${duration}s`, animationDirection: ringReverse ? "reverse" : "normal" }}
      >
        {items.map((item, i) => {
          const angle = Math.round(step * i);
          return (
            <div
              key={item.alt}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div
                  className="animate-spin-slow"
                  style={{ animationDuration: `${duration}s`, animationDirection: ringReverse ? "normal" : "reverse" }}
                >
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <div className={`flex flex-col items-center ${gap}`}>
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[86px] lg:h-[86px] min-[2200px]:w-[87px] min-[2200px]:h-[87px] rounded-full flex items-center justify-center"
                        style={item.style}
                      >
                        <img
                          src={item.icon}
                          alt=""
                          width="24"
                          height="24"
                          loading="lazy"
                          decoding="async"
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-10 lg:h-10 min-[2200px]:w-9 min-[2200px]:h-9 object-contain brightness-0 invert"
                        />
                      </div>
                      <span
                        className="text-center whitespace-nowrap text-[16px] leading-[18px] lg:text-[22px] lg:leading-[28px] min-[2200px]:text-[19px] min-[2200px]:leading-[24px] font-medium"
                        style={{ ...orbitLabelStyle, color: item.color }}
                      >
                        {item.lines.map((line, li) => (
                          <React.Fragment key={line}>
                            {li > 0 && <br />}
                            {line}
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const GRADIENT = "linear-gradient(128.51deg, #CB02FF 18.44%, #C402FF 33.03%, #4A54ED 83.76%)";
const gradientText = { background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" };

// Heading colour from the design screenshot: magenta on the left, shifting through
// violet to a blue-violet on the right (first line); the second line stays magenta.
const HEADING_GRADIENT = "linear-gradient(95deg, #D000FF 0%, #BC0AFF 30%, #8F2DFF 65%, #5B50F0 100%)";
const headingGradientText = {
  background: HEADING_GRADIENT,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  color: "transparent",
};

const nebulaBase = {
  top: "-10%", left: "-10%", width: "120%", height: "120%",
  backgroundImage: `url(${galaxyBg})`, backgroundSize: "cover", backgroundPosition: "center",
};

// Orbit scene at laptop+ size (>= 1024px): outer ring 920px + label overhang on both sides.
// The scene is measured against its real column and scaled to fit, so it is as
// big as possible at 1024px, 1440px and every size in between.
const ORBIT_FIT_WIDTH = 1060;
const ORBIT_SCENE_HEIGHT = 1020;
const ORBIT_MAX_FIT = 1.25; // allow the orbit to grow a little past 100% on very wide screens

// 4K / design-exact mode (>= 2200px).
// Numbers below are measured from the design screenshot (1849px wide):
//   outer ring 770px, whole orbit incl. icons + labels 870px tall.
// Everything is scaled by (viewport width / 1849), so at 2560px the section is an exact
// 1.3845x enlargement of the screenshot, and at other widths >= 2200px it stays proportional.
const DESIGN_MIN_W = 2200;
const DESIGN_W = 1849;
const DESIGN_RING = 770;
const DESIGN_EXTENT_H = 870;
const ORBIT_RING_SCENE = 920; // outer ring size inside the scene (lg:w-[920px])

// 4K fix: the 4K layout above is built in vw units and real pixels (exact design at
// zoom 1). The page is now zoomed (see utils/pageScale.js) and CSS zoom also scales vw,
// which pushed the orbit column out of its slot. From DESIGN_MIN_W up, this section
// cancels the page zoom, so the orbit / card render exactly as designed.
const getBeeZoom = () => {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth < DESIGN_MIN_W) return 1;
  const s = getPageScale();
  return s === 1 ? 1 : Math.round((1 / s) * 1000) / 1000;
};

const badgeTextStyle = {
  ...gradientText,
  fontFamily: "'Manrope', sans-serif",
  fontWeight: 600,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  textAlign: "center",
};

// Card look from the design: dark navy panel, lighter top-left, soft blue glow at the
// bottom-right, thin light-blue border. The gold highlight on the top edge is a separate
// element inside the card.
const cardStyle = {
  background:
    "linear-gradient(155deg, rgba(52,60,104,0.42) 0%, rgba(24,28,56,0.90) 36%, rgba(15,18,40,0.94) 72%, rgba(27,36,82,0.90) 100%)",
  borderColor: "rgba(198,225,255,0.20)",
};

const topGlowStyle = {
  background: "linear-gradient(90deg, rgba(214,170,80,0) 0%, rgba(214,170,80,0.8) 50%, rgba(214,170,80,0) 100%)",
};

const paragraphFont = { fontFamily: "'Manrope', sans-serif" };

export default function BeeEcosystemSection() {
  const ref = useRef(null);
  const inView = useInViewport(ref, { rootMargin: "100px" });

  const [beeZoom, setBeeZoom] = useState(getBeeZoom);
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setBeeZoom(getBeeZoom()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Fit the orbit to its column on laptops/desktops (>= 1024px). It measures the
  // real column width, so it never overflows or gets clipped at 1026px, 1440px
  // or any size in between. From 2200px up (4K) it uses the design-exact scale instead.
  // Below 1024px the existing Tailwind scale classes apply.
  const orbitColRef = useRef(null);
  const [layout, setLayout] = useState(null); // { fit, h } | null
  useEffect(() => {
    const el = orbitColRef.current;
    if (!el) return undefined;
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      if (!mq.matches) return setLayout(null);
      const w = window.innerWidth;
      let f;
      let h;
      if (w >= DESIGN_MIN_W) {
        const s = w / DESIGN_W; // design px -> screen px
        f = (s * DESIGN_RING) / ORBIT_RING_SCENE;
        h = Math.round(DESIGN_EXTENT_H * s);
      } else {
        f = Math.max(0.3, Math.min(ORBIT_MAX_FIT, el.clientWidth / ORBIT_FIT_WIDTH));
        h = Math.round(ORBIT_SCENE_HEIGHT * f) + 24;
      }
      setLayout((prev) => (prev !== null && Math.abs(prev.fit - f) < 0.005 && prev.h === h ? prev : { fit: f, h }));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="bee"
      className={`cv-auto py-16 md:py-24 min-[2200px]:py-[1.35vw] text-white relative overflow-hidden flex items-center lg:min-h-[900px] min-[1440px]:min-h-[1050px] min-[2200px]:min-h-[49.86vw] ${inView ? "" : "is-paused"}`}
      style={{ backgroundColor: "#0a0a1a", zoom: beeZoom === 1 ? undefined : beeZoom }}
    >
      {/* Galaxy layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Base nebula: STATIC, so its colour filter is rasterised once, not per frame */}
        <div className="absolute" style={{ ...nebulaBase, filter: "brightness(0.55) contrast(1.5) saturate(1.4)", transform: "scale(1.1)" }} />

        {/* Mirrored nebula: transform-only animation, hidden on small screens */}
        <div className="absolute inset-0 hidden md:block" style={{ transform: "scaleX(-1)" }}>
          <div className="absolute nebula-b" style={{ ...nebulaBase, opacity: 0.45 }} />
        </div>

        <div className="star-layer star-far" style={{ boxShadow: STAR_LAYERS.far }} />
        <div className="star-layer star-near" style={{ width: 2, height: 2, boxShadow: STAR_LAYERS.near }} />
        <div className="star-layer star-glow" style={{ width: 2, height: 2, boxShadow: STAR_LAYERS.glow }} />
        <div className="star-layer star-float hidden md:block" style={{ width: 2, height: 2, boxShadow: STAR_LAYERS.float }} />

        {SHOOTING.map((s, i) => (
          <div key={i} className="shooting-star hidden md:block" style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }} />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1a]/60 via-[#0a0a1a]/40 to-[#0a0a1a]/70 pointer-events-none z-10" />

      {/* Orbit column + card column.
          1024px -> 1440px: fitted columns (orbit measures its column and scales to fit).
          2200px and up (4K): columns are placed exactly like the design screenshot, in vw:
            orbit column 58.952vw (1090 / 1849) - unchanged.
          Card: starts at 53.813vw (995 / 1849, like the reference screenshot) and is 41.5vw wide, so at
          2560px: card starts at 1378px, 1062px wide, ~120px right margin. Its 4K classes use the
          important modifier (!) because the older lg: / min-[1440px]: classes otherwise win. */}
      <div className="max-w-[1500px] min-[1440px]:max-w-[1800px] min-[2200px]:max-w-none w-full mx-auto px-4 sm:px-6 lg:px-6 min-[1440px]:px-8 min-[2200px]:px-0 relative z-20 grid lg:grid-cols-[1fr_1fr] min-[1440px]:grid-cols-[1.05fr_1fr] min-[2200px]:grid-cols-[58.952vw_37.317vw_1fr] items-center gap-12 lg:gap-x-6 min-[1440px]:gap-x-[72px] min-[1700px]:gap-x-24 min-[2200px]:gap-x-0">
        {/* Left: orbit system */}
        <div
          ref={orbitColRef}
          className="relative min-w-0 h-[270px] min-[375px]:h-[320px] min-[425px]:h-[360px] min-[500px]:h-[450px] sm:h-[540px] md:h-[660px] lg:h-[640px] xl:h-[900px]"
          style={layout ? { height: layout.h } : undefined}
        >
          <div
            style={layout ? { scale: String(layout.fit) } : undefined}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 min-[2200px]:-mt-[1.3vw] h-[600px] md:h-[750px] lg:h-[1020px] flex items-center justify-center scale-[.45] min-[375px]:scale-[.53] min-[425px]:scale-[.6] min-[500px]:scale-[.75] sm:scale-90 md:scale-[.88] lg:scale-[.6] xl:scale-100">
            <OrbitRing
              items={OUTER_ITEMS}
              sizeClass="w-[480px] h-[480px] md:w-[680px] md:h-[680px] lg:w-[920px] lg:h-[920px]"
              borderClass="border-white/40"
              duration={60}
              ringReverse={false}
              gap="gap-2 lg:gap-3"
            />
            {/* INNER RING — mobile-only size shrink (300px -> 260px) increases the gap
                between the inner and outer rings on small screens. sm: and up unchanged. */}
            <OrbitRing
              items={INNER_ITEMS}
              sizeClass="w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[430px] md:h-[430px] lg:w-[575px] lg:h-[575px] min-[2200px]:w-[568px] min-[2200px]:h-[568px]"
              borderClass="border-white/50"
              duration={45}
              ringReverse
              gap="gap-1 lg:gap-2"
            />

            {/* Centre sun — mobile-only size shrink (180px -> 150px) increases the
                gap between the sun and the inner ring on small screens.
                sm: and up are byte-for-byte identical to the original. */}
            <div
              className="w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] md:w-[260px] md:h-[260px] lg:w-[320px] lg:h-[320px] min-[2200px]:w-[296px] min-[2200px]:h-[296px] rounded-full flex flex-col items-center justify-center shadow-[0_0_120px_rgba(255,165,0,0.8)] z-10 relative"
              style={{ background: "radial-gradient(92.02% 92.02% at 38% 32%, #FFF9D3 0%, #FFCD62 45%, #F28F29 75%, #D75C00 100%)" }}
            >
              <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] pointer-events-none" />
              <span className="text-2xl sm:text-3xl md:text-[54px] lg:text-[72px] min-[2200px]:text-[56px] font-extrabold text-[#3A1C00] tracking-tight z-20 leading-none">BEE</span>
              <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-[13px] min-[2200px]:text-[14px] font-bold text-[#3A1C00] text-center px-3 sm:px-4 leading-snug tracking-widest z-20 mt-1.5 sm:mt-2 lg:mt-3">
                BLENDED EDUCATION<br />ECOSYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* Right: text card, same style as the design.
            The card is a CSS container ([container-type:inline-size]) and everything inside it
            from 1024px up is sized in `cqw` (1cqw = 1% of the card's own width). The design
            proportions (heading 48px / padding 38px / paragraph 18px on a 690px card) therefore
            stay identical at every card size, and the card height follows the design ratio.
            Maximum card width per screen:
              1024px  -> 560px
              1440px  -> 760px
              1700px  -> 900px
              2200px+ -> 41.5vw wide (1062px at 2560px), starting at 53.813vw (995 / 1849) like the
                         reference screenshot. Inside, 4K uses the reference proportions (measured on the
                         638px card): padding 8.93cqw, heading 5.85cqw, paragraph 2.62cqw, height 56.1cqw.
            Below 1024px the original mobile/tablet sizes are used.
            backdrop-blur stays removed: blurring a live-animating background every frame is very expensive. */}
        <m.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={cardStyle}
          className="animated-border-card w-full min-w-0 mx-auto lg:justify-self-center lg:max-w-[560px] min-[1440px]:max-w-[760px] min-[1700px]:max-w-[900px] min-[2200px]:max-w-none! min-[2200px]:w-[41.5vw]! min-[2200px]:mx-0! min-[2200px]:ml-[calc(3.813vw-12px)]! min-[2200px]:justify-self-start! border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] [container-type:inline-size]"
        >
          {/* Gold highlight on the top edge (from the design) */}
          <div aria-hidden="true" className="pointer-events-none absolute top-0 left-[8%] h-px w-[38%] z-10" style={topGlowStyle} />

          <div className="relative z-10 p-6 sm:p-10 lg:p-[max(22px,5.5cqw)] lg:min-h-[59.7cqw] min-[2200px]:p-[8.93cqw]! min-[2200px]:min-h-[56.1cqw]! lg:flex lg:flex-col lg:justify-center">
            <span className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-white mb-6 lg:gap-[max(6px,1.2cqw)] lg:px-[max(10px,1.9cqw)] lg:py-[max(4px,0.7cqw)] lg:mb-[3.6cqw] min-[2200px]:mb-[5.2cqw]!">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CB02FF] lg:w-[max(6px,0.9cqw)] lg:h-[max(6px,0.9cqw)]" />
              <span
                className="text-[11px] leading-[16px] lg:text-[length:max(11px,1.75cqw)] min-[2200px]:text-[length:1.9cqw]! lg:leading-none"
                style={badgeTextStyle}
              >
                INTRODUCING BEE
              </span>
            </span>

            {/*
              Heading: ALWAYS exactly two lines on every screen:
                line 1: "One Ecosystem, Seamless"
                line 2: "Education."
              - <br /> forces the break, whitespace-nowrap stops line 1 from wrapping again.
              - Font size is sized from the card's own width (container query units), so the
                long first line always fits inside the card padding:
                  < 640px  : (card width - 48px padding) / 14.5, max 44px
                  640-1023 : (card width - 80px padding) / 14.5, max 52px
                  1024+    : 6.1cqw  (card padding is 5.5cqw per side)
                  2200+    : 5.85cqw (exact design proportion, unchanged)
            */}
            <h2 className="mb-4 lg:mb-[1.9cqw] min-[2200px]:mb-[3.9cqw]!">
              <span
                style={{
                  ...headingGradientText,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 600,
                  display: "block",
                }}
                className="whitespace-nowrap tracking-[-0.02em] leading-[1.1] pb-[0.08em] text-[length:min(44px,calc((100cqw_-_48px)/14.5))] sm:text-[length:min(52px,calc((100cqw_-_80px)/14.5))] lg:text-[length:max(18px,6.1cqw)] lg:leading-[1.03] lg:pb-[0.06em] min-[2200px]:text-[length:5.85cqw]!"
              >
                One Ecosystem, Seamless
                <br />
                Education.
              </span>
            </h2>

            <p
              className="text-white text-[16px] leading-[1.7] lg:text-[length:max(14px,2.61cqw)] lg:leading-[1.555] min-[2200px]:text-[length:2.62cqw]! min-[2200px]:leading-[1.62]!"
              style={paragraphFont}
            >
              BEE seamlessly blends the strengths of traditional teaching and learning methods with the power of modern technology. It enhances traditional education methodology instead of replacing it.
            </p>
          </div>
        </m.div>
      </div>
    </section>
  );
}