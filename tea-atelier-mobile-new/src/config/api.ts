// Empty string = relative paths (uses Vite proxy in dev, same-origin on web)
// Set VITE_API_URL in .env for native device builds pointing to Railway
export const API_URL = import.meta.env.VITE_API_URL ?? "";
