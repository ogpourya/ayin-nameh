<script lang="ts">
  import { Eye, EyeOff } from '@lucide/svelte';
  import Header from '#lib/components/Header.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { progress } from '#lib/stores/examProgress.svelte';
  import { assetUrl } from '#lib/utils/asset';
  import { toPersianDigits } from '#lib/utils/formatters';

  let { data } = $props();
</script>

<Seo
  title={`${data.category.title} | تابلوهای رانندگی با تصویر و نام`}
  description={`${data.category.title} با تصویر و نام — ${toPersianDigits(data.items.length)} مورد برای تمرین. آموزش کاملاً رایگان آیین‌نامه رانندگی برای قبولی در آزمون اصلی.`}
/>

<Header title={data.category.title} subtitle={`${toPersianDigits(data.items.length)} مورد`}>
  <button
    type="button"
    onclick={() => progress.setHideTexts(!progress.hideTexts)}
    aria-pressed={progress.hideTexts}
    class="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition hover:bg-slate-200 dark:hover:bg-slate-700"
  >
    {#if progress.hideTexts}
      <Eye size={14} />
      نمایش متن
    {:else}
      <EyeOff size={14} />
      مخفی کردن متن
    {/if}
  </button>
</Header>

<div class="p-3">
  {#if progress.hideTexts}
    <p class="mb-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 px-3 py-2 text-center text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
      حالت سنجش حافظه فعال است — نام تابلوها پنهان شد
    </p>
  {/if}

  <div class="fade-in grid grid-cols-2 gap-3 sm:grid-cols-3">
    {#each data.items as item (item.img)}
      <div class="rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 p-2 text-center shadow-sm backdrop-blur">
        <img src={assetUrl(item.img)} alt={progress.hideTexts ? '' : item.title} loading="lazy" class="h-28 w-full rounded-xl bg-white p-1 object-contain" />
        <div class="mt-1 text-[12px] leading-6 {progress.hideTexts ? 'invisible' : ''}">{item.title}</div>
      </div>
    {/each}
  </div>
</div>
