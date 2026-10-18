<script lang="ts">
  import Header from '#lib/components/Header.svelte';
  import { LINES } from '#lib/data/lines';
  import { assetUrl } from '#lib/utils/asset';
</script>

<svelte:head>
  <title>مفهوم خط‌کشی‌ها | آیین‌نامه رانندگی</title>
</svelte:head>

<Header title="مفهوم خط‌کشی‌ها" />

<div class="fade-in space-y-3 p-4">
  {#each LINES as line (line.img)}
    <div class="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <img src={assetUrl(line.img)} alt="" loading="lazy" class="mb-3 max-h-40 w-full object-contain" />
      <p class="text-sm leading-7 text-slate-700">{line.title}</p>
    </div>
  {/each}
</div>
