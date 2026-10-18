<script lang="ts">
  import { browser } from '$app/env';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import Header from '#lib/components/Header.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import StatusBadge from '#lib/components/StatusBadge.svelte';
  import { CARTEX } from '#lib/data/cartex';
  import { CONCEPT_COLORS, CONCEPT_SHAPES } from '#lib/data/concepts';
  import { LINES } from '#lib/data/lines';
  import { META } from '#lib/data/meta';
  import { SIGN_GRIDS } from '#lib/data/signgrids';
  import { SIGN_TYPES } from '#lib/data/signs';
  import { progress } from '#lib/stores/examProgress.svelte';
  import type { SignCategory } from '#lib/types';
  import { assetUrl } from '#lib/utils/asset';
  import { formatPercent, toPersianDigits } from '#lib/utils/formatters';

  const total = CARTEX.length;
  const questionTotal = CARTEX.reduce((sum, exam) => sum + exam.questions.length, 0);
  const signTotal = Object.values(SIGN_GRIDS).reduce((sum, items) => sum + items.length, 0);

  const stats = [
    { value: questionTotal, label: 'سوال اصلی' },
    { value: total, label: 'آزمون شبیه‌ساز' },
    { value: signTotal, label: 'تابلو با تصویر' },
    { value: LINES.length + CONCEPT_COLORS.length + CONCEPT_SHAPES.length, label: 'خط‌کشی و مفهوم' }
  ];

  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'آیین‌نامه رانندگی',
        url: 'https://ogpourya.github.io/ayin-nameh/',
        inLanguage: 'fa-IR',
        description: 'سوالات اصلی آیین‌نامه رانندگی به‌همراه آزمون‌های تستی شبیه‌ساز، برگه‌های اصلی، تابلوها و خط‌کشی‌ها.'
      },
      {
        '@type': 'Course',
        name: 'آمادگی آزمون آیین‌نامه رانندگی',
        description: 'سوالات اصلی آیین‌نامه رانندگی همراه با آزمون‌های شبیه‌ساز برای قبولی آسان در آزمون اصلی.',
        inLanguage: 'fa-IR',
        isAccessibleForFree: true,
        provider: { '@type': 'Organization', name: 'آیین‌نامه رانندگی', url: 'https://ogpourya.github.io/ayin-nameh/' },
        offers: { '@type': 'Offer', price: 0, priceCurrency: 'IRR', availability: 'https://schema.org/InStock' },
        hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online' }
      }
    ]
  };

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
  let lastHash = '';
  $effect(() => {
    const hash = page.url.hash;
    if (!browser || hash === lastHash) return;
    const hadHash = lastHash !== '';
    lastHash = hash;
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else if (hadHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
</script>

<Seo
  title="سوالات اصلی آیین‌نامه رانندگی + آزمون تستی رایگان"
  description={`${toPersianDigits(questionTotal)} سوال اصلی آیین‌نامه رانندگی در ${toPersianDigits(total)} آزمون شبیه‌ساز، همراه برگه‌های اصلی، تابلوها و خط‌کشی‌ها. کاملاً رایگان و بدون تبلیغات — بدون خواندن کل کتاب، در آزمون اصلی قبول شوید.`}
  jsonLd={homeJsonLd}
/>

<Header title={`${META.title} رانندگی`} back={false} />

<div class="relative overflow-hidden rounded-b-3xl">
  <img src={assetUrl('assets/img/header.webp')} alt="" class="h-40 w-full object-cover" />
  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent"></div>
  <div class="absolute inset-x-0 bottom-0 p-4 text-white">
    <p class="text-lg font-black drop-shadow">{META.title} رانندگی</p>
    <p class="text-xs opacity-90">سوالات اصلی + آزمون شبیه‌ساز — کاملاً رایگان، بدون خواندن کل کتاب قبول شوید</p>
  </div>
</div>

<div class="space-y-8 p-4">
  <section class="fade-in grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each stats as stat (stat.label)}
 <div class="rounded-3xl glass p-3 text-center ">
        <div class="text-2xl font-black text-indigo-600 dark:text-indigo-400">{toPersianDigits(stat.value)}</div>
        <div class="mt-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">{stat.label}</div>
      </div>
    {/each}
  </section>

 <section class="fade-in rounded-3xl glass p-4 ">
    <div class="flex items-center justify-between">
      <h2 class="font-black">آمادگی شما</h2>
      <span class="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
        {formatPercent(readiness)}
      </span>
    </div>
    <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
      {toPersianDigits(counts.passed)} از {toPersianDigits(total)} آزمون قبول شدید
    </p>
    <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div
        class="h-full rounded-full bg-gradient-to-l from-green-500 to-emerald-400 transition-all duration-500"
        style={`width: ${readiness}%`}
      ></div>
    </div>
    <div class="mt-3 flex flex-wrap gap-2 text-[11px] font-bold">
      <span class="rounded-full bg-green-500/15 px-2 py-1 text-green-700 dark:text-green-300">قبول {toPersianDigits(counts.passed)}</span>
      <span class="rounded-full bg-red-500/15 px-2 py-1 text-red-700 dark:text-red-300">مردود {toPersianDigits(counts.failed)}</span>
      <span class="rounded-full bg-indigo-500/15 px-2 py-1 text-indigo-700 dark:text-indigo-300">
        در حال انجام {toPersianDigits(counts.inProgress)}
      </span>
      <span class="rounded-full bg-slate-900/5 px-2 py-1 text-slate-600 dark:bg-white/10 dark:text-slate-300">
        شروع نشده {toPersianDigits(counts.notStarted)}
      </span>
    </div>
  </section>

  <section id="sheets" class="scroll-mt-16">
    <h2 class="font-black">{META.sectionsTitle ?? 'برگه‌های اصلی آزمون'}</h2>
    <p class="mb-3 mt-1 text-sm text-slate-500 dark:text-slate-400">{META.help1} برگه‌های اصلی را مرور کنید و بعد آزمون بدهید.</p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each CARTEX as exam, i (exam.title)}
        <a
          href={resolve('/pdf/[id]', { id: String(i + 1) })}
 class="card-click relative block overflow-hidden rounded-3xl glass "
        >
          {#if progress.visited[i + 1]}
            <span class="absolute left-2 top-2 z-10 rounded-full bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">
              دیده شد
            </span>
          {/if}
          <img src={assetUrl(exam.cover)} alt={exam.title} loading="lazy" class="h-36 w-full bg-white object-cover object-top" />
          <div class="p-3 text-center">
            <div class="text-sm font-bold">{exam.title}</div>
            <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{toPersianDigits(exam.questions.length)} سوال + برگه</div>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section id="exams" class="scroll-mt-16">
    <h2 class="font-black">{META.examsTitle ?? 'آزمون‌های تستی'}</h2>
    <p class="mb-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
      حد نصاب قبولی: ۲۶ پاسخ درست و حداکثر ۴ پاسخ غلط.
    </p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each CARTEX as exam, i (exam.title)}
        {@const bookmarks = progress.bookmarkCountFor(i + 1)}
        <a
          href={resolve('/quiz/[id]', { id: String(i + 1) })}
 class="card-click block rounded-3xl glass p-3 "
        >
          <div class="flex items-center justify-between">
            <div class="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-500/15 text-lg font-black text-indigo-600 dark:text-indigo-400">
              {toPersianDigits(i + 1)}
            </div>
            <StatusBadge status={progress.getStatus(i + 1)} />
          </div>
          <div class="mt-3 text-sm font-bold">آزمون اصلی {toPersianDigits(i + 1)}</div>
          <div class="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{toPersianDigits(exam.questions.length)} سوال</span>
            {#if bookmarks > 0}
              <span class="rounded-full bg-amber-100 dark:bg-amber-950 px-2 py-0.5 font-bold text-amber-700 dark:text-amber-300">
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
    <p class="mb-3 mt-1 text-sm text-slate-500 dark:text-slate-400">{META.help2} تابلوها را ببینید و در حالت سنجش حافظه تمرین کنید.</p>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {#each SIGN_TYPES as category (category.id)}
        <a
          href={signHref(category)}
 class="card-click block rounded-3xl glass p-3 text-center "
        >
          <img src={assetUrl(category.icon)} alt="" loading="lazy" class="h-20 w-full rounded-xl bg-white p-1 object-contain" />
          <div class="mt-2 text-xs font-bold leading-6">{category.title}</div>
        </a>
      {/each}
    </div>
  </section>
</div>
