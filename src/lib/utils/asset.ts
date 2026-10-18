import { asset } from '$app/paths';
import type { AssetPath } from '$app/types';

/** Prefix a data-file asset path ("assets/img/x.png") with the deployment base path. */
export const assetUrl = (path: string): string => asset(path.replace(/^\/+/, '') as AssetPath);
