// Transaction code mappings for broker data
export interface CodeMapping {
  [key: string]: string;
}

// Individual code meanings
export const transactionCodes: CodeMapping = {
  // Order types
  'A': 'Auftrag (Assignment)',
  'O': 'Eröffnung (Opening)',
  'C': 'Schließung (Closing)',
  'IA': 'Interne Abrechnung (Internal Assignment)',
  'IM': 'Interne Bewegung (Internal Movement)',
  'P': 'Teilweise (Partial)',
  'E': 'Ausübung (Exercise)',
  'Ex': 'Verfallen (Expired)',
  'L': 'Liquidation',
  'T': 'Transfer',
  'D': 'Dividende',
  'F': 'Gebühr (Fee)',
  'W': 'Auszahlung (Withdrawal)',
  'DEP': 'Einzahlung (Deposit)',
  'INT': 'Zinsen (Interest)',
  'DIV': 'Dividende',
  'TAX': 'Steuer (Tax)',
  'FEE': 'Gebühr (Fee)',
  'ADJ': 'Anpassung (Adjustment)',
  'CORP': 'Corporate Action',
  'SPLIT': 'Aktiensplit (Stock Split)',
  'SPIN': 'Spin-off',
  'MERGER': 'Fusion (Merger)',
  'RIGHTS': 'Bezugsrechte (Rights)',
  'TENDER': 'Übernahmeangebot (Tender Offer)'
};

// Function to parse and translate compound codes (e.g., "A;O", "C;IM;P")
export const translateTransactionCode = (code: string): string => {
  if (!code || code.trim() === '') {
    return '-';
  }

  // Handle compound codes separated by semicolons
  const codeParts = code.split(';').map(part => part.trim());
  const translatedParts = codeParts.map(part => {
    return transactionCodes[part] || part;
  });

  return translatedParts.join(' + ');
};

// Function to get a short description for common code combinations
export const getCodeDescription = (code: string): string => {
  if (!code || code.trim() === '') {
    return 'Unbekannt';
  }

  const normalizedCode = code.replace(/;/g, '').replace(/\s/g, '');

  // Common combinations with specific meanings
  const commonCombinations: CodeMapping = {
    'AO': 'Auftrag Eröffnung',
    'AC': 'Auftrag Schließung',
    'IAO': 'Interne Auftrag Eröffnung',
    'CIMP': 'Schließung durch interne Bewegung (teilweise)',
    'O': 'Eröffnungsgeschäft',
    'C': 'Schließungsgeschäft',
    'A': 'Auftrag/Zuteilung'
  };

  return commonCombinations[normalizedCode] || translateTransactionCode(code);
};

// Asset category translations
export const assetCategories: CodeMapping = {
  'Stocks': 'Aktien',
  'Equity and Index Options': 'Aktien- und Indexoptionen',
  'Options': 'Optionen',
  'Forex': 'Devisen',
  'Futures': 'Futures',
  'Bonds': 'Anleihen',
  'Cash': 'Bargeld',
  'Commodities': 'Rohstoffe',
  'ETF': 'ETF',
  'Mutual Fund': 'Investmentfonds',
  'Cryptocurrency': 'Kryptowährung'
};

// Function to translate asset category
export const translateAssetCategory = (category: string): string => {
  return assetCategories[category] || category;
};
