import { error } from '@sveltejs/kit';
import { SIGN_TYPES } from '#lib/data/signs';
import { SIGN_GRIDS } from '#lib/data/signgrids';

export const entries = () => SIGN_TYPES.filter((t) => t.kind === 'grid').map((t) => ({ type: t.id }));

export function load({ params }) {
  const category = SIGN_TYPES.find((t) => t.id === params.type);
  const items = category ? (SIGN_GRIDS[category.id] ?? []) : [];
  if (!category || category.kind !== 'grid' || items.length === 0) {
    error(404, 'دسته تابلو پیدا نشد');
  }
  return { category, items };
}
