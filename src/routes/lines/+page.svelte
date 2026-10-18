<script lang="ts">
  import Header from '#lib/components/Header.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { LINES } from '#lib/data/lines';
  import { assetUrl } from '#lib/utils/asset';
</script>

<Seo
  title="مفهوم خط‌کشی‌های راه | راهنمای تصویری آیین‌نامه رانندگی"
  description="معنی خطوط ممتد، مقطع، هاشور، زیگزاگ و خطوط عرضی با تصویر و توضیح؛ بخشی از آموزش کاملاً رایگان آیین‌نامه رانندگی برای آمادگی آزمون اصلی."
/>

<Header title="مفهوم خط‌کشی‌ها" />

<div class="fade-in space-y-3 p-4">
  {#each LINES as line (line.img)}
    <div class="rounded-2xl border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 p-4 shadow-sm backdrop-blur">
      <img src={assetUrl(line.img)} alt="" loading="lazy" class="mb-3 max-h-40 w-full rounded-xl bg-white p-2 object-contain" />
      <p class="text-sm leading-7 text-slate-700 dark:text-slate-200">{line.title}</p>
    </div>
  {/each}
</div>
