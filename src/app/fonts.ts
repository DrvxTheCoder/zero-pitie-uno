import localFont from "next/font/local";

// Self-hosted copies of the Google Fonts used by the design (SIL Open Font License).

export const bowlby = localFont({
  src: "../fonts/bowlby-one-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-bowlby",
  display: "swap",
});

export const rubikDirt = localFont({
  src: "../fonts/rubik-dirt-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-rubik-dirt",
  display: "swap",
});

export const rubik = localFont({
  src: [
    { path: "../fonts/rubik-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/rubik-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/rubik-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-rubik",
  display: "swap",
});
