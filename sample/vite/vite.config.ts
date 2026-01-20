import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ["l2-table"],
  },

  server: {
    fs: {
      allow: [
        path.resolve(__dirname), // my-react-app
        path.resolve(__dirname, "../../"), // l2-table repo root
      ],
    },
  },

  resolve: {
    preserveSymlinks: true,
  },
});
