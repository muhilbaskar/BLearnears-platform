import React from "react";
import { m } from "framer-motion";
import { pillars } from "../../data/content";

import adminIcon from "../../assets/pillars/administrator.svg";
import teacherIcon from "../../assets/pillars/teachers.svg";
import studentIcon from "../../assets/pillars/students.svg";
import parentIcon from "../../assets/pillars/parents.svg";
import centerLogo from "../../assets/pillars/center-logo.svg";

const customIcons = { Administrator: adminIcon, Teachers: teacherIcon, Students: studentIcon, Parents: parentIcon };

const GRADIENT = "linear-gradient(87.24deg, #8D00FF 1.33%, #D500FF 33.15%, #EF00FF 42.68%, #E132F7 56.89%, #D002FF 74.17%, #CF02FF 97.01%)";
const textGradient = { background: GRADIENT, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", color: "transparent" };
const barStyle = { background: GRADIENT };
const glowStyle = { background: "radial-gradient(circle at 50% 0%, rgba(141, 0, 255, 0.08), transparent 70%)" };

const hoverCard = { y: -10, scale: 1.03 };

// One card component instead of two copy-pasted 60-line blocks.
// Hover effects (glow, bar, icon spin, title colour) are pure CSS => no per-card
// framer-motion observers/animations, much cheaper on mobile.
//
// Icon hover animation rotates RIGHT (clockwise) on both sides: rotate-12.
// The lateral ENTRY animation (fromX) still differs per side: the left card
// slides in from the left, the right card slides in from the right — matching
// your original file so the section still feels balanced.
const PillarCard = React.memo(function PillarCard({ pillar, index, side }) {
  const fromX = side === "left" ? -30 : 30;
  const spin = "group-hover:rotate-12";
  return (
    <m.div
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={hoverCard}
      className="group relative bg-white p-8 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(141,0,255,0.15)] border border-gray-100 hover:border-[#D4A5FF] transition-[box-shadow,border-color] duration-300 overflow-hidden h-full flex flex-col items-center text-center"
    >
      <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" style={glowStyle} />
      <div className="absolute top-0 left-0 h-[3px] w-full rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" style={barStyle} />

      <div className={`w-12 h-12 shrink-0 bg-[#F4E8FF] group-hover:bg-[#E9D5FF] rounded-full flex items-center justify-center mb-6 relative z-10 transition-[transform,background-color] duration-300 group-hover:scale-110 ${spin}`}>
        <img src={customIcons[pillar.title]} alt="" width="24" height="24" loading="lazy" decoding="async" className="w-6 h-6 object-contain" />
      </div>

      <h3 className="text-[20px] font-bold text-[#0B0F19] mb-2 relative z-10 group-hover:text-[#8D00FF] transition-colors duration-300">{pillar.title}</h3>
      <p className="text-[15px] text-[#6B7280] leading-[1.6] relative z-10 flex-grow">{pillar.desc}</p>
    </m.div>
  );
});

export default function PillarsSection() {
  return (
    <section className="cv-auto py-10 bg-[#F8F9FA] relative overflow-hidden">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header: one animated wrapper instead of 5 separate whileInView observers */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8D00FF] animate-pulse" />
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase" style={textGradient}>Four Pillars</span>
          </div>

          <h2 className="text-4xl lg:text-[50px] font-extrabold text-[#0B0F19] leading-[1.15] mb-5 tracking-tight">
            Connecting Every Pillar of <br className="hidden md:block" /> Education
          </h2>

          <p className="text-[17px] text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            BLearners TAB is the gateway to BEE, connecting Administrators, Teachers, Students and Parents.
          </p>
        </m.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          <div className="flex flex-col gap-6">
            {pillars.slice(0, 2).map((p, i) => (
              <PillarCard key={p.title} pillar={p} index={i} side="left" />
            ))}
          </div>

          {/* Centre gateway graphic (unchanged look) */}
          <div className="flex justify-center items-center relative my-10 lg:my-0">
            <div className="absolute inset-0 bg-purple-500/10 blur-[50px] rounded-full w-[250px] h-[250px] m-auto pointer-events-none" />
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full bg-white flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.15)] z-10"
            >
              <div className="absolute inset-3 border border-dashed border-[#E9D5FF] rounded-full pointer-events-none" />
              <div className="flex flex-col items-center justify-center z-20">
                <div className="w-[60px] h-[60px] bg-gradient-to-br from-[#D600FF] to-[#6B2CFF] text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                  <img src={centerLogo} alt="" width="28" height="28" loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
                </div>
                <h4 className="font-extrabold text-[18px] text-[#0B0F19] tracking-tight">BLearners TAB</h4>
                <p className="text-[13px] text-[#6B7280] font-medium mt-1">Gateway to BEE</p>
              </div>
            </m.div>
          </div>

          <div className="flex flex-col gap-6">
            {pillars.slice(2).map((p, i) => (
              <PillarCard key={p.title} pillar={p} index={i} side="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}