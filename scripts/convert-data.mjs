// Converts the legacy vanilla-JS data globals (window.CARTEX, ...) into typed TS modules.
// Usage: npm run convert:data   (override source dir with SRC=/path/to/driving)
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.env.SRC ?? '/home/ogpourya/Downloads/driving';
const OUT = join(ROOT, 'src', 'lib', 'data');

const FILES = ['meta.js', 'cartex.js', 'signs.js', 'signgrids.js', 'concepts.js', 'lines.js'];

const data = {};
for (const file of FILES) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(readFileSync(join(SRC, 'data', file), 'utf8'), context, { filename: file });
  Object.assign(data, context.window);
}

const { META, CARTEX, SIGN_TYPES, SIGN_GRIDS, CONCEPTS, LINES } = data;

// Sheet OCR errors corrected by hand. Kept here so `npm run convert:data` cannot undo them.
// options is an index (0-based) -> replacement text map.
const FIXES = [
  // Answer keys contradicted by the question's own explanation or by the same question in other exams.
  { exam: 2, id: 21, correctAnswer: 1 },
  { exam: 7, id: 18, correctAnswer: 3 },
  { exam: 8, id: 8, correctAnswer: 4 },
  // Duplicate or truncated options and typos.
  { exam: 3, id: 5, options: { 3: 'پایان استفاده اجباری از زنجیر چرخ' } },
  {
    exam: 4,
    id: 8,
    options: { 1: 'رانندگانی که در سمت خط مقطع هستند نمی توانند از روی آن عبور کنند' }
  },
  { exam: 10, id: 9, options: { 3: 'استفاده از چراغ مه شکن در هنگام ریزش باران' } },
  {
    exam: 11,
    id: 9,
    text: 'اگر خودرویی با نور بالا از رو به رو به شما نزدیک شود چه باید بکنید؟',
    options: {
      0: 'باید با تبدیل نور پایین به نور بالا و بوق ممتد او را متوجه نمود که از نور پایین استفاده کند'
    }
  },
  { exam: 11, id: 12, options: { 3: 'ابتدا ۳، سپس ۱ و بعد ۲' } },
  {
    exam: 11,
    id: 13,
    text: 'هرگاه وسیله نقلیه موتوری در راه ها از کار بیفتد و به دلیل نور کافی نیاز به چراغ نباشد، راننده باید مثلث های شبرنگ را در چه فاصله ای از طرف عقب و جلوی وسیله نقلیه به نحوی که قابل دیدن باشد قرار دهد؟'
  },
  { exam: 17, id: 6, options: { 0: 'عبور با ارتفاع بیش از ۲ متر ممنوع' } },
  { exam: 18, id: 15, options: { 3: 'وسیله نقلیه ای که به طور مستقیم حرکت می کند' } },
  {
    exam: 18,
    id: 19,
    text: 'هدف از ..... ، تسلط کامل پاها و دست ها بر تجهیزات کنترلی همچون پدال ها، اهرم ها و غربیلک فرمان می باشد'
  },
  {
    exam: 20,
    id: 19,
    text: 'هدف از ..... ، تسلط کامل پاها و دست ها بر تجهیزات کنترلی همچون پدال ها، اهرم ها و غربیلک فرمان می باشد'
  },
  {
    exam: 19,
    id: 16,
    text: 'هرگاه وسیله نقلیه موتوری در راه ها از کار بیفتد و به دلیل نور کافی نیاز به چراغ نباشد، راننده باید مثلث های شبرنگ را در چه فاصله ای از طرف عقب و جلو وسیله نقلیه به نحوی که قابل دیدن باشد قرار دهد؟'
  }
];

const fixProblems = [];
for (const fix of FIXES) {
  const question = CARTEX[fix.exam - 1]?.questions.find((q) => q.id === fix.id);
  if (!question) {
    fixProblems.push(`fix target missing: exam ${fix.exam} q${fix.id}`);
    continue;
  }
  if (fix.correctAnswer) question.correctAnswer = fix.correctAnswer;
  if (fix.text) question.text = fix.text;
  for (const [index, text] of Object.entries(fix.options ?? {})) question.options[Number(index)] = text;
}

// OCR typos: [exam, question id, search, replacement]. Applied to the question text and every option.
const TEXT_FIXES = [
  [1, 23, 'نقطه کور سوار قرار دارد', 'نقطه کور سواری قرار دارد'],
  [2, 13, 'کیلومتر در سرعت است', 'کیلومتر در ساعت است'],
  [2, 25, 'موظند', 'موظفند'],
  [3, 24, 'در یر چهار راه ها', 'در سر چهار راه ها'],
  [4, 19, 'نتایح', 'نتایج'],
  [4, 19, 'نکنولوژی', 'تکنولوژی'],
  [4, 19, 'کسیری از ثانیه باز می باشد', 'کسری از ثانیه باز می شود'],
  [5, 9, 'در طول عبور از آهن', 'در طول عبور از خط آهن'],
  [5, 24, 'حق تقدم عبور تقدم عبور', 'حق تقدم عبور'],
  [7, 9, 'شیشه های خودو', 'شیشه های خودرو'],
  [7, 19, 'یخ ضدگی', 'یخ زدگی'],
  [7, 27, 'در همان محل نموده', 'در همان محل توقف نموده'],
  [8, 9, 'خودرویی از روبه که', 'خودرویی از رو به رو که'],
  [8, 15, 'راهی است داری حداقل', 'راهی است دارای حداقل'],
  [8, 24, 'آلودگی هوا ناشناس', 'آلودگی هوا ناشی'],
  [9, 20, '۸۰ متر ۱۰۰ هزار کیلومتر', '۸۰ تا ۱۰۰ هزار کیلومتر'],
  [11, 4, 'یا وزن بیش از', 'با وزن بیش از'],
  [11, 18, 'غریبلک', 'غربیلک'],
  [11, 21, 'انتقال باید زیاد است', 'انتقال یابد زیاد است'],
  [12, 9, 'نور پایین نماییم', 'نور پایین تبدیل نماییم'],
  [12, 9, '۱۵۰ متر با بیشتر', '۱۵۰ متر یا بیشتر'],
  [12, 9, 'خوردرویی', 'خودرویی'],
  [12, 9, '۲۰۰ متر با کمتر', '۲۰۰ متر یا کمتر'],
  [13, 23, 'نور خیره کنده', 'نور خیره کننده'],
  [18, 7, 'توقف مسیر حرکت', 'توقف و مسیر حرکت'],
  [18, 26, 'گذرکاه', 'گذرگاه'],
  [19, 15, 'حرکت می کنید', 'حرکت می کنند'],
  [19, 28, 'پیچ های در پی در پی', 'پیچ های پی در پی']
];

