import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",

        //** Packages */
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#1b5e20",
                    50: "#e8f5e9",
                    100: "#c8e6c9",
                    200: "#a5d6a7",
                    300: "#81c784",
                    400: "#66bb6a",
                    500: "#4caf50",
                    600: "#43a047",
                    700: "#388e3c",
                    800: "#2e7d32",
                    900: "#1b5e20",
                    950: "#003300",
                },
                error: {
                    DEFAULT: "#ef4444",
                    50: "#fad7d7",
                },
                link: {
                    DEFAULT: "#3b82f6",
                },
                green: {
                    DEFAULT: "#82BE28",
                },

                outlined: {
                    primary: {
                        DEFAULT: "rgba(44, 101, 47, 0.5)",
                    },
                    error: {
                        DEFAULT: "rgba(211, 47, 47, 0.5)",
                    },
                },
            },

            zIndex: {
                "100": "100",
            },

            // Animation
            animation: {
                zoomIn: "zoomIn .2s ease-in-out",
                fadeIn: "fadeIn .2s ease-in-out",
                fadeInLeft: "fadeInLeft .2s ease-in-out",
            },

            keyframes: () => ({
                zoomIn: {
                    "0%": {
                        opacity: "0",
                        transform:
                            "translateY(100px) scale(0.6) translateZ(100px)",
                    },
                    "100%": {
                        opacity: "1",
                        transform: "translateY(0px) scale(1) translateZ(0px)",
                    },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                fadeInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-20px)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
            }),
        },
    },
    plugins: [
        plugin(function ({ addBase, theme, addVariant }) {
            addBase({
                h1: { fontSize: theme("fontSize.2xl") },
                h2: { fontSize: theme("fontSize.xl") },
                h3: { fontSize: theme("fontSize.lg") },
            });
            // Alias children element
            addVariant("img", "& > img");
            addVariant("input", "& > input");
        }),
    ],
};

export default config;
