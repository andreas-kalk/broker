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

// Translation constants
export const SECTION_TYPES = {
    DIVIDENDS: 'dividenden',
    TRADES: 'trades',
    TRANSACTIONS: 'transakt',
} as const;