for (const [exam, id, from, to] of TEXT_FIXES) {
  const question = CARTEX[exam - 1]?.questions.find((q) => q.id === id);
  if (!question) {
    fixProblems.push(`text fix target missing: exam ${exam} q${id}`);
    continue;
  }
  const apply = (value) => value.replaceAll(from, to);
  let hits = 0;
  if (question.text.includes(from)) {
    question.text = apply(question.text);
    hits += 1;
  }
  question.options = question.options.map((option) => {
    if (!option.includes(from)) return option;
    hits += 1;
    return apply(option);
  });
  if (!hits) fixProblems.push(`text fix not found: exam ${exam} q${id} "${from}"`);
}

const banner = '// Generated by scripts/convert-data.mjs from the legacy data files. Regenerate with: npm run convert:data\n\n';
const emit = (file, body) => {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, file), banner + body);
};

emit(
  'meta.ts',
  `import type { MetaInfo } from '../types';\n\nexport const META: MetaInfo = ${JSON.stringify(META)};\n`
);
emit(
  'cartex.ts',
  `import type { CartexExam } from '../types';\n\nexport const CARTEX: CartexExam[] = ${JSON.stringify(CARTEX)};\n`
);
emit(
  'signs.ts',
  `import type { SignCategory } from '../types';\n\nexport const SIGN_TYPES: SignCategory[] = ${JSON.stringify(SIGN_TYPES)};\n`
);
emit(
  'signgrids.ts',
  `import type { SignGridItem } from '../types';\n\nexport const SIGN_GRIDS: Record<string, SignGridItem[]> = ${JSON.stringify(SIGN_GRIDS)};\n`
);
emit(
  'concepts.ts',
  `import type { ConceptColor, ConceptShape } from '../types';\n\nexport const CONCEPT_COLORS: ConceptColor[] = ${JSON.stringify(CONCEPTS.colors)};\n\nexport const CONCEPT_SHAPES: ConceptShape[] = ${JSON.stringify(CONCEPTS.shapes)};\n`
);
emit(
  'lines.ts',
  `import type { LineItem } from '../types';\n\nexport const LINES: LineItem[] = ${JSON.stringify(LINES)};\n`
);

// Exam sheet scans: examN_-P.jpg -> how many pages each exam has.
const pageCounts = {};
for (const name of readdirSync(join(SRC, 'assets', 'pages'))) {
  const match = name.match(/^exam(\d+)_-(\d+)\./);
  if (match) pageCounts[Number(match[1])] = Math.max(pageCounts[Number(match[1])] ?? 0, Number(match[2]));
}
const sortedPageCounts = Object.fromEntries(
  Object.keys(pageCounts)
    .map(Number)
    .sort((a, b) => a - b)
    .map((n) => [n, pageCounts[n]])
);
emit(
  'pages.ts',
  `/** Number of sheet-scan images available per exam id (page images live under static/assets/pages). */\nexport const PAGE_COUNTS: Record<number, number> = ${JSON.stringify(sortedPageCounts)};\n`
);

// ---- data validation report ----
const problems = [...fixProblems];
CARTEX.forEach((exam, i) => {
  const n = i + 1;
  if (!exam.questions.length) problems.push(`exam ${n}: no questions`);
  for (const q of exam.questions) {
    if (!q.text) problems.push(`exam ${n} q${q.id}: empty text`);
    if (q.options.length !== 4) problems.push(`exam ${n} q${q.id}: ${q.options.length} options`);
    if (new Set(q.options).size !== q.options.length) problems.push(`exam ${n} q${q.id}: duplicate options`);
    if (!Number.isInteger(q.correctAnswer) || q.correctAnswer < 1 || q.correctAnswer > q.options.length) {
      problems.push(`exam ${n} q${q.id}: bad correctAnswer ${q.correctAnswer}`);
    }
  }
  if (!pageCounts[n]) problems.push(`exam ${n}: no sheet pages on disk`);
});

const perExam = CARTEX.map((exam) => exam.questions.length);
console.log(`exams: ${CARTEX.length}`);
console.log(`questions: ${perExam.reduce((a, b) => a + b, 0)} (min ${Math.min(...perExam)}, max ${Math.max(...perExam)})`);
console.log(
  `sign categories: ${SIGN_TYPES.length}, grids: ${Object.keys(SIGN_GRIDS).length}, colors: ${CONCEPTS.colors.length}, shapes: ${CONCEPTS.shapes.length}, lines: ${LINES.length}`
);
if (problems.length) {
  console.log(`\nproblems (${problems.length}):`);
  for (const problem of problems.slice(0, 40)) console.log(`- ${problem}`);
} else {
  console.log('data checks: all good');
}
