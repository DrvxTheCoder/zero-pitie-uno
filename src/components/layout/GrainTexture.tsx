"use client";

import { useEffect } from "react";

/**
 * Draws the rough speckle texture (white splatter + dark grit) once on a canvas
 * and exposes it as the `--grain` CSS variable, used by the `grain` utility.
 */
export function GrainTexture() {
  useEffect(() => {
    try {
      const size = 260;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const x = c.getContext("2d");
      if (!x) return;
      let seed = 7;
      const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

      for (let i = 0; i < 170; i++) {
        x.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.55})`;
        x.beginPath();
        x.arc(r() * size, r() * size, 0.5 + r() * 1.8, 0, 7);
        x.fill();
      }
      x.strokeStyle = "rgba(255,255,255,.55)";
      x.lineCap = "round";
      for (let i = 0; i < 26; i++) {
        const a = r() * 6.3, len = 3 + r() * 9, X = r() * size, Y = r() * size;
        x.lineWidth = 0.8 + r() * 1.4;
        x.beginPath();
        x.moveTo(X, Y);
        x.lineTo(X + Math.cos(a) * len, Y + Math.sin(a) * len);
        x.stroke();
      }
      for (let i = 0; i < 90; i++) {
        x.fillStyle = `rgba(0,0,0,${0.12 + r() * 0.2})`;
        x.fillRect(r() * size, r() * size, 1 + r() * 2, 1 + r() * 2);
      }
      document.documentElement.style.setProperty("--grain", `url(${c.toDataURL()})`);
    } catch {
      /* texture is decorative */
    }
  }, []);
  return null;
}
