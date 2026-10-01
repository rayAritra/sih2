// API Client abstraction supporting both DEMO mode and real API mode

const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE || "demo";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export function isDemoMode(): boolean {
  if (typeof window !== "undefined") {
    const override = localStorage.getItem("qshield_data_mode");
    if (override) return override === "demo";
  }
  return DATA_MODE === "demo";
}

export function setDataMode(mode: "demo" | "api") {
  if (typeof window !== "undefined") {
    localStorage.setItem("qshield_data_mode", mode);
    window.dispatchEvent(new Event("qshield_mode_change"));
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
  demoFallback?: () => Promise<T> | T
): Promise<T> {
  if (isDemoMode()) {
    if (demoFallback) {
      // Simulate realistic slight micro-latency (50-150ms)
      await new Promise((resolve) => setTimeout(resolve, 80));
      return demoFallback();
    }
    throw new Error(`Demo fallback not provided for ${endpoint}`);
  }

  // API Mode
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorBody || res.statusText}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[QShield API] Failed connecting to backend endpoint ${endpoint}. Falling back to deterministic demo data.`, err);
    if (demoFallback) {
      return demoFallback();
    }
    throw err;
  }
}
