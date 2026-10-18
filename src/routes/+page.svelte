<script lang="ts">
  import { browser } from '$app/env';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import FreeBadge from '#lib/components/FreeBadge.svelte';
  import Header from '#lib/components/Header.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { CARTEX } from '#lib/data/cartex';
  import { META } from '#lib/data/meta';
  import { SIGN_TYPES } from '#lib/data/signs';
  import { progress } from '#lib/stores/examProgress.svelte';
  import type { SignCategory } from '#lib/types';
  import { assetUrl } from '#lib/utils/asset';
  import { formatPercent, toPersianDigits } from '#lib/utils/formatters';

  const total = CARTEX.length;

  const counts = $derived.by(() => {
    const passed = progress.passedCount;
    const failed = progress.failedCount;
    const inProgress = progress.inProgressCount;
    return { passed, failed, inProgress, notStarted: total - passed - failed - inProgress };
  });

  const readiness = $derived(Math.round((counts.passed / total) * 100));

  const signHref = (category: SignCategory) => {
    if (category.kind === 'concepts') return resolve('/concepts');
    if (category.kind === 'lines') return resolve('/lines');
    return resolve('/signs/[type]', { type: category.id });
  };

  // In-page anchors (#exams / #sheets / #signs) arrive either from the bottom nav or an in-page link.
  $effect(() => {
    const hash = page.url.hash;
    if (!browser || !hash) return;
    requestAnimationFrame(() =>
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    );
  });
</script>

<svelte:head>
  <title>آیین‌نامه رانندگی | آزمون‌های تستی و برگه‌های اصلی</title>
</svelte:head>

<Header title={`${META.title} رانندگی`} back={false} />

<div class="relative">
  <img src={assetUrl('assets/img/header.webp')} alt="" class="h-40 w-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
  <div class="absolute inset-x-0 bottom-0 p-4 text-white">
    <p class="text-lg font-black drop-shadow">{META.title} رانندگی</p>
    <p class="text-xs opacity-90">پایه اول، دوم و سوم — سوالات اصلی به همراه برگه‌های آزمون</p>
  </div>
</div>

<div class="space-y-8 p-4">
  <FreeBadge compact />

  <section class="fade-in rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
    <div class="flex items-center justify-between">
      <h2 class="font-black">آمادگی شما</h2>
      <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
        {formatPercent(readiness)}
      </span>
    </div>
    <p class="mt-2 text-sm text-slate-500">
      {toPersianDigits(counts.passed)} از {toPersianDigits(total)} آزمون قبول شدید
    </p>
    <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full bg-gradient-to-l from-green-500 to-emerald-400 transition-all duration-500"
        style={`width: ${readiness}%`}
      ></div>
    </div>
    <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
      <span class="rounded-full bg-green-100 px-2 py-1 text-green-700">قبول {toPersianDigits(counts.passed)}</span>
      <span class="rounded-full bg-red-100 px-2 py-1 text-red-700">مردود {toPersianDigits(counts.failed)}</span>
      <span class="rounded-full bg-indigo-100 px-2 py-1 text-indigo-700">
        در حال انجام {toPersianDigits(counts.inProgress)}
      </span>
      <span class="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
        شروع نشده {toPersianDigits(counts.notStarted)}
      </span>
    </div>
  </section>

  <section id="sheets" class="scroll-mt-16">
    <h2 class="font-black">{META.sectionsTitle ?? 'برگه‌های اصلی آزمون'}</h2>
    <p class="mb-3 mt-1 text-sm text-slate-500">{META.help1} برگه‌های اصلی را مرور کنید و بعد آزمون بدهید.</p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each CARTEX as exam, i (exam.title)}
        <a
          href={resolve('/pdf/[id]', { id: String(i + 1) })}
          class="card-click relative block overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-sm backdrop-blur hover:shadow-md"
        >
          {#if progress.visited[i + 1]}
            <span class="absolute left-2 top-2 z-10 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
              دیده شد
            </span>
          {/if}
          <img src={assetUrl(exam.cover)} alt={exam.title} loading="lazy" class="h-36 w-full bg-slate-50 object-cover object-top" />
          <div class="p-3 text-center">
            <div class="text-sm font-bold">{exam.title}</div>
            <div class="mt-1 text-xs text-slate-500">{toPersianDigits(exam.questions.length)} سوال + برگه</div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section id="exams" class="scroll-mt-16">
    <h2 class="font-black">{META.examsTitle ?? 'آزمون‌های تستی'}</h2>
    <p class="mb-3 mt-1 text-sm text-slate-500">
      حد نصاب قبولی: ۲۶ پاسخ درست و حداکثر ۴ پاسخ غلط.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each CARTEX as exam, i (exam.title)}
        {@const bookmarks = progress.bookmarkCountFor(i + 1)}
        <a
          href={resolve('/quiz/[id]', { id: String(i + 1) })}
          class="card-click block rounded-2xl border border-white/60 bg-white/80 p-3 shadow-sm backdrop-blur hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div class="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600">
              {toPersianDigits(i + 1)}
            </div>
            <StatusBadge status={progress.getStatus(i + 1)} />
          </div>
          <div class="mt-3 text-sm font-bold">آزمون اصلی {toPersianDigits(i + 1)}</div>
          <div class="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>{toPersianDigits(exam.questions.length)} سوال</span>
            {#if bookmarks > 0}
              <span class="rounded-full bg-amber-100 px-2 py-0.5 font-bold text-amber-700">
                ★ {toPersianDigits(bookmarks)}
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section id="signs" class="scroll-mt-16">
    <h2 class="font-black">{META.signsTitle ?? 'علائم و نشانه‌ها'}</h2>
    <p class="mb-3 mt-1 text-sm text-slate-500">{META.help2} تابلوها را ببینید و در حالت سنجش حافظه تمرین کنید.</p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each SIGN_TYPES as category (category.id)}
        <a
          href={signHref(category)}
          class="card-click block rounded-2xl border border-white/60 bg-white/80 p-3 text-center shadow-sm backdrop-blur hover:shadow-md"
        >
          <img src={assetUrl(category.icon)} alt="" loading="lazy" class="h-20 w-full object-contain" />
          <div class="mt-2 text-xs font-bold leading-6">{category.title}</div>
        </a>
      {/each}
    </div>
  </section>
</div>
