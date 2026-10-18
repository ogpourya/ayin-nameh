<script lang="ts">
  import Quiz from '#lib/components/Quiz.svelte';
  import { toPersianDigits } from '#lib/utils/formatters';

  let { data } = $props();
</script>

<svelte:head>
  <title>آزمون اصلی {toPersianDigits(data.index)} | آیین‌نامه رانندگی</title>
</svelte:head>

{#key data.index}
  <Quiz exam={data.exam} index={data.index} total={data.total} />
{/key}
