import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "core-js/stable";
import "regenerator-runtime/runtime";

export default defineConfig({
  plugins: [react()],
});
