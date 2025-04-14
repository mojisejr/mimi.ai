import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        myTheme: {
          primary: "#629C6B",
          "primary-focus": "#578B60", // สีเข้มขึ้นเล็กน้อยสำหรับโฟกัส
          "primary-content": "#ffffff", // สีตัวอักษรบนปุ่ม Primary

          secondary: "#66836A",
          "secondary-focus": "#58795D", // สีเข้มขึ้นเล็กน้อยสำหรับโฟกัส
          "secondary-content": "#ffffff",

          accent: "#DE5B25",
          "accent-focus": "#C04F20", // สีเข้มขึ้นเล็กน้อยสำหรับโฟกัส
          "accent-content": "#ffffff",

          neutral: "#BFB8B1",
          "neutral-focus": "#A8A29E", // สีเข้มขึ้นเล็กน้อยสำหรับโฟกัส
          "neutral-content": "#1F2937",

          "base-100": "#ffffff", // พื้นหลังหลัก
          "base-200": "#F3F2F0", // พื้นหลังรอง
          "base-300": "#E0DFDC", // พื้นหลังเล็กน้อย
          "base-content": "#1F2937", // สีตัวอักษรบนพื้นฐาน

          info: "#2094f3",
          success: "#629C6B",
          warning: "#FFCC00",
          error: "#DE5B25",
        },
      },
    ],
  },
} satisfies Config;
