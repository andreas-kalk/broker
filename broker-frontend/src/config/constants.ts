// Application constants
export const APP_CONFIG = {
  API: {
    BASE_URL: '/api',
    TIMEOUT: 10000,
  },
  TAX: {
    DEFAULT_YEAR: 2024,
  },
  UI: {
    MAX_TABLE_HEIGHT: 600,
    DEBOUNCE_DELAY: 300,
  },
} as const;

// Route constants
export const ROUTES = {
  HOME: '/',
  SECTION_DETAIL: '/section/:sectionName',
  TAX_ANALYSIS: '/tax-analysis',
} as const;

// File upload constants
export const FILE_UPLOAD = {
  ACCEPTED_TYPES: ['.csv', '.txt'],
  MAX_SIZE_MB: 50,
} as const;

// Table configuration
export const TABLE_CONFIG = {
  ROWS_PER_PAGE: [10, 25, 50, 100],
  DEFAULT_PAGE_SIZE: 25,
} as const;

// Translation constants
export const SECTION_TYPES = {
  DIVIDENDS: 'dividenden',
  TRADES: 'trades',
  TRANSACTIONS: 'transakt',
} as const;
