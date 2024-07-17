import { defineConfig } from "vite";
import svgLoader from 'vite-svg-loader'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    svgLoader(),
    Icons(),
  ],
})
