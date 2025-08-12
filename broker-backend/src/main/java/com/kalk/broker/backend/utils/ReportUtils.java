package com.kalk.broker.backend.utils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
import java.time.temporal.TemporalAccessor;
import java.util.Currency;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.kalk.broker.backend.config.ReportField;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;

/**
 * Utility class for handling report-related operations.
 * Provides methods to extract specific date from reports e.g. base currency, report date.
 * It also parses date strings and handle BigDecimal values from report data.
 */
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

    /**
     * Retrieves the base currency from the report.
     * If not found, defaults to the system's default currency code.
     *
     * @param report the report from which to extract the base currency
     * @return the base currency code
     */
    public static String getBaseCurrency(Report report) {
        SectionData section = report.getSection("kontoinformation");
        return section.getDataRows()
                .stream()
                .filter(e -> e.get("Feldname").equalsIgnoreCase("Basiswährung"))
                .findFirst()
                .map(e -> e.getOrDefault("Feldwert", "EUR"))
                .orElse(Currency.getInstance(Locale.getDefault()).getCurrencyCode());
    }

    /**
     * Retrieves the report date from the report.
     * If not found, defaults to the current date and time.
     *
     * @param report the report from which to extract the report date
     * @return the report date as LocalDateTime
     */
    public static LocalDateTime getReportDate(Report report) {
        SectionData statement = report.getSection("statement");
        return statement.getDataRows()
                .stream()
                .filter(e -> e.get("Feldname").equalsIgnoreCase("WhenGenerated"))
                .findFirst()
                .map(e -> parseLocalDateTime(e.getOrDefault("Feldwert", LocalDateTime.now().toString())))
                .orElse(LocalDateTime.now());
    }

    /**
     * Parses a date string into a LocalDateTime object.
     * If parsing fails, returns the current date and time.
     *
     * @param dateString the date string to parse
     * @return the parsed LocalDateTime or current date and time if parsing fails
     */
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
        if(Objects.isNull(dateString) || dateString.isEmpty()) {
            return Optional.empty();
        }

        for (DateTimeFormatter formatter : DATE_TIME_FORMATTERS) {
            try {
                return Optional.of(formatter.parse(dateString.replace(",", "")));
            } catch (DateTimeParseException e) {
                // Nächsten Formatter probieren
            }
        }
        return Optional.empty();
    }

    /**
     * Parses a string into a BigDecimal.
     * Handles both comma and dot as decimal separators and removes thousands separators.
     *
     * @param value the string to parse
     * @return the parsed BigDecimal or null if parsing fails
     */
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

    public static Optional<String> getRowValue(Map<String, String> row, ReportField field) {
        for (String key : field.getKeys()) {
            String value = row.get(key);
            if (value != null && !value.trim().isEmpty()) {
                return Optional.of(value.trim());
            }
        }
        return Optional.empty();
    }
}
