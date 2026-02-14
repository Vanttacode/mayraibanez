// src/lib/site.ts
const handle = import.meta.env.PUBLIC_SITE_HANDLE?.trim();
const baseUrl = import.meta.env.PUBLIC_SITE_BASE_URL?.trim();

export const SITE_HANDLE = handle && handle.length > 0 ? handle : "mayraibanez";
export const SITE_BASE_URL = baseUrl && baseUrl.length > 0 ? baseUrl : "http://localhost:4321";

if (!handle) {
  console.warn(`[site] Falta PUBLIC_SITE_HANDLE. Usando fallback: "${SITE_HANDLE}"`);
}
if (!baseUrl) {
  console.warn(`[site] Falta PUBLIC_SITE_BASE_URL. Usando fallback: "${SITE_BASE_URL}"`);
}
