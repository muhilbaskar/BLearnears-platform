import React from "react";
import { m } from "framer-motion";
import { benefits } from "../../data/content";
import SectionHeading from "../ui/SectionHeading";

import Icon1 from "../../assets/benefits/1.svg";
import Icon2 from "../../assets/benefits/2.svg";
import Icon3 from "../../assets/benefits/3.svg";
import Icon4 from "../../assets/benefits/4.svg";
import Icon5 from "../../assets/benefits/5.svg";
import Icon6 from "../../assets/benefits/6.svg";
import Icon7 from "../../assets/benefits/7.svg";
import Icon8 from "../../assets/benefits/8.svg";
import Icon9 from "../../assets/benefits/9.svg";
import Icon10 from "../../assets/benefits/10.svg";
import Icon11 from "../../assets/benefits/11.svg";
import Icon12 from "../../assets/benefits/12.svg";
import Icon13 from "../../assets/benefits/13.svg";
import Icon14 from "../../assets/benefits/14.svg";
import Icon15 from "../../assets/benefits/15.svg";

const customIcons = [Icon1, Icon2, Icon3, Icon4, Icon5, Icon6, Icon7, Icon8, Icon9, Icon10, Icon11, Icon12, Icon13, Icon14, Icon15];

const smoothSpring = { type: "spring", stiffness: 260, damping: 22, mass: 0.6 };

const cardHover = { hover: { scale: 1.035, y: -6, transition: smoothSpring } };
const borderHover = { hover: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } } };
const iconHover = { hover: { scale: 1.08, rotate: -4, transition: smoothSpring } };
const cardShadow = { boxShadow: "0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)" };
const tapScale = { scale: 0.985 };

const badge = (
  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.04)] mb-4">
    <div className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#D500FF] to-[#8D00FF]" />
    <span
      className="font-['Manrope'] font-semibold text-[12px] leading-[16px] tracking-[0.6px] text-center align-middle bg-clip-text text-transparent"
      style={{ backgroundImage: "linear-gradient(87.24deg, #8D00FF 1.33%, #D500FF 33.15%, #EF00FF 42.68%, #E132F7 56.89%, #D002FF 74.17%, #CF02FF 97.01%)" }}
    >
      Benefits
    </span>
  </div>
);

const title = (
  <span className="font-['Sora'] font-semibold text-[30px] leading-[36px] sm:text-[40px] sm:leading-[44px] lg:text-[48px] lg:leading-[48px] tracking-[-0.96px] text-center text-[#0B0F2B] block mt-2">
    Learning Beyond the <br /> Classroom
  </span>
);

const BenefitCard = React.memo(function BenefitCard({ text, icon, index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 3) * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      whileTap={tapScale}
      variants={cardHover}
      className="group relative bg-white py-3.5 px-5 rounded-[1.25rem] flex items-center gap-4"
      style={cardShadow}
    >
      <m.span
        aria-hidden
        initial={{ opacity: 0 }}
        variants={borderHover}
        className="pointer-events-none absolute inset-0 rounded-[1.25rem] border-[1.5px] border-[#CF02FF]"
      />
      <m.div variants={iconHover} className="w-12 h-12 rounded-full bg-[#F4EAFF] flex flex-shrink-0 items-center justify-center relative z-10 will-change-transform">
        {icon && <img src={icon} alt="" width="20" height="20" loading="lazy" decoding="async" className="w-5 h-5 object-contain" />}
      </m.div>
      <span className="relative z-10 text-[15px] font-medium text-gray-800 leading-[1.3]">{text}</span>
    </m.div>
  );
});

export default function BenefitsSection() {
  return (
    <section id="benefits" className="cv-auto py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center w-full">
          <SectionHeading badge={badge} title={title} />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-[-2%]">
          {benefits.map((b, i) => (
            <BenefitCard key={b} text={b} icon={customIcons[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
