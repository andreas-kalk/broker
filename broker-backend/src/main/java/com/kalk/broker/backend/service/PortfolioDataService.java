package com.kalk.broker.backend.service;

import static com.kalk.broker.backend.config.ReportField.ASSET_CATEGORY;
import static com.kalk.broker.backend.config.ReportField.CURRENCY;
import static com.kalk.broker.backend.config.ReportField.SYMBOL;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.kalk.broker.backend.pojo.Dividend;
import com.kalk.broker.backend.pojo.PerformanceData;
import com.kalk.broker.backend.pojo.Portfolio;
import com.kalk.broker.backend.pojo.Position;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import com.kalk.broker.backend.pojo.SymbolTransactions;
import com.kalk.broker.backend.utils.ReportUtils;
import org.springframework.stereotype.Service;

/**
 * Service für die Verarbeitung von Portfolio-Daten
 * Kombiniert offene Positionen, Transaktionen, Performance-Daten und Dividenden
 */
@Service
public class PortfolioDataService {

    private final TransactionDataService transcationDataService;

    public PortfolioDataService(TransactionDataService transcationDataService) {
        this.transcationDataService = transcationDataService;
    }

    private static final DateTimeFormatter[] DATE_FORMATTERS = {
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd.MM.yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
    };

    /**
     * Erstellt ein Portfolio aus den Report-Daten
     */
    public Portfolio createPortfolio(Report report) {
        Portfolio portfolio = new Portfolio();

        // Basis-Informationen setzen
        portfolio.setReportDate(ReportUtils.getReportDate(report));
        portfolio.setBaseCurrency(ReportUtils.getBaseCurrency(report));

        // Offene Positionen verarbeiten
        Map<String, Position> positionsMap = processOpenPositions(report);

        // Transaktionen hinzufügen
        List<SymbolTransactions> transactionsList = transcationDataService.processTransactions(report);
        processTransactions(positionsMap, transactionsList);

        // Performance-Daten hinzufügen
        addPerformanceData(report, positionsMap);

        // Dividenden hinzufügen
        addDividends(report, positionsMap);

        // Portfolio-Totale berechnen
        calculatePortfolioTotals(portfolio, positionsMap);

        portfolio.setPositions(new ArrayList<>(positionsMap.values()));

        return portfolio;
    }

    /**
     * Verarbeitet die Sektion "offene_positionen"
     */
    private Map<String, Position> processOpenPositions(Report report) {
        Map<String, Position> positions = new HashMap<>();

        // Verschiedene mögliche Sektionsnamen für offene Positionen
        String[] sectionNames = { "offene_positionen", "open_positions", "positions" };

        for (String sectionName : sectionNames) {
            SectionData section = report.getSection(sectionName);
            if (section != null) {
                processPositionsSection(section, positions);
                break;
            }
        }

        return positions;
    }

    private void processPositionsSection(SectionData section, Map<String, Position> positions) {
        section.getDataRows().stream()
                .filter(e -> e.getOrDefault("_record_type", "").equalsIgnoreCase("Data"))
                .forEach(row -> {
                    Position position = createPositionFromRow(row);
                    if (position.getSymbol() != null) {
                        positions.put(position.getSymbol(), position);
                    }
                });
    }

