// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "index.js"),
      name: "Vue3QuillEditor",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue", "quill", "element-plus"],
      output: {
        globals: {
          vue: "Vue",
          quill: "Quill",
        },
      },
    },
  },
});
