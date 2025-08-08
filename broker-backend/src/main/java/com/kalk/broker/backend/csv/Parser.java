package com.kalk.broker.backend.csv;

import java.util.List;
import java.util.Map;

import com.kalk.broker.backend.pojo.Report;
import org.apache.commons.csv.CSVRecord;

public interface Parser {

    void parse(Map<String, List<CSVRecord>> records, Report report);
}
