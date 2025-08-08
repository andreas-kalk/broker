package com.kalk.broker.backend.csv;

import org.apache.commons.csv.CSVRecord;

/**
 * Abstrakte Basis-Klasse für CSV-Parser
 * Bietet gemeinsame Funktionalitäten für verschiedene Parser-Implementierungen
 */
public abstract class AbstractCsvParser implements Parser {

    protected static final String HEADER_TYPE = "Header";
    protected static final String DATA_TYPE = "Data";

    /**
     * Normalisiert Abschnittsnamen für sprachunabhängige Verarbeitung
     */
    protected String normalizeSectionName(String sectionName) {
        if (sectionName == null)
            return "";

        // Entferne Sonderzeichen und konvertiere zu lowercase für einheitliche Behandlung
        return sectionName.trim()
                .replaceAll("[^a-zA-Z0-9\\s]", "")
                .replaceAll("\\s+", "_")
                .toLowerCase();
    }

    /**
     * Prüft ob ein Record ein Header-Record ist
     */
    protected boolean isHeaderRecord(CSVRecord csvRecord) {
        return csvRecord.size() > 1 && HEADER_TYPE.equals(csvRecord.get(1));
    }

    /**
     * Prüft ob ein Record ein Daten-Record ist
     */
    protected boolean isDataRecord(CSVRecord csvRecord) {
        if (csvRecord.size() <= 1)
            return false;
        String type = csvRecord.get(1);
        return DATA_TYPE.equals(type);
    }

    /**
     * Extrahiert den Abschnittsnamen aus einem Record
     */
    protected String extractSectionName(CSVRecord csvRecord) {
        return csvRecord.size() > 0 ? csvRecord.get(0) : "";
    }
}
