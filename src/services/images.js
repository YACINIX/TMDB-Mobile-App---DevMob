export const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

export function posterUrl(path) {
  if (!path) return null;
  return `${TMDB_IMG}${path}`;
}
