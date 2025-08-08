import {SECTION_TYPES} from '../config/constants';

/**
 * Determines the section type based on section name
 */
export const getSectionType = (sectionName: string): string | null => {
    const lowerName = sectionName.toLowerCase();

    if (lowerName.includes(SECTION_TYPES.DIVIDENDS)) {
        return SECTION_TYPES.DIVIDENDS;
    }

    if (lowerName.includes(SECTION_TYPES.TRADES) ||
        lowerName.includes('handel') ||
        lowerName.includes(SECTION_TYPES.TRANSACTIONS) ||
        lowerName === 'Trades') {
        return SECTION_TYPES.TRADES;
    }

    return null;
};

/**
 * Checks if a section contains financial data that needs code translation
 */
export const isFinancialSection = (sectionName: string): boolean => {
    const sectionType = getSectionType(sectionName);
    return sectionType === SECTION_TYPES.TRADES;
};

/**
 * Re-export SECTION_TYPES for convenience
 */
export {SECTION_TYPES} from '../config/constants';
