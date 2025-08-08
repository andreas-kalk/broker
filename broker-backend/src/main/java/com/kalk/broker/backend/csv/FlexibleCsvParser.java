package com.kalk.broker.backend.csv;

import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import org.apache.commons.csv.CSVRecord;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Flexibler CSV-Parser der automatisch CSV-Strukturen erkennt und parst
 * Funktioniert sprachunabhängig und erweitert sich automatisch bei neuen Strukturen
 */
public class FlexibleCsvParser extends AbstractCsvParser {

    @Override
    public void parse(Map<String, List<CSVRecord>> records, Report report) {
        for (Map.Entry<String, List<CSVRecord>> entry : records.entrySet()) {
            List<CSVRecord> csvRecords = entry.getValue();

            parseRecords(csvRecords, report);
        }
    }

    private void parseRecords(List<CSVRecord> records, Report report) {
        Map<String, SectionData> currentSections = new HashMap<>();
        String currentSectionName = null;
        List<String> currentHeaders = new ArrayList<>();

        for (CSVRecord csvRecord : records) {
            if (csvRecord.size() == 0) continue;

            String sectionName = extractSectionName(csvRecord);
            String recordType = csvRecord.size() > 1 ? csvRecord.get(1) : "";

            // Neue Sektion erkannt
            if (!sectionName.isEmpty() && !sectionName.equals(currentSectionName)) {
                currentSectionName = sectionName;
                String normalizedName = normalizeSectionName(sectionName);

                if (!currentSections.containsKey(normalizedName)) {
                    SectionData section = new SectionData(sectionName);
                    currentSections.put(normalizedName, section);
                    report.addSection(normalizedName, section);
                }
                
                // Reset headers when entering new section
                currentHeaders.clear();
            }

            if (currentSectionName == null) continue;

            String normalizedName = normalizeSectionName(currentSectionName);
            SectionData currentSection = currentSections.get(normalizedName);

            if (isHeaderRecord(csvRecord)) {
                // Header-Record verarbeiten - kann mehrere geben pro Sektion
                List<String> newHeaders = extractHeaders(csvRecord);
                if (!newHeaders.isEmpty()) {
                    currentHeaders = newHeaders;
                    // Nur setzen wenn noch keine Headers vorhanden oder diese länger sind
                    if (currentSection.getHeaders().isEmpty() || newHeaders.size() > currentSection.getHeaders().size()) {
                        currentSection.setHeaders(currentHeaders);
                    }
                }

            } else if (isDataRecord(csvRecord) || "Total".equals(recordType) || "SubTotal".equals(recordType)) {
                // Daten-Record verarbeiten
                if (!currentHeaders.isEmpty()) {
                    Map<String, String> rowData = createCorrectRowMap(csvRecord, currentHeaders);

                    // Zusätzliche Metadaten aus dem Record-Typ extrahieren
                    rowData.put("_record_type", recordType);
                    rowData.put("_section", currentSectionName);

                    currentSection.addDataRow(rowData);
                }
            }
        }

        // Spezielle Behandlung für Statement-Daten
        processStatementData(report);
    }

    private List<String> extractHeaders(CSVRecord csvRecord) {
        List<String> headers = new ArrayList<>();

        // Überspringe die ersten beiden Spalten (Sektionsname und "Header")
        for (int i = 2; i < csvRecord.size(); i++) {
            String header = csvRecord.get(i);
            if (header != null && !header.trim().isEmpty()) {
                headers.add(header.trim());
            }
        }

        return headers;
    }

    /**
     * Korrekte Zuordnung der CSV-Spalten zu den Headers
     */
    private Map<String, String> createCorrectRowMap(CSVRecord csvRecord, List<String> headers) {
        Map<String, String> row = new HashMap<>();
        
        // Beginne bei Index 2, da die ersten zwei Spalten Sektionsname und Typ sind
        int headerIndex = 0;
        for (int i = 2; i < csvRecord.size() && headerIndex < headers.size(); i++, headerIndex++) {
            String header = headers.get(headerIndex);
            String value = csvRecord.get(i);
            row.put(header, value != null ? value.trim() : "");
        }
        
        return row;
    }

    private void processStatementData(Report report) {
        // Verarbeite Statement-spezifische Daten falls vorhanden
        SectionData statementSection = report.getSection("statement");
        if (statementSection != null && !statementSection.getDataRows().isEmpty()) {
            // Hier könnte spezifische Statement-Verarbeitung stattfinden
            // Derzeit bleibt die bestehende Statement-Struktur erhalten
        }
    }
}
