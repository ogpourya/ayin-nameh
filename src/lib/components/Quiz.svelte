<script lang="ts">
  import { resolve } from '$app/paths';
  import { ArrowLeft, Bookmark, Check, Clock, ListChecks, RotateCcw, X } from '@lucide/svelte';
  import Header from '#lib/components/Header.svelte';
  import { STATUS, progress } from '#lib/stores/examProgress.svelte';
  import type { CartexExam, CartexQuestion } from '#lib/types';
  import { assetUrl } from '#lib/utils/asset';
  import { PASS_RULES, isPassed, minCorrectFor } from '#lib/utils/exam';
  import { formatDuration, formatPercent, toPersianDigits } from '#lib/utils/formatters';

  let { exam, index, total }: { exam: CartexExam; index: number; total: number } = $props();

  const questions = $derived(exam.questions);
  const passRule = $derived(minCorrectFor(questions.length));
  const persianKeyAlias: Record<string, string> = { '۱': '1', '۲': '2', '۳': '3', '۴': '4' };

  let mode = $state<'quiz' | 'result' | 'review'>('quiz');
  let current = $state(0);
  let picked = $state<number | null>(null);
  let answers = $state<Record<number, number>>({});
  let correctCount = $state(0);
  let wrongCount = $state(0);
  let elapsed = $state(0);
  let startedAt = Date.now();
  let reviewAt = $state(0);

  const question = $derived(questions[current]);
  const wrongList = $derived(
    Object.keys(answers)
      .map(Number)
      .filter((qi) => answers[qi] !== questions[qi].correctAnswer)
      .sort((a, b) => a - b)
  );
  const passed = $derived(isPassed(correctCount, wrongCount, questions.length));
  const percent = $derived(Math.round((correctCount / questions.length) * 100));
  const isBookmarked = $derived(progress.isBookmarked(index, question.id));

  $effect(() => {
    progress.startExam(index);
  });

  $effect(() => {
    if (mode !== 'quiz') return;
    const timer = setInterval(() => {
      elapsed = Math.floor((Date.now() - startedAt) / 1000);
    }, 1000);
    return () => clearInterval(timer);
  });

  function choose(choice: number) {
    if (picked !== null) return;
    picked = choice;
    answers[current] = choice;
    if (choice === question.correctAnswer) correctCount += 1;
    else wrongCount += 1;
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function next() {
    if (current + 1 >= questions.length) {
      progress.setStatus(index, passed ? STATUS.passed : STATUS.failed);
      mode = 'result';
    } else {
      current += 1;
      picked = null;
    }
    scrollTop();
  }

  function retry() {
    mode = 'quiz';
    current = 0;
    picked = null;
    answers = {};
    correctCount = 0;
    wrongCount = 0;
    elapsed = 0;
    startedAt = Date.now();
    scrollTop();
  }

  function startReview() {
    reviewAt = 0;
    mode = 'review';
    scrollTop();
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = persianKeyAlias[event.key] ?? event.key;
    if (mode === 'quiz') {
      if (picked === null) {
        const choice = Number(key);
        if (Number.isInteger(choice) && choice >= 1 && choice <= question.options.length) choose(choice);
      } else if (key === 'Enter') {
        next();
      }
    } else if (mode === 'result' && key === 'Enter') {
      retry();
    }
  }

  function optionClass(choice: number, correctAnswer: number, pickedChoice: number | null) {
    if (choice === correctAnswer) return 'border-green-500 bg-green-50';
    if (choice === pickedChoice) return 'border-red-500 bg-red-50';
    return 'border-slate-200 bg-white opacity-50';
  }

  function optionBadgeClass(choice: number, correctAnswer: number, pickedChoice: number | null) {
    if (choice === correctAnswer) return 'bg-green-600 text-white';
    if (choice === pickedChoice) return 'bg-red-600 text-white';
    return 'bg-slate-200 text-slate-600';
  }
</script>

{#snippet optionList(q: CartexQuestion, pickedChoice: number | null, revealed: boolean)}
  <div class="mt-4 space-y-2">
    {#each q.options as option, idx (idx)}
      {@const choice = idx + 1}
      <button
        type="button"
        onclick={() => choose(choice)}
        disabled={revealed}
        class="flex min-h-12 w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-right transition
          {revealed
          ? optionClass(choice, q.correctAnswer, pickedChoice)
          : 'border-slate-200 bg-white hover:border-indigo-300 active:scale-[0.99]'}"
      >
        <span
          class="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold
            {revealed ? optionBadgeClass(choice, q.correctAnswer, pickedChoice) : 'bg-slate-100 text-slate-600'}"
        >
          {toPersianDigits(choice)}
        </span>
        <span class="flex-1 leading-7">{option}</span>
        {#if revealed && choice === q.correctAnswer}
          <Check size={18} class="shrink-0 text-green-600" />
        {:else if revealed && choice === pickedChoice}
          <X size={18} class="shrink-0 text-red-600" />
        {/if}
      </button>
    {/each}
  </div>
{/snippet}

{#snippet feedbackCard(q: CartexQuestion, pickedChoice: number | null)}
  <div class="fade-in mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-7 text-amber-900">
    <p class="font-bold {pickedChoice === q.correctAnswer ? 'text-green-700' : 'text-red-700'}">
      {pickedChoice === q.correctAnswer
        ? 'پاسخ درست ✓'
        : `پاسخ صحیح گزینه ${toPersianDigits(q.correctAnswer)} ✗`}
    </p>
  </div>
{/snippet}

<svelte:window onkeydown={onKeydown} />

<Header
  title={`آزمون اصلی ${toPersianDigits(index)}`}
  subtitle={mode === 'quiz' ? `${toPersianDigits(current + 1)} / ${toPersianDigits(questions.length)}` : ''}
>
  <span class="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
    <Clock size={14} />
    {formatDuration(elapsed)}
  </span>
</Header>

<div class="p-4">
  {#if mode === 'quiz'}
    <div class="mb-4 h-2 overflow-hidden rounded-full bg-slate-200" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={questions.length}>
      <div
        class="h-full rounded-full bg-indigo-600 transition-all duration-300"
        style={`width: ${((current + 1) / questions.length) * 100}%`}
      ></div>
    </div>

    <div class="fade-in rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div class="mb-2 flex items-start justify-between gap-2">
        <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
          سوال {toPersianDigits(current + 1)}
        </span>
        <button
          type="button"
          onclick={() => progress.toggleBookmark(index, question.id)}
          aria-label="نشان‌کردن سوال برای مرور"
          aria-pressed={isBookmarked}
          class="grid h-9 w-9 place-items-center rounded-full transition hover:bg-slate-100"
        >
          <Bookmark size={18} class={isBookmarked ? 'fill-amber-400 text-amber-500' : 'text-slate-400'} />
        </button>
      </div>
      {#if question.image}
        <img
          src={assetUrl(question.image)}
          alt="تصویر سوال"
          loading="lazy"
          class="mx-auto mb-3 max-h-52 object-contain"
        />
      {/if}
      <p class="font-bold leading-7">{question.text}</p>
    </div>

    {@render optionList(question, picked, picked !== null)}

    {#if picked !== null}
      {@render feedbackCard(question, picked)}
      <button
        type="button"
        onclick={next}
        class="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
      >
        {current + 1 === questions.length ? 'دیدن نتیجه' : 'سوال بعدی'}
        <ArrowLeft size={18} />
      </button>
      <p class="mt-2 text-center text-[11px] text-slate-400">
        میان‌بر: کلید ۱ تا ۴ برای انتخاب گزینه، Enter برای ادامه
      </p>
    {/if}
  {:else if mode === 'result'}
    <div class="fade-in py-6 text-center">
      <div class="text-5xl">{passed ? '🎉' : '😞'}</div>
      <div
        class="stamp mt-4 inline-block rounded-2xl border-4 px-6 py-3 text-2xl font-black
          {passed ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}"
      >
        {passed ? 'قبول شدید!' : 'مردود شدید'}
      </div>

      <div class="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl border border-white/60 bg-white/80 p-4 text-sm leading-8 shadow-sm backdrop-blur">
        <div class="flex justify-between">
          <span>پاسخ درست</span>
          <b class="text-green-600">{toPersianDigits(correctCount)} از {toPersianDigits(questions.length)}</b>
        </div>
        <div class="flex justify-between">
          <span>پاسخ غلط</span>
          <b class="text-red-600">{toPersianDigits(wrongCount)}</b>
        </div>
        <div class="flex justify-between">
          <span>درصد</span>
          <b>{formatPercent(percent)}</b>
        </div>
        <div class="flex justify-between">
          <span>زمان</span>
          <b>{formatDuration(elapsed)}</b>
        </div>
        <div class="flex justify-between border-t border-slate-200 pt-2 text-xs text-slate-500">
          <span>حد نصاب</span>
          <span>{toPersianDigits(passRule)} درست و حداکثر {toPersianDigits(PASS_RULES.maxWrong)} غلط</span>
        </div>
      </div>

      <div class="mx-auto mt-6 grid max-w-sm gap-3">
        {#if wrongList.length > 0}
          <button
            type="button"
            onclick={startReview}
            class="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-bold text-white transition hover:bg-amber-600 active:scale-[0.99]"
          >
            <ListChecks size={18} />
            مرور اشتباهات ({toPersianDigits(wrongList.length)})
          </button>
        {/if}
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            onclick={retry}
            class="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
          >
            <RotateCcw size={18} />
            تلاش دوباره
          </button>
          <a
            href={resolve('/')}
            class="flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white py-3 font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.99]"
          >
            صفحه اصلی
          </a>
        </div>
        {#if index < total}
          <a
            href={resolve('/quiz/[id]', { id: String(index + 1) })}
            class="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-600 py-3 font-bold text-white transition hover:bg-green-700 active:scale-[0.99]"
          >
            آزمون بعدی {toPersianDigits(index + 1)}
            <ArrowLeft size={18} />
          </a>
        {/if}
      </div>
    </div>
  {:else}
    <div class="fade-in">
      <div class="mb-3 flex items-center justify-between">
        <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
          مرور اشتباهات {toPersianDigits(reviewAt + 1)} از {toPersianDigits(wrongList.length)}
        </span>
      </div>

      <div class="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
        {#if questions[wrongList[reviewAt]].image}
          <img
            src={assetUrl(questions[wrongList[reviewAt]].image as string)}
            alt="تصویر سوال"
            loading="lazy"
            class="mx-auto mb-3 max-h-52 object-contain"
          />
        {/if}
        <p class="font-bold leading-7">{questions[wrongList[reviewAt]].text}</p>
      </div>

      {@render optionList(questions[wrongList[reviewAt]], answers[wrongList[reviewAt]], true)}
      {@render feedbackCard(questions[wrongList[reviewAt]], answers[wrongList[reviewAt]])}

      <div class="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={reviewAt === 0}
          onclick={() => (reviewAt -= 1)}
          class="min-h-12 rounded-xl border border-slate-300 bg-white py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          قبلی
        </button>
        <button
          type="button"
          disabled={reviewAt + 1 >= wrongList.length}
          onclick={() => (reviewAt += 1)}
          class="min-h-12 rounded-xl border border-slate-300 bg-white py-3 font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40"
        >
          بعدی
        </button>
      </div>

      <button
        type="button"
        onclick={() => (mode = 'result')}
        class="mt-3 min-h-12 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 active:scale-[0.99]"
      >
        بازگشت به نتیجه
      </button>
    </div>
  {/if}
</div>
