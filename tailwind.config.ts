import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: "#0B1730", 800: "#122145", 700: "#1A2C57" },
        brandblue: { 600: "#2A5CDB", 500: "#3D6EF0", 50: "#EEF3FE" },
        brandgreen: { 600: "#1C9A5B", 50: "#E8F8EF" },
        brandamber: { 600: "#B7791F", 500: "#E3A008", 50: "#FDF3DA" },
        brandred: { 600: "#C4342F", 50: "#FBEAE9" },
        brandgrey: { 600: "#5B6472", 100: "#EEF0F3" }
      },
      fontFamily: {
        ui: ["IBM Plex Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      borderRadius: {
        card: "10px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.04), 0 2px 8px rgba(16,24,40,.05)"
      }
    }
  },
  plugins: []
};
export default config;
