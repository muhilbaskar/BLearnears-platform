import React from "react";
import { m } from "framer-motion";
import { featuresData } from "../../data/content";
import SectionHeading from "../ui/SectionHeading";

import LearningHeaderIcon from "../../assets/featuresSection/learning-header.svg";
import AiHeaderIcon from "../../assets/featuresSection/ai-header.svg";
import CollaborationHeaderIcon from "../../assets/featuresSection/collaboration-header.svg";
import AcademicHeaderIcon from "../../assets/featuresSection/academic-header.svg";

import InteractiveBookIcon from "../../assets/featuresSection/interactive-book.svg";
import InteractiveQAIcon from "../../assets/featuresSection/interactive-qa.svg";
import LiveClassesIcon from "../../assets/featuresSection/live-classes.svg";
import ExplanationVideoIcon from "../../assets/featuresSection/explanation-video.svg";
import Visualize3DIcon from "../../assets/featuresSection/visualize-3d.svg";
import LiveDataIcon from "../../assets/featuresSection/live-data.svg";

import BlendedIntelligenceIcon from "../../assets/featuresSection/blended-intelligence.svg";
import VerifyAnswersIcon from "../../assets/featuresSection/verify-answers.svg";
import SelfAssessmentIcon from "../../assets/featuresSection/self-assessment.svg";
import RaiseDoubtsIcon from "../../assets/featuresSection/raise-doubts.svg";

import JoinClassroomIcon from "../../assets/featuresSection/join-classroom.svg";
import ChatClassmatesIcon from "../../assets/featuresSection/chat-classmates.svg";
import CoStudyIcon from "../../assets/featuresSection/co-study.svg";

import AssignmentsIcon from "../../assets/featuresSection/assignments.svg";
import BTuitionsIcon from "../../assets/featuresSection/b-tuitions.svg";
import BCoursesIcon from "../../assets/featuresSection/b-courses.svg";
import BStoreIcon from "../../assets/featuresSection/b-store.svg";

const icons = {
  headers: { learning: LearningHeaderIcon, ai: AiHeaderIcon, collaboration: CollaborationHeaderIcon, academic: AcademicHeaderIcon },
  learning: [InteractiveBookIcon, InteractiveQAIcon, LiveClassesIcon, ExplanationVideoIcon, Visualize3DIcon, LiveDataIcon],
  ai: [BlendedIntelligenceIcon, VerifyAnswersIcon, SelfAssessmentIcon, RaiseDoubtsIcon],
  collaboration: [JoinClassroomIcon, ChatClassmatesIcon, CoStudyIcon],
  academic: [AssignmentsIcon, BTuitionsIcon, BCoursesIcon, BStoreIcon],
};

const GRADIENT_BAR = "linear-gradient(87.24deg, #8D00FF 1.33%, #D500FF 33.15%, #EF00FF 42.68%, #E132F7 56.89%, #D002FF 74.17%, #CF02FF 97.01%)";
const barStyle = { background: GRADIENT_BAR };
const headerCircle = { background: "linear-gradient(128.51deg, #CB02FF 18.44%, #C402FF 33.03%, #4A54ED 83.76%)" };
const glowStyle = { background: "radial-gradient(circle at 50% 0%, rgba(141, 0, 255, 0.08), transparent 70%)" };

// Variants so the parent's stagger actually drives the cards (before, the cards had
// their own initial/whileInView which silently overrode the parent's stagger).
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const cardVariants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };
const hoverCard = { y: -10, scale: 1.02 };

const FeatureBlock = React.memo(function FeatureBlock({ title, icon: HeaderIcon, items, categoryIcons }) {
  return (
    <m.div
      variants={cardVariants}
      whileHover={hoverCard}
      className="group relative bg-white flex flex-col overflow-hidden border border-[#F3F4F6] hover:border-[#E9D5FF] shadow-[0px_8px_24px_rgba(0,0,0,0.04)] hover:shadow-[0px_20px_40px_rgba(141,0,255,0.15)] transition-[box-shadow,border-color] duration-300 h-full"
      style={{ width: "100%", maxWidth: "755.5px", padding: "clamp(20px, 5vw, 31.8px)", borderRadius: "32px" }}
    >
      <div className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" style={glowStyle} />
      {/* scaleX instead of animating width: compositor-only, no layout */}
      <div className="absolute top-0 left-0 h-[3px] w-full rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" style={barStyle} />

      <div className="flex items-center gap-4 mb-10 relative z-10">
        {/* Header circle icon — rotates RIGHT on card hover (unchanged) */}
        <div className="w-11 h-11 text-white rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" style={headerCircle}>
          <img src={HeaderIcon} alt="" width="24" height="24" loading="lazy" decoding="async" className="w-6 h-6 object-contain" />
        </div>
        <h3 className="text-[22px] font-bold text-[#111827] group-hover:text-[#8D00FF] transition-colors duration-300">{title}</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 relative z-10" style={{ gap: "24px", rowGap: "32px" }}>
        {items.map((feat, i) => (
          // Pure-CSS hover (was 2 framer-motion elements x 17 items)
          <div
            key={feat.title}
            className="group/item flex flex-col gap-2.5 rounded-xl p-2 -m-2 cursor-default transition-[background-color,transform] duration-300 hover:bg-[#FAF5FF] hover:translate-x-1"
          >
            {/* Feature icon — now rotates RIGHT on hover (was -rotate-[8deg] / left) */}
            <img
              src={categoryIcons[i]}
              alt=""
              width="22"
              height="22"
              loading="lazy"
              decoding="async"
              className="w-[22px] h-[22px] object-contain mb-1 transition-transform duration-300 group-hover/item:scale-125 group-hover/item:rotate-[8deg]"
            />
            <h4 className="font-semibold text-[15px] text-[#111827]">{feat.title}</h4>
            <p className="text-[13px] text-[#6B7280] leading-[1.4] pr-4">{feat.desc}</p>
          </div>
        ))}
      </div>
    </m.div>
  );
});

export default function FeaturesSection() {
  return (
    <section id="features" className="cv-auto py-10 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading badge="Features of B-Learners" title="Powerful Tools for Future Education" subtitle="One platform for all Curriculum" variant="features" />

        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid lg:grid-cols-2 mx-auto mt-16 items-stretch"
          style={{ gap: "24px", maxWidth: "1535px" }}
        >
          <FeatureBlock title="Learning" icon={icons.headers.learning} items={featuresData.learning} categoryIcons={icons.learning} />
          <FeatureBlock title="BI Assistance" icon={icons.headers.ai} items={featuresData.ai} categoryIcons={icons.ai} />
          <FeatureBlock title="Collaboration" icon={icons.headers.collaboration} items={featuresData.collaboration} categoryIcons={icons.collaboration} />
          <FeatureBlock title="Academic" icon={icons.headers.academic} items={featuresData.academic} categoryIcons={icons.academic} />
        </m.div>
      </div>
    </section>
  );
}