    private Position createPositionFromRow(Map<String, String> row) {
        Position position = new Position();

        // Flexible Zuordnung der Spalten basierend auf verfügbaren Keys
        position.setSymbol(ReportUtils.getRowValue(row, SYMBOL));
        position.setAssetCategory(ReportUtils.getRowValue(row, ASSET_CATEGORY));
        position.setCurrency(ReportUtils.getRowValue(row, CURRENCY));

        // Numerische Werte parsen
        position.setQuantity(ReportUtils.parseBigDecimal(getValueByKeys(row, "Menge", "Quantity", "Qty", "quantity")));
        position.setCostPrice(ReportUtils.parseBigDecimal(getValueByKeys(row, "Einstands Kurs", "Market Price", "Price", "market_price")));
        position.setCostBasis(ReportUtils.parseBigDecimal(getValueByKeys(row, "Kostenbasis", "Market Price", "Price", "market_price")));
        position.setClosingPrice(ReportUtils.parseBigDecimal(getValueByKeys(row, "Schlusskurs", "Market Value", "Value", "market_value")));
        position.setValue(ReportUtils.parseBigDecimal(getValueByKeys(row, "Wert", "Market Value", "Value", "market_value")));
        position.setWinLoss(ReportUtils.parseBigDecimal(getValueByKeys(row, "Unrealisierter G/V", "Unrealized P&L", "UnrealizedPnL", "unrealized_pnl")));

        return position;
    }

    private void processTransactions(Map<String, Position> positions, List<SymbolTransactions> transactions) {
        transactions.forEach(t -> {
                    if (positions.containsKey(t.getAsset().getKey())) {
                        positions.get(t.getAsset().getKey()).setTransactions(t.getTransactions());
                    }
                }
        );
    }

    /**
     * Fügt Performance-Daten aus der Übersicht hinzu
     */
    private void addPerformanceData(Report report, Map<String, Position> positions) {
        String[] sectionNames = {
                "bersicht_zur_realisierten_und_unrealisierten_performance",
                "performance_overview",
                "realized_unrealized_performance"
        };

        for (String sectionName : sectionNames) {
            SectionData section = report.getSection(sectionName);
            if (section != null) {
                processPerformanceSection(section, positions);
                break;
            }
        }
    }

    private void processPerformanceSection(SectionData section, Map<String, Position> positions) {
        for (Map<String, String> row : section.getDataRows()) {
            String symbol = getValueByKeys(row, "Symbol", "Ticker", "ISIN", "symbol");
            if (symbol != null) {
                Position position = positions.get(symbol);
                if (position != null) {
                    PerformanceData performance = createPerformanceFromRow(row);
                    position.setPerformance(performance);
                }
            }
        }
    }

    private PerformanceData createPerformanceFromRow(Map<String, String> row) {
        PerformanceData performance = new PerformanceData();

        performance.setRealizedPnL(ReportUtils.parseBigDecimal(getValueByKeys(row, "Realisiert", "Realized P&L", "RealizedPnL", "realized_pnl")));
        performance.setUnrealizedPnL(ReportUtils.parseBigDecimal(getValueByKeys(row, "Unrealisiert", "Unrealized P&L", "UnrealizedPnL", "unrealized_pnl")));
        performance.setCostBasis(ReportUtils.parseBigDecimal(getValueByKeys(row, "Kostenbasis", "Cost Basis", "CostBasis", "cost_basis")));
        performance.setTotalReturn(ReportUtils.parseBigDecimal(getValueByKeys(row, "Gesamtrendite", "Total Return", "TotalReturn", "total_return")));
        performance.setTotalReturnPercent(ReportUtils.parseBigDecimal(getValueByKeys(row, "Rendite %", "Return %", "ReturnPercent", "return_percent")));

        // Berechne Gesamtgewinn/-verlust
        if (performance.getRealizedPnL() != null && performance.getUnrealizedPnL() != null) {
            performance.setTotalPnL(performance.getRealizedPnL().add(performance.getUnrealizedPnL()));
        }

        return performance;
    }

    /**
     * Fügt Dividenden zu den entsprechenden Positionen hinzu
     */
    private void addDividends(Report report, Map<String, Position> positions) {
        String[] sectionNames = { "dividenden", "dividends", "dividend_payments" };

        for (String sectionName : sectionNames) {
            SectionData section = report.getSection(sectionName);
            if (section != null) {
                processDividendsSection(section, positions);
                break;
            }
        }
    }

