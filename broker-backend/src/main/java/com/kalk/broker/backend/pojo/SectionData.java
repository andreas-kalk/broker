package com.kalk.broker.backend.pojo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Generische Datenstruktur für CSV-Abschnitte
 * Kann Header und Datenzeilen unabhängig von der Sprache speichern
 */
public class SectionData {
    private String sectionName;
    private List<String> headers = new ArrayList<>();
    private List<Map<String, String>> dataRows = new ArrayList<>();
    private Map<String, String> metadata = new HashMap<>();

    public SectionData() {}

    public SectionData(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public List<String> getHeaders() {
        return headers;
    }

    public void setHeaders(List<String> headers) {
        this.headers = headers;
    }

    public void addHeader(String header) {
        this.headers.add(header);
    }

    public List<Map<String, String>> getDataRows() {
        return dataRows;
    }

    public void setDataRows(List<Map<String, String>> dataRows) {
        this.dataRows = dataRows;
    }

    public void addDataRow(Map<String, String> row) {
        this.dataRows.add(row);
    }

    public Map<String, String> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, String> metadata) {
        this.metadata = metadata;
    }

    public void addMetadata(String key, String value) {
        this.metadata.put(key, value);
    }

    @Override
    public String toString() {
        return "SectionData{" +
                "sectionName='" + sectionName + '\'' +
                ", headers=" + headers +
                ", dataRows=" + dataRows.size() + " rows" +
                ", metadata=" + metadata +
                '}';
    }
}
