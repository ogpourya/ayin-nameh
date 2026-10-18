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

  // GitHub Pages and resolve() disagree about the root trailing slash; compare without it.
  const normalize = (url: string) => url.replace(/\/+(?=$|#)/, '');
  const isActive = (href: string) => normalize(`${page.url.pathname}${page.url.hash}`) === normalize(href);

  const HOME = normalize(resolve('/'));
  const hashOf = (href: string) => (href.includes('#') ? href.slice(href.indexOf('#')) : '');

  /** On the home page the URL often already carries the target hash, so navigation alone would do nothing. Scroll by hand then. */
  function onNavClick(event: MouseEvent, href: string) {
    if (normalize(page.url.pathname) !== HOME) return; // a real navigation lands on the home page
    const hash = hashOf(href);
    if (!hash) {
      if (!page.url.hash) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    if (page.url.hash === hash) {
      event.preventDefault();
      document
        .getElementById(decodeURIComponent(hash.slice(1)))
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<nav
  class="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
  aria-label="ناوبری اصلی"
>
  <div class="glass mx-auto grid max-w-md grid-cols-4 gap-1 rounded-[1.75rem] p-1.5">
    {#each items as item (item.label)}
      <a
        href={item.href}
        onclick={(event) => onNavClick(event, item.href)}
        class="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-3xl text-[11px] font-bold transition
          {isActive(item.href)
          ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
      >
        <item.icon size={20} />
        <span>{item.label}</span>
      </a>
    {/each}
  </div>
</nav>
