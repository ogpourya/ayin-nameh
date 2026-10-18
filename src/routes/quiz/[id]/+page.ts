import { error } from '@sveltejs/kit';
import { CARTEX } from '#lib/data/cartex';

export const entries = () => CARTEX.map((_, i) => ({ id: String(i + 1) }));

export function load({ params }) {
  const index = Number(params.id);
  if (!Number.isInteger(index) || index < 1 || index > CARTEX.length) {
    error(404, 'آزمون مورد نظر پیدا نشد');
  }
  return { index, exam: CARTEX[index - 1], total: CARTEX.length };
}
