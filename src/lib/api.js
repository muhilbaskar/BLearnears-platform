// src/lib/api.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:1234";

async function post(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok || data?.success === false) {
    const fieldError = data?.details && Object.values(data.details)?.[0];
    const msg = data?.error || fieldError || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data;
}

export const registerInterest = (payload) => post("/api/register", payload);