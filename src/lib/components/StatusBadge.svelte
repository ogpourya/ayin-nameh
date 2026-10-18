<script lang="ts">
  import { STATUS } from '#lib/stores/examProgress.svelte';

  let { status }: { status: number } = $props();
</script>

{#if status === STATUS.passed}
  <span class="rounded-full bg-green-500/15 px-2 py-0.5 text-[11px] font-bold text-green-700 dark:text-green-300">
    قبول شده
  </span>
{:else if status === STATUS.failed}
  <span class="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:text-red-300">
    مردود
  </span>
{:else if status === STATUS.inProgress}
  <span class="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
    در حال انجام
  </span>
{/if}
