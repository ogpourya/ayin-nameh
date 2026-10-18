<script lang="ts">
  import { resolve } from '$app/paths';
  import { ChevronLeft, ChevronRight, X } from '@lucide/svelte';
  import Header from '#lib/components/Header.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { progress } from '#lib/stores/examProgress.svelte';
  import { assetUrl } from '#lib/utils/asset';
  import { toPersianDigits } from '#lib/utils/formatters';

  let { data } = $props();

  const pages = $derived(
    Array.from({ length: data.pageCount }, (_, i) => assetUrl(`assets/pages/exam${data.index}_-${i + 1}.jpg`))
  );

  let lightbox = $state<number | null>(null);

  $effect(() => {
    progress.markVisited(data.index);
  });

  function step(delta: number) {
    if (lightbox === null) return;
    lightbox = Math.min(Math.max(lightbox + delta, 0), pages.length - 1);
  }

  function onKeydown(event: KeyboardEvent) {
    if (lightbox === null) return;
    if (event.key === 'Escape') lightbox = null;
    else if (event.key === 'ArrowLeft') step(1);
    else if (event.key === 'ArrowRight') step(-1);
  }
</script>

<Seo
  title={`${data.exam.title} | سوالات اصلی آیین‌نامه رانندگی با تصویر`}
  description={`مشاهده تصویری ${data.exam.title} به‌همراه ${toPersianDigits(data.exam.questions.length)} سوال اصلی آیین‌نامه رانندگی؛ آمادگی کاملاً رایگان برای آزمون اصلی.`}
/>

<svelte:window onkeydown={onKeydown} />

<Header title={data.exam.title} />

<div class="p-3">
  <div class="mb-3 flex items-center justify-between px-1 text-sm text-slate-500 dark:text-slate-400">
    <span>{toPersianDigits(pages.length)} صفحه</span>
    <a
      href={resolve('/quiz/[id]', { id: String(data.index) })}
      class="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 active:scale-95"
    >
      شروع آزمون {toPersianDigits(data.index)}
    </a>
  </div>

  <div class="fade-in space-y-3">
    {#each pages as page, i (page)}
      <button
        type="button"
        onclick={() => (lightbox = i)}
        aria-label="بزرگ‌نمایی صفحه {toPersianDigits(i + 1)}"
        class="card-click block w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm"
      >
        <img src={page} alt="صفحه {toPersianDigits(i + 1)} برگه {data.exam.title}" loading="lazy" class="w-full" />
      </button>
    {/each}
  </div>
</div>

{#if lightbox !== null}
  <div class="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="نمایش بزرگ برگه">
    <button
      type="button"
      class="absolute inset-0 h-full w-full cursor-zoom-out bg-slate-950/90 backdrop-blur-sm"
      aria-label="بستن نمایش"
      onclick={() => (lightbox = null)}
    ></button>

    <div class="pointer-events-none absolute inset-0 flex flex-col">
      <div class="pointer-events-auto flex items-center justify-between p-3 text-white">
        <span class="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
          {toPersianDigits(lightbox + 1)} / {toPersianDigits(pages.length)}
        </span>
        <button
          type="button"
          onclick={() => (lightbox = null)}
          aria-label="بستن"
          class="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
        >
          <X size={20} />
        </button>
      </div>

      <div class="relative flex flex-1 items-center justify-center px-4 pb-6">
        <img
          src={pages[lightbox]}
          alt="صفحه {toPersianDigits(lightbox + 1)}"
          class="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
        />
        {#if lightbox > 0}
          <button
            type="button"
            onclick={() => step(-1)}
            aria-label="صفحه قبلی"
            class="pointer-events-auto absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <ChevronRight size={24} />
          </button>
        {/if}
        {#if lightbox < pages.length - 1}
          <button
            type="button"
            onclick={() => step(1)}
            aria-label="صفحه بعدی"
            class="pointer-events-auto absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
          >
            <ChevronLeft size={24} />
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}
