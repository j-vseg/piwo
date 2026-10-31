import type { TailwindConfig } from "react-email";

export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        button: {
          "primary-active": "#880D1E",
        },
        dark: {
          black: "#000000",
          "black-4": "#0000000A",
          "black-10": "#0000001A",
          "grey-dark": "#333333",
          "grey-light": "#EFF1F5",
          "grey-medium": "#6F6B7A",
        },
        light: {
          "off-white": "#FFFEFC",
          white: "#FFFFFF",
          "white-40": "#FFFFFF66",
        },
        primary: "#ffd9ad",
        secondary: "#acb58d",
        tertiary: "#9e2a2b",
        quinary: "#FCF8EC",
        transparent: "#FFFFFF00",
        category: {
          group: "#FFBA86",
          weekend: "#B5D6E8",
          camp: "#CDBCE6",
          action: "#bdecb6",
        },
        warning: {
          negative: "#f44336",
          warning: "#ff9800",
          positive: "#4caf50",
          "bg-neutral": "#E6F3FF",
          "bg-success": "#d3f7d1",
          "bg-error": "#fdd9d7",
        },
      },
      fontFamily: {
        "crimson-pro": ["Crimson Pro", "serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", { letterSpacing: "-0.5px", fontWeight: "600" }],
        h2: ["32px", { letterSpacing: "-0.5px", fontWeight: "600" }],
        h3: ["20px", { letterSpacing: "-0.5px", fontWeight: "600" }],
        h4: ["18px", { letterSpacing: "-0.5px", fontWeight: "600" }],
        h5: ["16px", { letterSpacing: "-0.5px", fontWeight: "600" }],
        "body-largest": ["40px", { fontWeight: "500" }],
        "body-large": ["18px", { fontWeight: "500" }],
        "body-medium": ["16px", { fontWeight: "400" }],
        "body-small": ["14px", { fontWeight: "400" }],
        "body-smaller": ["12px", { fontWeight: "400" }],
        menu: ["11px", { letterSpacing: "0.2px", fontWeight: "700" }],
        btn: ["16px", { fontWeight: "600" }],
        span: ["32px", { fontWeight: "400" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
        "9": "36px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
      },
    },
  },
} satisfies TailwindConfig;
