// Centralized API Base URL configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Fallback logging for deployment diagnostics
console.log("VITE_API_URL configuration status:", {
  value: import.meta.env.VITE_API_URL || 'Not Defined (falling back to relative /api)',
  isProduction: import.meta.env.PROD
});
