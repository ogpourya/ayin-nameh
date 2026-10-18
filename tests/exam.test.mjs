import assert from 'node:assert/strict';
import test from 'node:test';
import { CARTEX } from '../src/lib/data/cartex.ts';
import { isPassed, minCorrectFor } from '../src/lib/utils/exam.ts';
import { formatDuration, formatPercent, toPersianDigits } from '../src/lib/utils/formatters.ts';

test('minCorrectFor scales the official threshold down for short exams', () => {
  assert.equal(minCorrectFor(30), 26);
  assert.equal(minCorrectFor(20), 16);
  assert.equal(minCorrectFor(3), 1);
});

test('isPassed follows the 26-correct / 4-wrong rule', () => {
  assert.equal(isPassed(26, 4, 30), true);
  assert.equal(isPassed(30, 0, 30), true);
  assert.equal(isPassed(25, 5, 30), false);
  assert.equal(isPassed(26, 5, 30), false);
  assert.equal(isPassed(25, 4, 30), false);
});

test('formatters produce Persian digits', () => {
  assert.equal(toPersianDigits(1234), '۱۲۳۴');
  assert.equal(toPersianDigits('آزمون 5'), 'آزمون ۵');
  assert.equal(formatPercent(14.6), '۱۵٪');
  assert.equal(formatDuration(75), '۱:۱۵');
  assert.equal(formatDuration(600), '۱۰:۰۰');
});

test('question data is intact', () => {
  const questions = CARTEX.flatMap((exam) => exam.questions);
  assert.equal(CARTEX.length, 20);
  assert.equal(questions.length, 600);
  for (const q of questions) {
    assert.equal(q.options.length, 4, `${q.id}: ${q.options.length} options`);
    assert.equal(new Set(q.options).size, 4, `${q.id}: duplicate options`);
    assert.ok(q.correctAnswer >= 1 && q.correctAnswer <= 4, `${q.id}: bad correctAnswer`);
    assert.ok(q.text.trim().length > 0, `${q.id}: empty text`);
  }
});

test('corrections from scripts/convert-data.mjs survive regeneration', () => {
  const answer = (exam, id) => CARTEX[exam - 1].questions.find((q) => q.id === id).correctAnswer;
  assert.equal(answer(2, 21), 1);
  assert.equal(answer(7, 18), 3);
  assert.equal(answer(8, 8), 4);
});
