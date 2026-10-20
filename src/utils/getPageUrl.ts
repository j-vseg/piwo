export function getPageUrl(path: string) {
  return joinUrl(process.env.EXPO_PUBLIC_FIREBASE_WEB_URL ?? "", path);
}

/**
 * Joins a base URL and a path with exactly one slash between them, whether or not the base ends
 * with a slash or the path starts with one. Base URLs come from per-environment variables that are
 * written both with and without a trailing slash, so string concatenation is not safe. An empty
 * path gives the base without a trailing slash.
 */
export function joinUrl(base: string, path: string): string {
  const trimmedBase = base.replace(/\/+$/, "");
  const trimmedPath = path.replace(/^\/+/, "");
  return trimmedPath ? `${trimmedBase}/${trimmedPath}` : trimmedBase;
}

/** The API base URL, without a trailing slash. */
export const apiBaseUrl = (
  process.env.EXPO_PUBLIC_FIREBASE_WEB_URL ?? ""
).replace(/\/+$/, "");

/** An absolute API URL for `path`, for requests made outside of the `$api` client. */
export function apiUrl(path: string): string {
  return joinUrl(apiBaseUrl, path);
}
