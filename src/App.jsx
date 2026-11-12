import React, { lazy, Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

// Above-the-fold: loaded immediately
import Navbar from "./components/layout/Navbar.jsx";
import StatusBar from "./components/layout/StatusBar.jsx";
import HeroVideoSection from "./components/sections/HeroVideoSection.jsx";
import HeroSection from "./components/sections/HeroSection.jsx";

// Below-the-fold: split into separate chunks (smaller initial JS => better LCP/TBT)
const loaders = {
  OneTab: () => import("./components/sections/OneTabSection.jsx"),
  Pillars: () => import("./components/sections/PillarsSection.jsx"),
  Bee: () => import("./components/sections/BeeEcosystemSection.jsx"),
  Features: () => import("./components/sections/FeaturesSection.jsx"),
  Global: () => import("./components/sections/GlobalSection.jsx"),
  Benefits: () => import("./components/sections/BenefitsSection.jsx"),
  Boards: () => import("./components/sections/BoardsSection.jsx"),
  Register: () => import("./components/sections/RegisterSection.jsx"),
  Footer: () => import("./components/layout/Footer.jsx"),
  // Page-level chunks (only fetched when the route is visited)
  PrivacyPolicy: () => import("./components/pages/PrivacyPolicy.jsx"),
  TermsConditions: () => import("./components/pages/TermsConditions.jsx")
};

const OneTabSection = lazy(loaders.OneTab);
const PillarsSection = lazy(loaders.Pillars);
const BeeEcosystemSection = lazy(loaders.Bee);
const FeaturesSection = lazy(loaders.Features);
const GlobalSection = lazy(loaders.Global);
const BenefitsSection = lazy(loaders.Benefits);
const BoardsSection = lazy(loaders.Boards);
const RegisterSection = lazy(loaders.Register);
const Footer = lazy(loaders.Footer);
const PrivacyPolicy = lazy(loaders.PrivacyPolicy);
const TermsConditions = lazy(loaders.TermsConditions);

// Placeholder keeps the anchor target + height so there is no layout shift
// and "#bee / #features / #benefits / #register" links still work.
const Placeholder = ({ id, h = 600 }) => (
  <div id={id} style={{ minHeight: h }} aria-hidden="true" />
);

// ---------------------------------------------------------------------------
// Reload handling (module-level, runs once per page load, BEFORE ScrollToTop
// ever paints anything meaningful).
//
//  • Runs at import time — before React mounts, before StrictMode double-invokes.
//  • Sets history.scrollRestoration = "manual" so the browser STOPS restoring
//    the previous scroll position on refresh. Without this, the browser scrolls
//    you back down after our reset, which is why the earlier attempts appeared
//    to "not work".
//  • With HashRouter the URL looks like "/#/privacy-policy" (route) or
//    "/#/#features" (route + anchor) or "/#features" (pure anchor on home).
//    On a real reload we must NOT strip a route hash — only a pure anchor
//    hash that is not a known route. So the stripping logic is limited to
//    the case where the fragment is NOT a route prefix ("/...").
//  • Scroll to top across 3 timings so no browser paint wins the race.
//
// In-app SPA navigation (clicking Register / Features / BEE links) is NOT
// affected — by then this block has already run and scrollRestoration stays
// "manual" only for the reload; SPA scroll is fully controlled by ScrollToTop.
// ---------------------------------------------------------------------------
let __reloadHandled = false;
const handleInitialReload = () => {
  if (__reloadHandled || typeof window === "undefined") return;
  __reloadHandled = true;
  try {
    // 1) Stop the browser from restoring the previous scroll position.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2) Only strip a PURE ANCHOR hash on a real page load / reload.
    //    With HashRouter the whole route lives in the fragment:
    //      "#/privacy-policy"      -> route, DO NOT strip
    //      "#/terms-conditions"    -> route, DO NOT strip
    //      "#/#features"           -> route "/" + anchor, DO NOT strip the route part
    //      "#features"             -> pure anchor on home, safe to strip
    //    So: strip only if the fragment does NOT start with "/".
    const nav = performance.getEntriesByType?.("navigation")?.[0];
    const navType = nav?.type; // "navigate" | "reload" | "back_forward" | "prerender"
    const isFreshLoad = navType === "navigate" || navType === "reload";

    const rawHash = window.location.hash; // includes leading "#"
    if (isFreshLoad && rawHash && !rawHash.startsWith("#/")) {
      // Pure anchor (e.g. "/#features") — remove it so we land at the top.
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);
    }

    // 3) Land at the very top — re-assert over a few frames/timers.
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
    setTimeout(() => window.scrollTo(0, 0), 0);
    setTimeout(() => window.scrollTo(0, 0), 60);
  } catch {
    // performance API unavailable or replaceState blocked: page still works.
  }
};
handleInitialReload();

