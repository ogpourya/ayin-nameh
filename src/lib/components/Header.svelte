<script lang="ts">
  import type { Snippet } from 'svelte';
  import { resolve } from '$app/paths';
  import { ArrowRight } from '@lucide/svelte';

  let {
    title,
    subtitle = '',
    back = true,
    children
  }: { title: string; subtitle?: string; back?: boolean; children?: Snippet } = $props();
</script>

<header class="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
  <div class="mx-auto flex h-14 max-w-3xl items-center gap-2 px-3">
    {#if back}
      <a
        href={resolve('/')}
        aria-label="بازگشت به صفحه اصلی"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200 active:scale-95"
      >
        <ArrowRight size={20} />
      </a>
    {/if}
    <h1 class="min-w-0 flex-1 truncate text-base font-bold">{title}</h1>
    {#if subtitle}
      <span class="whitespace-nowrap text-xs font-bold text-indigo-600">{subtitle}</span>
    {/if}
    {@render children?.()}
  </div>
</header>
