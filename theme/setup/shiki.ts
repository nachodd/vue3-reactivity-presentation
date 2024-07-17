/* ./setup/shiki.ts */
// import fs from 'node:fs'

import { defineShikiSetup } from '@slidev/types'

// const myTheme = JSON.parse(fs.readFileSync('theme/setup/theme/penguin-theme.json', 'utf8'))

export default defineShikiSetup(() => ({
  // theme: myTheme,
  themes: {
    dark: 'synthwave-84',
    light: 'vitesse-light',
  },
}))
