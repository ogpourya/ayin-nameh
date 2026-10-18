# آیین‌نامه رانندگی

وب‌اپلیکیشن آزمون آیین‌نامه رانندگی — بازنویسی‌شده با SvelteKit 3، Svelte 5 (runes) و Tailwind CSS 4. کاملاً رایگان، بدون تبلیغات و وقف مردم شریف ایران است ❤️

## امکانات

- **۲۰ آزمون تستی** (۶۰۰ سوال اصلی) با تصویر، بازخورد فوری، توضیح قانونی و حد نصاب رسمی (۲۶ درست و حداکثر ۴ غلط)
- **برگه‌های اصلی آزمون** به همراه نمایشگر تمام‌صفحه
- **کتابخانه تصویری تابلوها** با حالت سنجش حافظه (پنهان‌کردن نام تابلوها)
- **مفهوم رنگ‌ها و شکل‌ها** و **مفهوم خط‌کشی‌ها**
- پیشرفت‌سنجی: قبول/مردود/در حال انجام، نشان‌کردن سوالات مهم، نوار آمادگی و «مرور اشتباهات»
- رابط فارسی و راست‌به‌چپ با فونت Vazirmatn، اعداد فارسی، میان‌برهای صفحه‌کلید (۱ تا ۴ و Enter) و نوار پایین موبایل

## توسعه

```bash
npm install
npm run dev      # اجرای محلی
npm test         # تست‌های منطقی (Node test runner)
npm run check    # بررسی تایپ‌ها (svelte-check)
npm run build    # خروجی استاتیک در build/
npm run preview  # پیش‌نمایش خروجی
```

## داده‌ها

داده‌ها از اپ نسخه قدیمی (`~/Downloads/driving/data`) به ماژول‌های تایپ‌شده تبدیل شده‌اند:

```bash
npm run convert:data                       # بازتولید src/lib/data از منبع پیش‌فرض
SRC=/path/to/driving npm run convert:data  # منبع دیگر
```

## استقرار روی GitHub Pages

1. در تنظیمات مخزن، **Settings → Pages → Source** را روی **GitHub Actions** بگذارید.
2. با هر push روی `main`، ورک‌فلو `.github/workflows/deploy.yml` پروژه را می‌سازد و در Pages منتشر می‌کند.

آدرس پیش‌فرض پروژه `https://<username>.github.io/ayin-nameh/` است؛ بنابراین `base` در `vite.config.ts` روی `/ayin-nameh` تنظیم شده و از `asset()` و `resolve()` از `$app/paths` برای همه مسیرها استفاده می‌شود. (در SvelteKit 3 پیکربندی به‌جای `svelte.config.js` داخل پلاگین `sveltekit()` در `vite.config.ts` قرار می‌گیرد.)

برای دامنه اختصاصی یا سایت کاربری (`username.github.io`)، با base خالی بسازید:

```bash
BASE_PATH='' npm run build
```

## مجوز

LICENSE
