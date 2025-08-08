package com.kalk.broker.backend.pojo;

import java.util.HashMap;
import java.util.Map;

public class Report {

    private Statement statement;
    private Map<String, SectionData> sections = new HashMap<>();

    public Statement getStatement() {
        return statement;
    }

    public void setStatement(Statement statement) {
        this.statement = statement;
    }

    public Map<String, SectionData> getSections() {
        return sections;
    }

    public void setSections(Map<String, SectionData> sections) {
        this.sections = sections;
    }

    public void addSection(String key, SectionData section) {
        this.sections.put(key, section);
    }

    public SectionData getSection(String key) {
        return this.sections.get(key);
    }

    public boolean hasSection(String key) {
        return this.sections.containsKey(key);
    }
}
