/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#ffd9ad",
        success: "#4caf50",
        error: "#f44336",
        danger: "#ff9800",
        info: "#E6F3FF",
        orangeRed: "#ff4500",
        background: {
          100: "#fff5eb",
          200: "#ffd9ad",
          success: "#d3f7d1",
        },
        greyYellow: "#CDC0B4",
        pastelOrange: "#FFBA86",
        pastelPurple: "#CDBCE6",
        pastelGreen: "#bdecb6",
        pastelBlue: "#B5D6E8",
      },
      fontFamily: { poppins: ["Poppins", "sans-serif"] },
      fontSize: {
        h1: "28px",
        h2: "24px",
        h3: "20px",
        h4: "18px",
        h5: "16px",
        body_md: "16px",
        body_sm: "14px",
        body_xs: "12px",
        button: "16px",
      },
    },
  },
  plugins: [],
};
