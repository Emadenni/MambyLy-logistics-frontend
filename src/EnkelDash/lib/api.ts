// src/lib/api.ts
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuthStore } from "../../store/useAuthStore"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; 
// es: http://localhost:3000 oppure https://api.mambylysolutions.se

async function getAuthHeader() {
  const { tokens } = await fetchAuthSession();
  const at = tokens?.accessToken?.toString();
  return at ? { Authorization: `Bearer ${at}` } : {};
}

export async function api(
  path: string,
  options: RequestInit = {},
  { absolute = false }: { absolute?: boolean } = {}
) {
  const url = absolute ? path : `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  const authHeader = await getAuthHeader();

  // Default headers
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  Object.entries(authHeader).forEach(([k, v]) => headers.set(k, v as string));

  const res = await fetch(url, { ...options, headers });

  // Se token scaduto/invalidato
  if (res.status === 401) {
    // chiama lo store per pulire e mostrare messaggio
    useAuthStore.getState().handleUnauthorized?.();
  }

  // Tenta di parse JSON, ma non obbliga
  let data: any = null;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const err = new Error((data && (data.message || data.error)) || `HTTP ${res.status}`);
    (err as any).status = res.status;
    (err as any).body = data;
    throw err;
  }

  return data;
}

// Helper comodi
export const apiGet = (path: string, opts?: RequestInit) =>
  api(path, { method: "GET", ...(opts || {}) });

export const apiPost = (path: string, body?: unknown, opts?: RequestInit) =>
  api(path, { method: "POST", body: body ? JSON.stringify(body) : undefined, ...(opts || {}) });

export const apiPut = (path: string, body?: unknown, opts?: RequestInit) =>
  api(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined, ...(opts || {}) });

export const apiDelete = (path: string, opts?: RequestInit) =>
  api(path, { method: "DELETE", ...(opts || {}) });
