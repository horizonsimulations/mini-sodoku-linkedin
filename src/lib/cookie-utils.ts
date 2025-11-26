const DAY_IN_SECONDS = 60 * 60 * 24;

const setCookie = (
  name: string,
  value: string,
  options: { maxAgeDays?: number } = {},
) => {
  if (typeof document === "undefined") return;
  const maxAge = (options.maxAgeDays ?? 365) * DAY_IN_SECONDS;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
};

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((row) => row.startsWith(`${name}=`));
  if (!entry) return null;
  return decodeURIComponent(entry.split("=")[1] ?? "");
};

export const CONSENT_COOKIE = "msl_cookie_consent";
export const COMPLETION_COOKIE = "msl_level_completion";

export const hasCookieConsent = () => getCookie(CONSENT_COOKIE) === "granted";

export const persistCookieConsent = () => {
  setCookie(CONSENT_COOKIE, "granted", { maxAgeDays: 365 });
};

type CompletionMap = Record<string, "solved">;

const parseCompletionCookie = (): CompletionMap => {
  try {
    const raw = getCookie(COMPLETION_COOKIE);
    if (!raw) return {};
    return JSON.parse(raw) as CompletionMap;
  } catch {
    return {};
  }
};

const serializeCompletionCookie = (map: CompletionMap) => {
  setCookie(COMPLETION_COOKIE, JSON.stringify(map), { maxAgeDays: 365 });
};

export const readCompletionProgress = () => parseCompletionCookie();

export const markLevelComplete = (slug: string) => {
  const current = parseCompletionCookie();
  if (current[slug] === "solved") return;
  current[slug] = "solved";
  serializeCompletionCookie(current);
};

