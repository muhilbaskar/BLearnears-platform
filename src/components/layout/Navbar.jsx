import React, { useState, useCallback, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
// FIX: the logo was referenced with a hard-coded "/src/assets/..." string, which
// 404s in production builds. Importing lets Vite hash + cache it correctly.
import navLogo from "../../assets/Nav LOGO.svg";
import { navLinks } from "../../data/content";

// On "/" a plain hash scrolls instantly (native anchor).
// On /privacy-policy or /terms-conditions we send the user to "/#section" so
// react-router renders HomePage first; ScrollToTop in App.jsx intentionally does
// NOT scroll to top when a hash is present, so the browser then jumps to the section.
const useAnchor = () => {
  const { pathname } = useLocation();
  return useCallback(
    (hash) => (pathname === "/" ? hash : `/${hash}`),
    [pathname],
  );
};

// ---------- Drawer animation variants ----------
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
      staggerChildren: 0.05,
      delayChildren: 0.06,
    },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.24, ease: [0.4, 0, 1, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const anchor = useAnchor();

  // Esc closes the drawer + body scroll lock while open
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className="w-full bg-[#f8f9fa] pt-6 pb-6">
      <nav className="max-w-[1400px] mx-auto px-4 lg:px-8" aria-label="Main">
        <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center outline-none" aria-label="BLearners Home">
            <img
              src={navLogo}
              alt="BLearners Logo"
              width="160"
              height="48"
              decoding="async"
              fetchpriority="high"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((l, i) => (
                <Link
                  key={l.href}
                  to={anchor(l.href)}
                  className={
                    i === 0
                      ? "text-[15px] font-semibold text-[#a855f7] hover:text-purple-700 transition-colors"
                      : "text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  {l.name}
                </Link>
              ))}
            </div>

            <Link
              to={anchor("#register")}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white text-[15px] font-medium px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-md shadow-purple-200"
            >
              Register <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 p-2 -mr-2"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((o) => !o)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ---------- Mobile drawer (right-side slide-in, TRANSPARENT glass) ---------- */}
      <AnimatePresence initial={false}>
        {open && (
          <React.Fragment key="mobile-drawer-root">
            {/* Backdrop — lighter so page shows through the frosted panel */}
            <m.div
              key="mobile-drawer-backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={close}
              aria-hidden="true"
              className="md:hidden fixed inset-0 z-[60] bg-black/25 backdrop-blur-[2px]"
            />

            {/* Panel — transparent + frosted glass */}
            <m.aside
              key="mobile-drawer-panel"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden fixed top-0 right-0 z-[70] h-full w-[82%] max-w-[340px] flex flex-col
                         bg-white/55 backdrop-blur-2xl backdrop-saturate-150
                         border-l border-white/60
                         shadow-[-8px_0_30px_rgba(0,0,0,0.18)]"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/50">
                <Link to="/" onClick={close} aria-label="BLearners Home">
                  <img
                    src={navLogo}
                    alt="BLearners Logo"
                    width="140"
                    height="42"
                    decoding="async"
                    className="h-9 w-auto object-contain"
                  />
                </Link>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close menu"
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 -mr-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
                  </svg>
                </button>
              </div>

              {/* Drawer links */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-1">
                {navLinks.map((l, i) => (
                  <m.div key={l.href} variants={itemVariants}>
                    <Link
                      to={anchor(l.href)}
                      onClick={close}
                      className={
                        i === 0
                          ? "block py-3 text-[16px] font-semibold text-[#a855f7] border-b border-white/50"
                          : "block py-3 text-[16px] font-medium text-gray-700 border-b border-white/50 hover:text-[#a855f7] transition-colors"
                      }
                    >
                      {l.name}
                    </Link>
                  </m.div>
                ))}
              </div>

              {/* Drawer footer CTA */}
              <m.div variants={itemVariants} className="px-5 pb-6 pt-2">
                <Link
                  to={anchor("#register")}
                  onClick={close}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[15px] font-medium px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-md shadow-purple-200"
                >
                  Register <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </m.div>
            </m.aside>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}