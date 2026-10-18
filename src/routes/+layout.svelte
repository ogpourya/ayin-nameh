<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import '../app.css';
  import BottomNav from '#lib/components/BottomNav.svelte';
  import FreeBadge from '#lib/components/FreeBadge.svelte';
  import { progress } from '#lib/stores/examProgress.svelte';

  let { children }: { children: Snippet } = $props();

  onMount(() => progress.init());
</script>

<div class="mx-auto flex min-h-dvh max-w-3xl flex-col">
  <main class="flex-1 pb-20">
    {@render children()}
  </main>

  <footer class="px-4 pb-24">
    <FreeBadge />
  </footer>

  <BottomNav />
</div>
