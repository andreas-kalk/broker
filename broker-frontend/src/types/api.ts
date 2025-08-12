export interface SectionData {
    headers: string[];
    dataRows: Array<Record<string, string>>;
}

export interface ReportSummary {
    sectionCount: number;
    sectionNames: string[];
    totalDataRows: number;
    currentFileName?: string;
}

// Portfolio Types
export interface Position {
    symbol: string;
    description: string;
    assetCategory: string;
    currency: string;
    quantity: number;
    marketPrice: number;
    marketValue: number;
    unrealizedPnL: number;
    realizedPnL: number;
    transactions: Transaction[];
    dividends: Dividend[];
    performance: PerformanceData;
}

export interface Asset {
    key: string
    symbol: string
    category: string
}

export interface Transaction {
    asset: Asset;
    currency: string;
    dateTime: string;
    quantity: number;
    price: number;
    proceeds: number;
    fees: number;
    subTotal: number;
    realizedPnL: number;
    code: string;
}

export interface Dividend {
    symbol: string;
    description: string;
    payDate: string;
    exDate: string;
    amount: number;
    currency: string;
    tax: number;
    netAmount: number;
    dividendType: string;
}

export interface PerformanceData {
    realizedPnL: number;
    unrealizedPnL: number;
    totalPnL: number;
    totalReturn: number;
    totalReturnPercent: number;
    costBasis: number;
    totalDividends: number;
}

export interface Portfolio {
    accountId: string;
    reportDate: string;
    baseCurrency: string;
    totalMarketValue: number;
    totalUnrealizedPnL: number;
    totalRealizedPnL: number;
    totalDividends: number;
    positions: Position[];
    currencyTotals: Record<string, number>;
}

export interface PortfolioSummary {
    totalPositions: number;
    totalMarketValue: number;
    totalUnrealizedPnL: number;
    totalRealizedPnL: number;
    totalDividends: number;
    accountId: string;
    reportDate: string;
    baseCurrency: string;
}
