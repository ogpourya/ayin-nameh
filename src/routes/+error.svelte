<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Header from '#lib/components/Header.svelte';
</script>

<svelte:head>
  <title>خطا | آیین‌نامه رانندگی</title>
</svelte:head>

<Header title="خطا" />

<div class="px-6 py-12 text-center">
  <div class="text-5xl">🧭</div>
  <p class="mt-4 text-lg font-black">
    {page.status === 404 ? 'این صفحه پیدا نشد' : 'خطای غیرمنتظره‌ای رخ داد'}
  </p>
  <p class="mt-2 text-sm text-slate-500">{page.error?.message ?? ''}</p>
  <a
    href={resolve('/')}
    class="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 active:scale-95"
  >
    بازگشت به صفحه اصلی
  </a>
</div>
