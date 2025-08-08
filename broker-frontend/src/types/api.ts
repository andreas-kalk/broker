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