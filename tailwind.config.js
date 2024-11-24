module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',      // 메인 파란색
        secondary: '#5DA0E6',    // 밝은 파란색
        accent: '#2171CD',       // 진한 파란색
      },
    },
  },
  plugins: [],
}