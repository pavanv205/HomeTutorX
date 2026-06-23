// Centralized API Base URL configuration
const rawApiUrl = import.meta.env.VITE_API_URL || '';
const hasPlaceholder = rawApiUrl.includes('<') || rawApiUrl.includes('>') || rawApiUrl.includes('placeholder');

export const API_BASE_URL = hasPlaceholder ? '' : rawApiUrl;

// Fallback logging for deployment diagnostics
console.log("VITE_API_URL configuration status:", {
  value: rawApiUrl || 'Not Defined (falling back to relative /api)',
  hasPlaceholder,
  effectiveBaseUrl: API_BASE_URL || 'Relative (/api)',
  isProduction: import.meta.env.PROD
});
