import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import { m } from "framer-motion";
import useInViewport from "../../hooks/useInViewport";

import bStoreImg from "../../assets/onetab/b-store.png";
import bClassImg from "../../assets/onetab/b-class.png";
import tabLogoImg from "../../assets/onetab/tab-logo.svg";

// b-Book is now a video instead of an image.
const B_BOOK_VIDEO =
  "https://apidev.cloud/media-service/static/608e6cd1-b829-4767-a1a2-5bc1913b27d3/b9c026a2-e04a-4652-9ac1-dc9188bb83d5/aimode33/1191b621a03047c8ad81fb1b0791394d.mp4";

const TAGS = ["b-Class", "b-Store", "b-Book", "b-Assignment", "b-Result", "My Class", "Blended Intelligence", "And More..."];

const TABLETS = [
  { id: "b-store", img: bStoreImg, alt: "b-Store UI" },
  { id: "b-class", img: bClassImg, alt: "b-Class UI" },
  { id: "b-book", video: B_BOOK_VIDEO, alt: "b-Book UI" },
];

const SLOT_TABLET_MAP = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
const SIDE_X_PERCENT = 80;

const BASE_WIDTH_CLASS =
  "w-[272px] min-[375px]:w-[300px] min-[425px]:w-[320px] md:w-[420px] lg:w-[508px] h-[340px] min-[375px]:h-[375px] min-[425px]:h-[400px] md:h-[520px] lg:h-[636px]";

const SLOT_TRANSFORMS = [
  `translate3d(-${SIDE_X_PERCENT}%, 0, 0) scale(0.82)`,
  "translate3d(0%, 0, 0) scale(1)",
  `translate3d(${SIDE_X_PERCENT}%, 0, 0) scale(0.82)`,
];
const SLOT_Z_INDEX = [10, 30, 10];

// Shadows are STATIC now. Transitioning box-shadow forces a repaint every frame;
// transforms alone are compositor-only (smooth on low-end phones).
const CARD_SHADOW = "0 16px 40px rgba(0,0,0,0.5)";

const Pill = memo(function Pill({ label }) {
  return (
    <span className="inline-flex items-center px-4 py-2 rounded-full border border-[#3F3C7A] bg-[#25215A]/60 text-[13px] font-medium text-[#C7D2FE] cursor-pointer transition-[transform,background-color,border-color,color] duration-300 ease-out hover:bg-[#3F3C7A]/70 hover:border-indigo-400 hover:text-white hover:scale-105 hover:-translate-y-0.5">
      {label}
    </span>
  );
});

const TabletCard = memo(function TabletCard({ tablet, slotIdx }) {
  // b-Book is a video; the other two are still images.
  // The video only plays while this tablet is in the CENTER (active) slot,
  // so we are not decoding 3 videos at once.
  const isCenter = slotIdx === 1;

  return (
    <div
      className={`absolute bottom-0 ${BASE_WIDTH_CLASS} bg-[#1E1D2D] rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-3 lg:p-4`}
      style={{
        transform: SLOT_TRANSFORMS[slotIdx],
        zIndex: SLOT_Z_INDEX[slotIdx],
        boxShadow: CARD_SHADOW,
        willChange: "transform",
        backfaceVisibility: "hidden",
        transition: "transform 900ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div className="w-full h-full rounded-[1.5rem] md:rounded-[1.8rem] overflow-hidden bg-[#F8F9FA]">
        {tablet.video ? (
          <video
            src={tablet.video}
            alt={tablet.alt}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label={tablet.alt}
          />
        ) : (
          <img
            src={tablet.img}
            alt={tablet.alt}
            width="508"
            height="636"
            className="w-full h-full object-fill"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}
      </div>

      {/*
        Tab logo: this wrapper covers exactly the bottom black bezel of the card.
        Its height matches the card padding on every breakpoint
        (p-2 = h-2, md:p-3 = md:h-3, lg:p-4 = lg:h-4), and flexbox centers the
        logo horizontally AND vertically inside it, so the logo always sits in the
        middle of the black border on all screen sizes.
        The logo height is kept smaller than the bezel so it never overlaps the screen.
      */}
      <div className="absolute bottom-0 left-0 right-0 h-2 md:h-3 lg:h-4 z-40 flex items-center justify-center pointer-events-none">
        <img
          src={tabLogoImg}
          alt=""
          className="h-[5px] min-[425px]:h-[6px] md:h-[8px] lg:h-[10px] w-auto max-h-full object-contain drop-shadow-lg pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
});

export default function OneTabSection() {
  const [rotation, setRotation] = useState(0);
  const sectionRef = useRef(null);
  const inView = useInViewport(sectionRef, { rootMargin: "0px" });

  // States for swipe/drag functionality
  const dragStartRef = useRef(null);

  // Rotate only while the section is visible (and the tab is active)
  useEffect(() => {
    if (!inView) return undefined;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const id = setInterval(() => {
      if (!document.hidden) setRotation((p) => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(id);
  }, [inView]);

  const tabletSlot = useMemo(() => {
    const slots = [0, 0, 0];
    SLOT_TABLET_MAP[rotation].forEach((tabletIdx, slotIdx) => {
      slots[tabletIdx] = slotIdx;
    });
    return slots;
  }, [rotation]);

  // Swipe / Drag Handlers
  const handlePointerDown = (e) => {
    dragStartRef.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (dragStartRef.current === null) return;
    const dragDistance = e.clientX - dragStartRef.current;
    
    // Threshold to prevent accidental swipes on simple clicks
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        // Dragged Right -> Prev
        setRotation((p) => (p - 1 + 3) % 3);
      } else {
        // Dragged Left -> Next
        setRotation((p) => (p + 1) % 3);
      }
    }
    dragStartRef.current = null;
  };

  const handlePointerCancel = () => {
    dragStartRef.current = null;
  };

  return (
    <section
      id="onetab"
      ref={sectionRef}
      className="text-white text-center relative overflow-hidden px-4 sm:px-8 lg:px-[140.4px]"
      style={{ paddingTop: "70px", paddingBottom: "70px", background: "radial-gradient(50% 50% at 50% 50%, #4440B3 0%, #121050 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto relative z-10">
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl lg:text-[48px] font-bold mb-4 tracking-tight"
        >
          One TAB. Fearless Education
        </m.h2>

        <p className="text-[#A5B4FC] mb-2 text-[17px]">Experience any time teaching and learning on an interactive platform.</p>
        <p className="text-[#A5B4FC] mb-10 text-[17px]">Learn beyond books &amp; boundaries</p>

        <div className="relative z-20 flex flex-wrap justify-center gap-3 mb-10 max-w-4xl mx-auto">
          {TAGS.map((pill) => (
            <Pill key={pill} label={pill} />
          ))}
        </div>

        <div 
          className="relative flex justify-center items-end mt-10 md:-mt-16 w-full max-w-[1300px] mx-auto pb-16 md:pb-24 h-[360px] min-[375px]:h-[395px] min-[425px]:h-[420px] md:h-[560px] lg:h-[700px] select-none touch-pan-y"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          {TABLETS.map((tablet, tabletIdx) => (
            <TabletCard key={tablet.id} tablet={tablet} slotIdx={tabletSlot[tabletIdx]} />
          ))}
        </div>
      </div>
    </section>
  );
}