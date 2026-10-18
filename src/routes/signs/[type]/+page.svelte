<script lang="ts">
  import { Eye, EyeOff } from '@lucide/svelte';
  import Header from '#lib/components/Header.svelte';
  import { progress } from '#lib/stores/examProgress.svelte';
  import { assetUrl } from '#lib/utils/asset';
  import { toPersianDigits } from '#lib/utils/formatters';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.category.title} | آیین‌نامه رانندگی</title>
</svelte:head>

<Header title={data.category.title} subtitle={`${toPersianDigits(data.items.length)} مورد`}>
  <button
    type="button"
    onclick={() => progress.setHideTexts(!progress.hideTexts)}
    aria-pressed={progress.hideTexts}
    class="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:bg-slate-200"
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
    <p class="mb-3 rounded-xl bg-indigo-50 px-3 py-2 text-center text-[11px] font-bold text-indigo-700">
      حالت سنجش حافظه فعال است — نام تابلوها پنهان شد
    </p>
  {/if}

  <div class="fade-in grid grid-cols-2 gap-3 sm:grid-cols-3">
    {#each data.items as item (item.img)}
      <div class="rounded-2xl border border-white/60 bg-white/80 p-2 text-center shadow-sm backdrop-blur">
        <img src={assetUrl(item.img)} alt={progress.hideTexts ? '' : item.title} loading="lazy" class="h-28 w-full object-contain" />
        <div class="mt-1 text-[12px] leading-6 {progress.hideTexts ? 'invisible' : ''}">{item.title}</div>
      </div>
    {/each}
  </div>
</div>
