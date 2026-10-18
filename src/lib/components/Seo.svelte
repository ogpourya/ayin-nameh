<script lang="ts">
  import { asset } from '$app/paths';
  import type { AssetPath } from '$app/types';
  import { page } from '$app/state';

  // Change when deploying to a custom domain.
  const SITE_ORIGIN = 'https://ogpourya.github.io';
  const SITE_NAME = 'آیین‌نامه رانندگی';
  const SHARE_IMAGE = SITE_ORIGIN + asset('assets/img/header.webp' as AssetPath);

  let {
    title,
    description,
    noindex = false,
    jsonLd = null
  }: {
    title: string;
    description: string;
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | null;
  } = $props();

  const canonical = $derived(SITE_ORIGIN + page.url.pathname);
  // Svelte does not evaluate expressions inside a template <script>, so build the tag as HTML.
  // The closing tag is escaped so it cannot terminate this component's own script block.
  const SCRIPT_CLOSE = '\x3c/script>';
  const jsonLdHtml = $derived(
    jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}${SCRIPT_CLOSE}`
      : ''
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  {#if noindex}
    <meta name="robots" content="noindex" />
  {:else}
    <link rel="canonical" href={canonical} />
    <meta property="og:url" content={canonical} />
  {/if}
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="fa_IR" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={SHARE_IMAGE} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={SHARE_IMAGE} />
  {#if jsonLdHtml}
    {@html jsonLdHtml}
  {/if}
</svelte:head>
