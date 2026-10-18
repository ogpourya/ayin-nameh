<script lang="ts">
  import { STATUS } from '#lib/stores/examProgress.svelte';

  let { status }: { status: number } = $props();
</script>

{#if status === STATUS.passed}
  <span class="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">قبول شده</span>
{:else if status === STATUS.failed}
  <span class="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">مردود</span>
{:else if status === STATUS.inProgress}
  <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-bold text-indigo-700">در حال انجام</span>
{/if}
