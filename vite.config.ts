import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// GitHub Pages project sites live under /<repo>/. Use BASE_PATH='' for a custom domain or user site.
const base = process.env.BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/ayin-nameh' : '');

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html',
        precompress: false,
        strict: false
      }),
      paths: {
        base,
        // Always emit root-relative URLs (base-prefixed), never page-relative ones.
        relative: false
      }
    })
  ]
});
