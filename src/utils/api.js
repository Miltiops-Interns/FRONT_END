// Central API base URL. Prefer env vars; fall back to same-origin or localhost.
const envBase = process.env.REACT_APP_API_BASE || process.env.VITE_API_BASE;

// If running via CRA build, REACT_APP_* is used. For Vite, VITE_* is used. If none, derive.
const derivedBase = (() => {
  if (typeof window !== "undefined") {
    // If the frontend is served from the same host, use relative /api.
    // Otherwise, default to current origin with /api as prefix.
    return `${window.location.origin}`;
  }
  return "http://localhost:5000";
})();

export const API_BASE = (envBase || derivedBase).replace(/\/$/, "");

export const apiFetch = (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  return fetch(url, options);
};