// Reset scroll to top whenever the route changes (except when navigating to
// an in-page anchor like #bee on the home page).
//
// With HashRouter, `useLocation().hash` is the INNER hash (the part after the
// route), e.g. for "/#/#features" the route is "/" and hash is "#features".
// For "/#/privacy-policy" the route is "/privacy-policy" and hash is "".
// This component therefore behaves identically to before.
//
// On a real reload: handleInitialReload() above has already stripped a pure
// anchor hash and disabled browser scroll restoration, so this component's
// first run just sees a clean route and scrolls to top. In-app anchor clicks
// keep working exactly as before.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    // Wait a frame + retry a few times while the lazy section mounts.
    let attempts = 0;
    let raf = 0;
    const tryScroll = () => {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts++ < 20) {
        raf = requestAnimationFrame(tryScroll);
      }
    };
    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
  return null;
}

// The existing home page, unchanged except it no longer owns <StatusBar> /
// <Navbar> / <Footer> — those now live in the shared layout below so every
// route (Privacy, Terms, etc.) gets them too.
function HomePage() {
  // Prefetch the remaining home-page chunks during idle time. They are now queued and
  // fetched ONE PER idle slice instead of all nine in one callback, so parsing/evaluating
  // them never piles up into a single long main-thread task right after load (TBT / INP).
  // Same chunks, same order of availability; the Suspense placeholders still cover fast scrolls.
  useEffect(() => {
    const queue = Object.entries(loaders)
      .filter(([name]) => name !== "Global" && name !== "PrivacyPolicy" && name !== "TermsConditions")
      .map(([, load]) => load);
    const hasIdle = typeof window.requestIdleCallback === "function";
    const schedule = (cb, delay) =>
      hasIdle ? window.requestIdleCallback(cb, { timeout: 4000 }) : setTimeout(cb, delay);
    const cancel = hasIdle ? window.cancelIdleCallback : clearTimeout;
    let id = 0;
    let stopped = false;
    const next = () => {
      if (stopped) return;
      const load = queue.shift();
      if (!load) return;
      load();
      id = schedule(next, 400);
    };
    id = schedule(next, 1500);
    return () => {
      stopped = true;
      cancel(id);
    };
  }, []);

  return (
    <main>
      <HeroVideoSection />
      <HeroSection />

      <Suspense fallback={<Placeholder h={800} />}>
        <OneTabSection />
      </Suspense>
      <Suspense fallback={<Placeholder h={900} />}>
        <PillarsSection />
      </Suspense>
      <Suspense fallback={<Placeholder id="bee" h={900} />}>
        <BeeEcosystemSection />
      </Suspense>
      <Suspense fallback={<Placeholder id="features" h={1200} />}>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={<Placeholder h={800} />}>
        <GlobalSection />
      </Suspense>
      <Suspense fallback={<Placeholder id="benefits" h={900} />}>
        <BenefitsSection />
      </Suspense>
      <Suspense fallback={<Placeholder h={500} />}>
        <BoardsSection />
      </Suspense>
      <Suspense fallback={<Placeholder id="register" h={1000} />}>
        <RegisterSection />
      </Suspense>
    </main>
  );
}

// Simple fallback for page-level route chunks.
const PageFallback = () => <Placeholder h={800} />;

export default function App() {
  return (
    // LazyMotion + `m` components: framer-motion's initial cost drops by ~25 KB
    // MotionConfig: respects the OS "reduce motion" setting automatically
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <ScrollToTop />
          <div className="font-sans text-gray-900 bg-white">
            <StatusBar />
            <Navbar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/privacy-policy"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <PrivacyPolicy />
                  </Suspense>
                }
              />
              <Route
                path="/terms-conditions"
                element={
                  <Suspense fallback={<PageFallback />}>
                    <TermsConditions />
                  </Suspense>
                }
              />
              {/* Optional 404 fallback — redirect unknown paths to home */}
              <Route path="*" element={<HomePage />} />
            </Routes>

            <Suspense fallback={<Placeholder h={400} />}>
              <Footer />
            </Suspense>
          </div>
        </HashRouter>
      </MotionConfig>
    </LazyMotion>
  );
}