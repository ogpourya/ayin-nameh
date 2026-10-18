// Everything is static: prerender every route, ship a 404.html SPA fallback for deep links.
export const prerender = true;

// Pages are served as `quiz/1.html` (no directory index), so the extensionless URL is the live one.
export const trailingSlash = 'never';
