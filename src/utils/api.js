// Central API base URL. Prefer env vars; fall back to same-origin or localhost.
// Supports CRA: REACT_APP_API_URL or REACT_APP_API_BASE; Vite: VITE_API_BASE
const envBase =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_API_BASE ||
  process.env.VITE_API_BASE;

// If running in browser and no env provided, default to current origin (dev server)
// Otherwise, for SSR/build tools, default to localhost
const derivedBase = (() => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:5000";
})();

const baseRaw = envBase || derivedBase;
// Ensure base has no trailing slash for consistent joining with URL()
export const API_BASE = String(baseRaw).replace(/\/$/, "");

export const apiFetch = (path, options = {}) => {
  if (path.startsWith("http")) return fetch(path, options);
  // Ensure path starts with a slash for URL resolution
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // URL will correctly handle cases where API_BASE already includes /api
  const url = new URL(normalizedPath, `${API_BASE}/`).toString();
  return fetch(url, options);
};
