import React, { useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
// FIX: the logo was referenced with a hard-coded "/src/assets/..." string, which
// 404s in production builds. Importing lets Vite hash + cache it correctly.
import navLogo from "../../assets/Nav LOGO.svg";
import { navLinks } from "../../data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="w-full bg-[#f8f9fa] pt-6 pb-6">
      <nav className="max-w-[1400px] mx-auto px-4 lg:px-8" aria-label="Main">
        <div className="bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center outline-none" aria-label="BLearners Home">
            <img
              src={navLogo}
              alt="BLearners Logo"
              width="160"
              height="48"
              decoding="async"
              fetchPriority="high"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={
                    i === 0
                      ? "text-[15px] font-semibold text-[#a855f7] hover:text-purple-700 transition-colors"
                      : "text-[15px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  }
                >
                  {l.name}
                </a>
              ))}
            </div>

            <a
              href="#register"
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white text-[15px] font-medium px-6 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-md shadow-purple-200"
            >
              Register <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 p-2 -mr-2"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-menu" className="md:hidden mt-3 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-5 flex flex-col gap-4">
            {navLinks.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={close}
                className={i === 0 ? "text-[15px] font-semibold text-[#a855f7]" : "text-[15px] font-medium text-gray-600"}
              >
                {l.name}
              </a>
            ))}
            <a
              href="#register"
              onClick={close}
              className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-[15px] font-medium px-6 py-2.5 rounded-full flex items-center justify-center gap-2"
            >
              Register <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        )}
      </nav>
    </div>
  );
}
