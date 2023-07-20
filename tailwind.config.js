const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx,html}"],
  theme: {
    extend: {},
  },
  plugins: [
    /**
     * Tailwind CSS plugin to add variant for "htmx-request"
     */
    plugin(function ({ addVariant, e }) {
      addVariant("htmx-request", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(
            `htmx-request${separator}${className}`,
            className,
          )}.htmx-request`;
        });
      });
    }),
  ],
};