    private void processDividendsSection(SectionData section, Map<String, Position> positions) {
        for (Map<String, String> row : section.getDataRows()) {
            Dividend dividend = createDividendFromRow(row);
            if (dividend != null && dividend.getSymbol() != null) {
                Position position = positions.get(dividend.getSymbol());
                if (position != null) {
                    position.addDividend(dividend);
                }
            }
        }
    }

    private Dividend createDividendFromRow(Map<String, String> row) {
        Dividend dividend = new Dividend();

        dividend.setSymbol(getValueByKeys(row, "Symbol", "Ticker", "ISIN", "symbol"));
        dividend.setDescription(getValueByKeys(row, "Beschreibung", "Description", "Name", "description"));
        dividend.setCurrency(getValueByKeys(row, "Währung", "Currency", "Ccy", "currency"));
        dividend.setDividendType(getValueByKeys(row, "Typ", "Type", "DividendType", "dividend_type"));

        // Datum parsen
        String payDateStr = getValueByKeys(row, "Zahldatum", "Pay Date", "PayDate", "pay_date");
        dividend.setPayDate(parseDate(payDateStr));

        String exDateStr = getValueByKeys(row, "Ex-Datum", "Ex Date", "ExDate", "ex_date");
        dividend.setExDate(parseDate(exDateStr));

        // Beträge
        dividend.setAmount(ReportUtils.parseBigDecimal(getValueByKeys(row, "Betrag", "Amount", "Gross Amount", "amount")));
        dividend.setTax(ReportUtils.parseBigDecimal(getValueByKeys(row, "Steuer", "Tax", "Withholding Tax", "tax")));
        dividend.setNetAmount(ReportUtils.parseBigDecimal(getValueByKeys(row, "Nettobetrag", "Net Amount", "NetAmount", "net_amount")));

        return dividend;
    }

    /**
     * Berechnet Portfolio-Gesamtwerte
     */
    private void calculatePortfolioTotals(Portfolio portfolio, Map<String, Position> positions) {
        BigDecimal totalMarketValue = BigDecimal.ZERO;
        BigDecimal totalUnrealizedPnL = BigDecimal.ZERO;
        BigDecimal totalRealizedPnL = BigDecimal.ZERO;
        BigDecimal totalDividends = BigDecimal.ZERO;

        // TODO
        for (Position position : positions.values()) {
            if (position.getCostPrice() != null) {
                totalMarketValue = totalMarketValue.add(position.getCostPrice());
            }
            if (position.getClosingPrice() != null) {
                totalUnrealizedPnL = totalUnrealizedPnL.add(position.getClosingPrice());
            }
            if (position.getWinLoss() != null) {
                totalRealizedPnL = totalRealizedPnL.add(position.getWinLoss());
            }

            // Dividenden summieren
            BigDecimal positionDividends = position.getDividends().stream()
                    .filter(d -> d.getNetAmount() != null)
                    .map(Dividend::getNetAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            totalDividends = totalDividends.add(positionDividends);
        }

        portfolio.setTotalMarketValue(totalMarketValue);
        portfolio.setTotalUnrealizedPnL(totalUnrealizedPnL);
        portfolio.setTotalRealizedPnL(totalRealizedPnL);
        portfolio.setTotalDividends(totalDividends);
    }

    // Hilfsmethoden
    private String getValueByKeys(Map<String, String> row, String... keys) {
        for (String key : keys) {
            String value = row.get(key);
            if (value != null && !value.trim().isEmpty()) {
                return value.trim();
            }
        }
        return null;
    }

    private LocalDateTime parseDateTime(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                if (formatter.toString().contains("HH:mm:ss")) {
                    return LocalDateTime.parse(dateStr, formatter);
                } else {
                    return LocalDate.parse(dateStr, formatter).atStartOfDay();
                }
            } catch (DateTimeParseException ignored) {
                // Versuche nächsten Formatter
            }
        }
        return null;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                return LocalDate.parse(dateStr, formatter);
            } catch (DateTimeParseException ignored) {
                // Versuche nächsten Formatter
            }
        }
        return null;
    }
}
