import assert from 'node:assert/strict';
import test from 'node:test';
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
