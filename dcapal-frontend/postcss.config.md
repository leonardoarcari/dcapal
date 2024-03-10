module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};
