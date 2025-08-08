package com.kalk.broker.backend.csv;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.kalk.broker.backend.pojo.Report;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.io.input.BOMInputStream;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileImporter {

    private final Set<Parser> parser = new HashSet<>();
    private Report uploadedReport; // Store uploaded file report

    public FileImporter(Collection<Parser> parser) {
        if (parser != null) {
            this.parser.addAll(parser);
        }
    }

    /**
     * Parse uploaded CSV file
     */
    public Report parseUploadedFile(MultipartFile file) throws IOException {
        CSVFormat format = CSVFormat.DEFAULT.builder()
                .setSkipHeaderRecord(false)
                .build();

        try (InputStream stream = file.getInputStream();
                BOMInputStream bomInputStream = BOMInputStream.builder().setInputStream(stream).get();
                Reader reader = new InputStreamReader(bomInputStream, StandardCharsets.UTF_8)) {

            List<CSVRecord> records = format.parse(reader).stream().toList();
            Map<String, List<CSVRecord>> mapOfRecords = records.stream()
                    .collect(Collectors.groupingBy(r -> r.get(0)));

            Report report = new Report();
            parser.forEach(p -> p.parse(mapOfRecords, report));

            // Store the uploaded report
            this.uploadedReport = report;

            return report;
        }
    }

    /**
     * Check if there's an uploaded file
     */
    public boolean hasUploadedFile() {
        return uploadedReport != null;
    }

    /**
     * Get the uploaded report
     */
    public Report getUploadedReport() {
        return uploadedReport;
    }

    /**
     * Clear uploaded file
     */
    public void clearUploadedFile() {
        this.uploadedReport = null;
    }
}
