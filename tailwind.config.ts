import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // Includes all app routes & components
    "./public/index.html",            // If using static HTML
  ],
  theme: {
    extend: {
      // Add any custom theme variables here
      colors: {
        iris: {
          DEFAULT: "#1a1a2e", // Customize as needed
        },
        matrix: {
          DEFAULT: "#0f0",
        },
        pepe: {
          DEFAULT: "#ff53da",
        },
      },
      backgroundImage: {
        // Optional: Add named background images for themes
        'iris-bg': "url('/images/irisuploaderbg.png')",
        'matrix-rain': "url('/images/matrixrainbg.png')",
      },
    },
  },
  darkMode: "class", // Enables use of `dark:` variants when `class="dark"` is set
  safelist: [
    "dark",
    "iris",
    "matrix",
    "pepe",
    "bg-iris",
    "bg-matrix",
    "bg-pepe",
    "text-iris",
    "text-matrix",
    "text-pepe",
  ],
  plugins: [],
};

export default config;
