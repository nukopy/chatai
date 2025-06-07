/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		!process.env.VITEST && cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		!process.env.VITEST && reactRouter(),
		tsconfigPaths(),
	].filter(Boolean),
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		include: ["**/*.{test,spec}.{ts,tsx}"],
	},
});
