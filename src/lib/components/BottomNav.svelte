<script lang="ts">
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { ClipboardList, FileImage, Home, LayoutGrid } from '@lucide/svelte';

  const items = [
    { label: 'خانه', href: resolve('/'), icon: Home },
    { label: 'برگه‌ها', href: resolve('/#sheets'), icon: FileImage },
    { label: 'آزمون‌ها', href: resolve('/#exams'), icon: ClipboardList },
    { label: 'تابلوها', href: resolve('/#signs'), icon: LayoutGrid }
  ];

  const isActive = (href: string) => `${page.url.pathname}${page.url.hash}` === href;
</script>

<nav
  class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/70 bg-white/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl"
  aria-label="ناوبری اصلی"
>
  <div class="mx-auto grid max-w-3xl grid-cols-4">
    {#each items as item (item.label)}
      <a
        href={item.href}
        class="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold transition
          {isActive(item.href) ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}"
      >
        <item.icon size={20} />
        <span>{item.label}</span>
      </a>
    {/each}
  </div>
</nav>
