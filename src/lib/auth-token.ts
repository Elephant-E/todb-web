export const AUTH_TOKEN_STORAGE_KEY = "todb_api_key";
export const AUTH_TOKEN_QUERY_KEY = "api_key";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const queryToken = url.searchParams.get(AUTH_TOKEN_QUERY_KEY);
  if (queryToken) {
    setAuthToken(queryToken);
    return queryToken;
  }

  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event("todb-auth-change"));
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) return;
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event("todb-auth-change"));
}

export function consumeAuthTokenFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const url = new URL(window.location.href);
  const token = url.searchParams.get(AUTH_TOKEN_QUERY_KEY);
  if (!token) return null;

  setAuthToken(token);
  url.searchParams.delete(AUTH_TOKEN_QUERY_KEY);
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", nextUrl || "/");
  return token;
}
