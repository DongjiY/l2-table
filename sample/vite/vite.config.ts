import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    fs: {
      allow: [
        path.resolve(__dirname), // my-react-app
      ],
    },
  },
});
