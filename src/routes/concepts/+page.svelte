<script lang="ts">
  import Header from '#lib/components/Header.svelte';
  import { CONCEPT_COLORS, CONCEPT_SHAPES } from '#lib/data/concepts';
  import { assetUrl } from '#lib/utils/asset';
</script>

<svelte:head>
  <title>مفهوم رنگ‌ها و شکل‌های علائم | آیین‌نامه رانندگی</title>
</svelte:head>

<Header title="مفهوم رنگ‌ها و شکل‌ها" />

<div class="space-y-6 p-4">
  <section class="fade-in">
    <h2 class="mb-3 font-black">مفهوم رنگ‌ها در علائم عبور و مرور</h2>
    <div class="space-y-3">
      {#each CONCEPT_COLORS as item (item.title)}
        <div class="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
          <div
            class="h-14 w-14 shrink-0 rounded-xl border border-black/10"
            style={`background: ${item.color}`}
            aria-hidden="true"
          ></div>
          <div>
            <div class="font-bold">{item.title}</div>
            <div class="mt-1 text-sm leading-7 text-slate-600">{item.desc}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="fade-in">
    <h2 class="mb-3 font-black">مفهوم شکل‌ها در علائم عبور و مرور</h2>
    <div class="space-y-3">
      {#each CONCEPT_SHAPES as item (item.title)}
        <div class="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
          <img src={assetUrl(item.img)} alt="" loading="lazy" class="h-16 w-16 shrink-0 object-contain" />
          <div>
            <div class="font-bold">{item.title}</div>
            <div class="mt-1 text-sm leading-7 text-slate-600">{item.desc}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
