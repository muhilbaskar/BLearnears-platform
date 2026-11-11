import { useEffect, useState } from "react";

/**
 * Tracks whether an element is (nearly) on screen.
 * Used to pause videos, WebGL, timers and CSS animations that are off-screen,
 * which keeps scrolling smooth and saves battery on phones / laptops.
 */
export default function useInViewport(ref, { rootMargin = "200px", once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
