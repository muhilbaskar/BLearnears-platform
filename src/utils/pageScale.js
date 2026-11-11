/**
 * Laptop / desktop / 4K page scaling.
 *
 * Between LAPTOP_MIN (1024px) and the end of the table below, the whole page is laid
 * out with the 4K design classes and then scaled with CSS `zoom`.
 * Below 1024px (tablet / mobile) NOTHING is changed (scale is always 1).
 *
 * HOW TO TUNE: edit SCALE_STEPS only. Each row is [screen width px, scale].
 * Scales between two rows are interpolated smoothly, so every width in between
 * (1100, 1280, 1366, 1536, 1920 ...) is also fully responsive.
 *
 *   scale 0.80 at 1024px  -> page is laid out 1280px wide  (was 0.50 -> 2048px wide)
 *   scale 0.90 at 1440px  -> page is laid out 1600px wide  (was 0.56 -> 2560px wide)
 *   scale 1.25 at 2560px  -> page is laid out 2048px wide  (was 1.00 -> 2560px wide)
 *
 * Bigger number = bigger text / cards on that screen.
 */
export const DESIGN_WIDTH = 2560; // kept for backwards compatibility
export const LAPTOP_MIN = 1024;
export const MIN_SCALE = 0.8; // kept for backwards compatibility (= scale at LAPTOP_MIN)

export const SCALE_STEPS = [
  [1024, 0.8], // Laptop
  [1280, 0.85],
  [1440, 0.9], // Laptop L
  [1920, 1.05], // Full HD
  [2560, 1.25], // 4K (and anything wider keeps this scale)
];

export const getPageScale = () => {
  if (typeof window === "undefined") return 1;
  const w = window.innerWidth;
  if (w < LAPTOP_MIN) return 1;

  const first = SCALE_STEPS[0];
  const last = SCALE_STEPS[SCALE_STEPS.length - 1];
  if (w <= first[0]) return first[1];
  if (w >= last[0]) return last[1];

  for (let i = 1; i < SCALE_STEPS.length; i += 1) {
    const [x1, y1] = SCALE_STEPS[i];
    if (w <= x1) {
      const [x0, y0] = SCALE_STEPS[i - 1];
      const t = (w - x0) / (x1 - x0);
      return Math.round((y0 + (y1 - y0) * t) * 1000) / 1000;
    }
  }
  return last[1];
};

const apply = () => {
  const s = getPageScale();
  document.documentElement.style.zoom = s === 1 ? "" : String(s);
};

if (typeof window !== "undefined") {
  apply(); // runs before React renders => no layout flash
  let raf = 0;
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    },
    { passive: true },
  );
}