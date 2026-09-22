import {defineConfig} from 'vite';
import {resolve} from "node:path"
import dts from 'unplugin-dts/vite'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(import.meta.dirname, 'src/index.ts'),
			name: 'Strabo',
			formats: ['iife', "es", "cjs"],
			fileName: (format) => {
				if (format === "es") return "index.mjs"
				if (format === "cjs") return "index.cjs"
				if (format === "iife") return "browser/strabo.global.js"
				return `index.${format}.js`
			},
		}
	},
	plugins: [dts({
		outDirs: "dist",
		entryRoot: "src",
		insertTypesEntry: true
	})]
})