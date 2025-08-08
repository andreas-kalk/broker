import { SECTION_TYPES } from '../config/constants';

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
 * Groups section data based on field structure
 */
export const groupSectionData = (
  headers: string[],
  dataRows: Record<string, string>[]
): Record<string, string> => {
  const groupedData: Record<string, string> = {};

  // Check if this section uses Feldname/Feldwert structure
  const hasFeldnameStructure = headers.includes('Feldname') && headers.includes('Feldwert');

  if (hasFeldnameStructure) {
    dataRows.forEach((row) => {
      const fieldName = row['Feldname'];
      const fieldValue = row['Feldwert'];
      if (fieldName && fieldValue && fieldValue.trim() !== '' && fieldValue !== '-') {
        groupedData[fieldName] = fieldValue;
      }
    });
  } else {
    dataRows.forEach((row) => {
      headers.forEach((header) => {
        const value = row[header];
        if (value && value !== '-' && value.trim() !== '') {
          groupedData[header] = value;
        }
      });
    });
  }

  return groupedData;
};

/**
 * Separates important fields from other data
 */
export const separateImportantFields = (
  data: Record<string, string>
): { important: Record<string, string>; other: Record<string, string> } => {
  const importantFields = [
    'Name', 'Account', 'Kontotyp', 'Kundentyp', 'Basiswährung', 'Kontoberechtigungen',
    'BrokerName', 'Title', 'Period', 'WhenGenerated'
  ];

  const important: Record<string, string> = {};
  const other: Record<string, string> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (importantFields.includes(key)) {
      important[key] = value;
    } else {
      other[key] = value;
    }
  });

  return { important, other };
};
