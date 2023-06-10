/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,svelte,js}',
    require('path').join(require.resolve(
      '@skeletonlabs/skeleton'),
      '../**/*.{html,js,svelte,ts}'
    )
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    ...require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')()
  ],
}

