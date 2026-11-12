import React, { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// Relative import (NOT "/src/assets/poster.png") so Vite hashes + caches it in production.
import posterImg from "../../assets/poster.png";

// Module-level flag: the poster opens once per page load. Navigating to
// Privacy / Terms and back to Home does NOT re-open it.
let posterAlreadyShown = false;

export default function PosterModal() {
  const [open, setOpen] = useState(() => !posterAlreadyShown);
  // The overlay stays invisible until the poster has loaded, so users never
  // see an empty dark screen on slow connections.
  const [ready, setReady] = useState(false);
  const closeBtnRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Mark as shown, lock page scroll, close on Esc, focus the close button.
  useEffect(() => {
    if (!open) return undefined;
    posterAlreadyShown = true;

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

  useEffect(() => {
    if (open && ready) closeBtnRef.current?.focus({ preventScroll: true });
  }, [open, ready]);

  if (!open) return null;

  // Click on the dark backdrop (anywhere outside the poster) closes the modal.
  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Event poster"
      onClick={onBackdropClick}
      className={`fixed inset-0 z-[100] grid grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] place-items-center p-4 sm:p-8 bg-black/60 transition-opacity duration-300 ${
        ready ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* X icon */}
      <button
        ref={closeBtnRef}
        type="button"
        onClick={close}
        aria-label="Close poster"
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 w-10 h-10 rounded-full bg-white text-gray-900 shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#CB02FF]"
      >
        <X size={20} strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Poster: scales down to always fit inside the screen, keeps aspect ratio */}
      <img
        src={posterImg}
        alt="Poster"
        decoding="async"
        onLoad={() => setReady(true)}
        onError={close}
        draggable={false}
        className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl select-none"
      />
    </div>
  );
}