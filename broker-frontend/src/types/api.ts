export interface SectionData {
  headers: string[];
  dataRows: Array<Record<string, string>>;
}

export interface Report {
  sections: Record<string, SectionData>;
}

export interface ReportSummary {
  sectionCount: number;
  sectionNames: string[];
  totalDataRows: number;
  currentFileName?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  sectionCount?: number;
  sectionNames?: string[];
  fileName?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
