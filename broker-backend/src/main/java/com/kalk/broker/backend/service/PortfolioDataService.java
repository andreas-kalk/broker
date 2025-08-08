package com.kalk.broker.backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.kalk.broker.backend.pojo.Dividend;
import com.kalk.broker.backend.pojo.PerformanceData;
import com.kalk.broker.backend.pojo.Portfolio;
import com.kalk.broker.backend.pojo.Position;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import com.kalk.broker.backend.pojo.Transaction;
import org.springframework.stereotype.Service;

/**
 * Service für die Verarbeitung von Portfolio-Daten
 * Kombiniert offene Positionen, Transaktionen, Performance-Daten und Dividenden
 */
@Service
public class PortfolioDataService {

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
        portfolio.setReportDate(LocalDateTime.now());
        portfolio.setBaseCurrency("EUR"); // Default, kann später aus Report extrahiert werden

        // Offene Positionen verarbeiten
        Map<String, Position> positionsMap = processOpenPositions(report);

        // Transaktionen hinzufügen
        addTransactionsToPositions(report, positionsMap);

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
        String[] sectionNames = {"offene_positionen", "open_positions", "positions"};

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
        for (Map<String, String> row : section.getDataRows()) {
            Position position = createPositionFromRow(row);
            if (position != null && position.getSymbol() != null) {
                positions.put(position.getSymbol(), position);
            }
        }
    }

    private Position createPositionFromRow(Map<String, String> row) {
        Position position = new Position();

        // Flexible Zuordnung der Spalten basierend auf verfügbaren Keys
        position.setSymbol(getValueByKeys(row, "Symbol", "Ticker", "ISIN", "symbol"));
        position.setDescription(getValueByKeys(row, "Beschreibung", "Description", "Name", "description"));
        position.setAssetCategory(getValueByKeys(row, "Kategorie", "AssetCategory", "Category", "asset_category"));
        position.setCurrency(getValueByKeys(row, "Währung", "Currency", "Ccy", "currency"));

        // Numerische Werte parsen
        position.setQuantity(parseBigDecimal(getValueByKeys(row, "Menge", "Quantity", "Qty", "quantity")));
        position.setMarketPrice(parseBigDecimal(getValueByKeys(row, "Marktpreis", "Market Price", "Price", "market_price")));
        position.setMarketValue(parseBigDecimal(getValueByKeys(row, "Marktwert", "Market Value", "Value", "market_value")));
        position.setUnrealizedPnL(parseBigDecimal(getValueByKeys(row, "Unrealisiert", "Unrealized P&L", "UnrealizedPnL", "unrealized_pnl")));

        return position;
    }

    /**
     * Fügt Transaktionen zu den entsprechenden Positionen hinzu
     */
    private void addTransactionsToPositions(Report report, Map<String, Position> positions) {
        String[] sectionNames = {"transaktionen", "transactions", "trades"};

        for (String sectionName : sectionNames) {
            SectionData section = report.getSection(sectionName);
            if (section != null) {
                processTransactionsSection(section, positions);
                break;
            }
        }
    }

    private void processTransactionsSection(SectionData section, Map<String, Position> positions) {
        for (Map<String, String> row : section.getDataRows()) {
            Transaction transaction = createTransactionFromRow(row);
            if (transaction != null && transaction.getSymbol() != null) {
                Position position = positions.get(transaction.getSymbol());
                if (position != null) {
                    position.addTransaction(transaction);
                }
            }
        }
    }

    private Transaction createTransactionFromRow(Map<String, String> row) {
        Transaction transaction = new Transaction();

        transaction.setSymbol(getValueByKeys(row, "Symbol", "Ticker", "ISIN", "symbol"));
        transaction.setDescription(getValueByKeys(row, "Beschreibung", "Description", "Name", "description"));
        transaction.setAction(getValueByKeys(row, "Aktion", "Action", "Side", "action"));
        transaction.setCurrency(getValueByKeys(row, "Währung", "Currency", "Ccy", "currency"));
        transaction.setExchange(getValueByKeys(row, "Börse", "Exchange", "Exch", "exchange"));

        // Datum parsen
        String dateStr = getValueByKeys(row, "Datum", "Date", "DateTime", "date");
        transaction.setDateTime(parseDateTime(dateStr));

        // Numerische Werte
        transaction.setQuantity(parseBigDecimal(getValueByKeys(row, "Menge", "Quantity", "Qty", "quantity")));
        transaction.setPrice(parseBigDecimal(getValueByKeys(row, "Preis", "Price", "price")));
        transaction.setProceeds(parseBigDecimal(getValueByKeys(row, "Erlös", "Proceeds", "Amount", "proceeds")));
        transaction.setCommission(parseBigDecimal(getValueByKeys(row, "Kommission", "Commission", "Fee", "commission")));

        return transaction;
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

        performance.setRealizedPnL(parseBigDecimal(getValueByKeys(row, "Realisiert", "Realized P&L", "RealizedPnL", "realized_pnl")));
        performance.setUnrealizedPnL(parseBigDecimal(getValueByKeys(row, "Unrealisiert", "Unrealized P&L", "UnrealizedPnL", "unrealized_pnl")));
        performance.setCostBasis(parseBigDecimal(getValueByKeys(row, "Kostenbasis", "Cost Basis", "CostBasis", "cost_basis")));
        performance.setTotalReturn(parseBigDecimal(getValueByKeys(row, "Gesamtrendite", "Total Return", "TotalReturn", "total_return")));
        performance.setTotalReturnPercent(parseBigDecimal(getValueByKeys(row, "Rendite %", "Return %", "ReturnPercent", "return_percent")));

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
        String[] sectionNames = {"dividenden", "dividends", "dividend_payments"};

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
        dividend.setAmount(parseBigDecimal(getValueByKeys(row, "Betrag", "Amount", "Gross Amount", "amount")));
        dividend.setTax(parseBigDecimal(getValueByKeys(row, "Steuer", "Tax", "Withholding Tax", "tax")));
        dividend.setNetAmount(parseBigDecimal(getValueByKeys(row, "Nettobetrag", "Net Amount", "NetAmount", "net_amount")));

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

        for (Position position : positions.values()) {
            if (position.getMarketValue() != null) {
                totalMarketValue = totalMarketValue.add(position.getMarketValue());
            }
            if (position.getUnrealizedPnL() != null) {
                totalUnrealizedPnL = totalUnrealizedPnL.add(position.getUnrealizedPnL());
            }
            if (position.getRealizedPnL() != null) {
                totalRealizedPnL = totalRealizedPnL.add(position.getRealizedPnL());
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

    private BigDecimal parseBigDecimal(String value) {
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
