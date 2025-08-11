package com.kalk.broker.backend.utils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import com.kalk.broker.backend.config.ReportField;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;

public class ReportUtils {

    private static final List<DateTimeFormatter> DATE_TIME_FORMATTERS = List.of(
            DateTimeFormatter.ofPattern("ddMMMyy", Locale.ENGLISH),
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd.MM.yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss v")
    );

    private ReportUtils() {
    }

    public static String getBaseCurrency(Report report) {
        SectionData kontoInformationen = report.getSection("kontoinformation");
        return kontoInformationen.getDataRows()
                .stream()
                .filter(e -> e.get("Feldname").equalsIgnoreCase("Basiswährung"))
                .findFirst()
                .map(e -> e.getOrDefault("Feldwert", "EUR"))
                .orElse("not found");
    }

    public static LocalDateTime getReportDate(Report report) {
        SectionData statement = report.getSection("statement");
        return statement.getDataRows()
                .stream()
                .filter(e -> e.get("Feldname").equalsIgnoreCase("WhenGenerated"))
                .findFirst()
                .map(e -> parseLocalDateTime(e.getOrDefault("Feldwert", LocalDateTime.now().toString())))
                .orElse(LocalDateTime.now());
    }

    public static LocalDateTime parseLocalDateTime(String dateString) {
        return parseTemporal(dateString)
                .map(ReportUtils::createLocalDateTime)
                .orElse(LocalDateTime.now());
    }

    private static LocalDateTime createLocalDateTime(TemporalAccessor temporalAccessor) {
        LocalTime time = LocalTime.MIDNIGHT;
        if (temporalAccessor.isSupported(ChronoField.HOUR_OF_DAY)) {
            time = LocalTime.from(temporalAccessor);
        }
        LocalDate date = LocalDate.from(temporalAccessor);
        return LocalDateTime.of(date, time);
    }

    private static Optional<TemporalAccessor> parseTemporal(String dateString) {
        for (DateTimeFormatter formatter : DATE_TIME_FORMATTERS) {
            try {
                return Optional.of(formatter.parse(dateString.replace(",", "")));
            } catch (DateTimeParseException e) {
                // Nächsten Formatter probieren
            }
        }
        return Optional.empty();
    }

    public static BigDecimal parseBigDecimal(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            // Entferne Tausendertrennzeichen und ersetze Komma durch Punkt
            String cleanValue = value.replaceAll("[,.](?=.*[,.])", "")
                    .replace(',', '.');
            return new BigDecimal(cleanValue);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String getRowValue(Map<String, String> row, ReportField field) {
        for (String key : field.getKeys()) {
            String value = row.get(key);
            if (value != null && !value.trim().isEmpty()) {
                return value.trim();
            }
        }
        return null;
    }
}
