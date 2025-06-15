import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    site: 'https://mattcotter.github.io',
    base: '/left-feed',
    integrations: [vue()],
    vite: {    plugins: [tailwindcss()],  },
});
