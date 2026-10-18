<script lang="ts">
  import Quiz from '#lib/components/Quiz.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import { toPersianDigits } from '#lib/utils/formatters';

  let { data } = $props();

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'Quiz',
    name: `آزمون آیین‌نامه شماره ${data.index}`,
    numberOfQuestions: data.exam.questions.length,
    inLanguage: 'fa-IR',
    isAccessibleForFree: true,
    url: `https://ogpourya.github.io/ayin-nameh/quiz/${data.index}`
  });
</script>

<Seo
  title={`آزمون اصلی ${toPersianDigits(data.index)} | ${toPersianDigits(data.exam.questions.length)} سوال آیین‌نامه رانندگی`}
  description={`آزمون شماره ${toPersianDigits(data.index)} آیین‌نامه رانندگی با ${toPersianDigits(data.exam.questions.length)} سوال اصلی و تصویر تابلوها. کاملاً رایگان؛ با تکرار این آزمون‌ها در آزمون اصلی قبول شوید.`}
  {jsonLd}
/>

{#key data.index}
  <Quiz exam={data.exam} index={data.index} total={data.total} />
{/key}
