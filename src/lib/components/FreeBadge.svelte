<script lang="ts">
  let { compact = false }: { compact?: boolean } = $props();
</script>

<p
  class="rounded-2xl border border-amber-200 bg-gradient-to-l from-amber-50 to-rose-50 px-4 text-center font-bold leading-6 text-amber-900
    {compact ? 'py-2 text-xs' : 'py-3 text-sm'}"
>
  این سامانه کاملاً رایگان، بدون تبلیغات و وقف مردم شریف ایران است ❤️
</p>
