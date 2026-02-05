/**
 * API configuration - reads from Vite env variables
 */
export const API_CONFIG = {
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5001",
} as const;
