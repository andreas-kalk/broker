package com.kalk.broker.backend.service;

import com.kalk.broker.backend.config.AppConstants;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import com.kalk.broker.backend.pojo.TaxRelevantData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class TaxRelevantDataService {

    private static final Logger logger = LoggerFactory.getLogger(TaxRelevantDataService.class);

    // Transaction code mappings for better descriptions
    private static final Map<String, String> TRANSACTION_CODES = new HashMap<>();

    static {
        TRANSACTION_CODES.put("A", "Auftrag (Assignment)");
        TRANSACTION_CODES.put("O", "Eröffnung (Opening)");
        TRANSACTION_CODES.put("C", "Schließung (Closing)");
        TRANSACTION_CODES.put("IA", "Interne Abrechnung (Internal Assignment)");
        TRANSACTION_CODES.put("IM", "Interne Bewegung (Internal Movement)");
        TRANSACTION_CODES.put("P", "Teilweise (Partial)");
        TRANSACTION_CODES.put("E", "Ausübung (Exercise)");
        TRANSACTION_CODES.put("Ex", "Verfallen (Expired)");
        TRANSACTION_CODES.put("L", "Liquidation");
        TRANSACTION_CODES.put("T", "Transfer");
        TRANSACTION_CODES.put("D", "Dividende");
        TRANSACTION_CODES.put("F", "Gebühr (Fee)");
        TRANSACTION_CODES.put("W", "Auszahlung (Withdrawal)");
        TRANSACTION_CODES.put("DEP", "Einzahlung (Deposit)");
        TRANSACTION_CODES.put("INT", "Zinsen (Interest)");
        TRANSACTION_CODES.put("DIV", "Dividende");
        TRANSACTION_CODES.put("TAX", "Steuer (Tax)");
        TRANSACTION_CODES.put("FEE", "Gebühr (Fee)");
        TRANSACTION_CODES.put("ADJ", "Anpassung (Adjustment)");
        TRANSACTION_CODES.put("CORP", "Corporate Action");
    }

    // Date formatters for different date patterns
    private static final List<DateTimeFormatter> DATE_FORMATTERS = List.of(
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd.MM.yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy/MM/dd")
    );

    // Trade types that represent sales
    private static final Set<String> SALE_TRANSACTION_CODES = Set.of("C", "L", "T");

    public TaxRelevantData extractTaxRelevantData(Report report, int taxYear) {
        logger.info("Extracting tax relevant data for year: {}", taxYear);

        TaxRelevantData taxData = new TaxRelevantData();

        try {
            // Extract capital gains from trades
            List<TaxRelevantData.CapitalGain> capitalGains = extractCapitalGains(report, taxYear);
            taxData.setCapitalGains(capitalGains);

            // Extract dividends
            List<TaxRelevantData.Dividend> dividends = extractDividends(report, taxYear);
            taxData.setDividends(dividends);

            // Extract foreign taxes
            List<TaxRelevantData.ForeignTax> foreignTaxes = extractForeignTaxes(report, taxYear);
            taxData.setForeignTaxes(foreignTaxes);

            // Calculate summary
            TaxRelevantData.TaxSummary summary = calculateTaxSummary(capitalGains, dividends, foreignTaxes);
            taxData.setSummary(summary);

            logger.info("Successfully extracted tax data: {} capital gains, {} dividends, {} foreign taxes",
                    capitalGains.size(), dividends.size(), foreignTaxes.size());

        } catch (Exception e) {
            logger.error("Error extracting tax relevant data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to extract tax data", e);
        }

        return taxData;
    }

    private List<TaxRelevantData.CapitalGain> extractCapitalGains(Report report, int taxYear) {
        List<TaxRelevantData.CapitalGain> capitalGains = new ArrayList<>();

        // Process trades section
        SectionData tradesSection = findTradesSection(report);
        if (tradesSection != null) {
            capitalGains.addAll(processTradesForCapitalGains(tradesSection, taxYear));
        }

        return capitalGains;
    }

    private List<TaxRelevantData.Dividend> extractDividends(Report report, int taxYear) {
        List<TaxRelevantData.Dividend> dividends = new ArrayList<>();

        // Process dividends section
        SectionData dividendsSection = findDividendsSection(report);
        if (dividendsSection != null) {
            dividends.addAll(processDividendsSection(dividendsSection, taxYear));
        }

        return dividends;
    }

    private List<TaxRelevantData.ForeignTax> extractForeignTaxes(Report report, int taxYear) {
        List<TaxRelevantData.ForeignTax> foreignTaxes = new ArrayList<>();

        // Process withholding tax from various sections
        foreignTaxes.addAll(extractWithholdingTaxFromDividends(report, taxYear));
        foreignTaxes.addAll(extractWithholdingTaxFromTrades(report, taxYear));

        return foreignTaxes;
    }

    /**
     * Finds the section in the report that contains trade data.
     */
    private SectionData findTradesSection(Report report) {
        return Stream.of("Trades", "transaktionen", "transactions", "trades")
                .map(report::getSection)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    /**
     * Finds the section in the report that contains dividend data.
     */
    private SectionData findDividendsSection(Report report) {
        return Stream.of("Dividenden", "dividenden", "Dividends")
                .map(report::getSection)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
    }

    /**
     * Processes the trades section to extract capital gains.
     */
    private List<TaxRelevantData.CapitalGain> processTradesForCapitalGains(SectionData tradesSection, int taxYear) {
        List<TaxRelevantData.CapitalGain> capitalGains = new ArrayList<>();

        // Group trades by symbol
        Map<String, List<Map<String, String>>> tradesBySymbol = groupTradesBySymbol(tradesSection);

        // Process each group of trades
        for (Map.Entry<String, List<Map<String, String>>> entry : tradesBySymbol.entrySet()) {
            String symbol = entry.getKey();
            List<Map<String, String>> symbolTrades = entry.getValue();

            // Match buy and sell transactions to calculate capital gains
            List<TaxRelevantData.CapitalGain> symbolCapitalGains = matchBuyAndSellTransactions(symbol, symbolTrades);
            capitalGains.addAll(symbolCapitalGains);
        }

        return capitalGains;
    }

    /**
     * Groups trades in the section by their symbol.
     */
    private Map<String, List<Map<String, String>>> groupTradesBySymbol(SectionData tradesSection) {
        return tradesSection.getDataRows().stream()
                .filter(row -> "Order".equals(row.get("DataDiscriminator")))
                .collect(Collectors.groupingBy(row -> row.getOrDefault("Symbol", "Unknown")));
    }

    /**
     * Matches buy and sell transactions for a given symbol to calculate capital gains.
     */
    private List<TaxRelevantData.CapitalGain> matchBuyAndSellTransactions(String symbol, List<Map<String, String>> transactions) {
        List<TaxRelevantData.CapitalGain> gains = new ArrayList<>();

        // Sort transactions by date
        transactions.sort(Comparator.comparing(t -> parseDate(t.get("Datum/Zeit"))));

        // FIFO (First In, First Out) Matching
        Queue<Map<String, String>> buyTransactions = new LinkedList<>();

        for (Map<String, String> transaction : transactions) {
            BigDecimal quantity = parseBigDecimal(transaction.get("Menge"));
            if (quantity == null)
                continue;

            if (quantity.compareTo(BigDecimal.ZERO) > 0) {
                // Buy transaction
                buyTransactions.offer(transaction);
            } else {
                // Sell transaction
                BigDecimal sellQuantity = quantity.abs();
                BigDecimal remainingSellQuantity = sellQuantity;

                while (remainingSellQuantity.compareTo(BigDecimal.ZERO) > 0 && !buyTransactions.isEmpty()) {
                    Map<String, String> buyTransaction = buyTransactions.peek();
                    BigDecimal buyQuantity = parseBigDecimal(buyTransaction.get("Menge"));

                    if (buyQuantity.compareTo(remainingSellQuantity) <= 0) {
                        // Full match
                        TaxRelevantData.CapitalGain gain = createCapitalGain(buyTransaction, transaction, buyQuantity);
                        if (gain != null) {
                            gains.add(gain);
                        }
                        remainingSellQuantity = remainingSellQuantity.subtract(buyQuantity);
                        buyTransactions.poll();
                    } else {
                        // Partial match
                        TaxRelevantData.CapitalGain gain = createCapitalGain(buyTransaction, transaction, remainingSellQuantity);
                        if (gain != null) {
                            gains.add(gain);
                        }
                        // Reduce buy quantity
                        buyTransaction.put("Menge", buyQuantity.subtract(remainingSellQuantity).toString());
                        remainingSellQuantity = BigDecimal.ZERO;
                    }
                }
            }
        }

        return gains;
    }

    /**
     * Creates a capital gain object from matched buy and sell transactions.
     */
    private TaxRelevantData.CapitalGain createCapitalGain(Map<String, String> buyTransaction, Map<String, String> sellTransaction, BigDecimal matchedQuantity) {
        TaxRelevantData.CapitalGain gain = new TaxRelevantData.CapitalGain();

        // Basic information
        gain.setSymbol(buyTransaction.get("Symbol"));
        gain.setDescription(buyTransaction.get("Description"));
        gain.setAssetCategory(translateAssetCategory(buyTransaction.get("Vermögenswertkategorie")));
        gain.setQuantity(matchedQuantity);
        gain.setCurrency(buyTransaction.get("Währung"));

        // Dates
        gain.setPurchaseDate(parseDate(buyTransaction.get("Datum/Zeit")));
        gain.setSaleDate(parseDate(sellTransaction.get("Datum/Zeit")));

        // Prices
        BigDecimal buyPrice = parseBigDecimal(buyTransaction.get("T.-Kurs"));
        BigDecimal sellPrice = parseBigDecimal(sellTransaction.get("T.-Kurs"));
        gain.setPurchasePrice(buyPrice);
        gain.setSalePrice(sellPrice);

        // Commissions
        BigDecimal buyCommission = parseBigDecimal(buyTransaction.get("Prov./Gebühr"));
        BigDecimal sellCommission = parseBigDecimal(sellTransaction.get("Prov./Gebühr"));
        if (buyCommission != null && sellCommission != null) {
            gain.setCommission(buyCommission.abs().add(sellCommission.abs()));
        }

        // Calculate gain/loss
        if (buyPrice != null && sellPrice != null) {
            BigDecimal grossGain = sellPrice.subtract(buyPrice).multiply(matchedQuantity);
            BigDecimal netGain = grossGain;
            if (gain.getCommission() != null) {
                netGain = grossGain.subtract(gain.getCommission());
            }
            gain.setRealizedGain(netGain);
        }

        // Short-term or long-term (< 1 year = short-term)
        if (gain.getPurchaseDate() != null && gain.getSaleDate() != null) {
            boolean isShortTerm = gain.getSaleDate().isBefore(gain.getPurchaseDate().plusYears(1));
            gain.setShortTerm(isShortTerm);
        }

        // Transaction description with codes
        String buyCode = buyTransaction.get("Code");
        String sellCode = sellTransaction.get("Code");
        String description = "Kauf: " + translateTransactionCode(buyCode) +
                ", Verkauf: " + translateTransactionCode(sellCode);
        gain.setTransactionDescription(description);

        return gain;
    }

    /**
     * Processes the dividends section to extract dividend data.
     */
    private List<TaxRelevantData.Dividend> processDividendsSection(SectionData dividendsSection, int taxYear) {
        List<TaxRelevantData.Dividend> dividends = new ArrayList<>();

        for (Map<String, String> row : dividendsSection.getDataRows()) {

            LocalDate date = parseDate(row.get("Datum"));
            if (date == null || date.getYear() != taxYear) {
                continue; // Only process dividends for the specified tax year
            }

            TaxRelevantData.Dividend dividend = new TaxRelevantData.Dividend();

            String[] symbol = row.get("Beschreibung").split(" ");

            dividend.setSymbol(symbol[0]);
            if (symbol.length > 1) {
                dividend.setDescription(Arrays.stream(symbol).skip(1).collect(Collectors.joining(" ")));
            }

            dividend.setPaymentDate(date);
            dividend.setGrossAmount(parseBigDecimal(row.get("Betrag")));
            dividend.setCurrency(row.get("Währung"));

            // Steuerinformationen
            BigDecimal tax = parseBigDecimal(row.get("Tax"));
            if (tax != null) {
                dividend.setWithholdingTax(tax.abs());
                if (dividend.getGrossAmount() != null) {
                    dividend.setNetAmount(dividend.getGrossAmount().subtract(tax.abs()));
                }
            }

            // Transaktionsbeschreibung
            String code = row.get("Code");
            dividend.setTransactionDescription(translateTransactionCode(code));

            dividends.add(dividend);
        }

        return dividends;
    }

    /**
     * Extracts foreign taxes from the report for the specified tax year.
     */
    private List<TaxRelevantData.ForeignTax> extractWithholdingTaxFromDividends(Report report, int taxYear) {
        List<TaxRelevantData.ForeignTax> foreignTaxes = new ArrayList<>();

        SectionData section = report.getSection("quellensteuer");

        if (section != null) {
            for (Map<String, String> row : section.getDataRows()) {

                LocalDate date = parseDate(row.get("Datum"));
                if (date == null || date.getYear() != taxYear) {
                    continue; // Only process withholding tax for the specified tax year
                }

                TaxRelevantData.ForeignTax foreignTax = new TaxRelevantData.ForeignTax();

                foreignTax.setReference(row.get("Beschreibung"));

                foreignTax.setDate(date);
                foreignTax.setAmount(parseBigDecimal(row.get("Betrag")));
                foreignTax.setCurrency(row.get("Währung"));

                foreignTaxes.add(foreignTax);
            }
        }

        return foreignTaxes;
    }

    /**
     * Extracts foreign taxes from trades in the report for the specified tax year.
     */
    private List<TaxRelevantData.ForeignTax> extractWithholdingTaxFromTrades(Report report, int taxYear) {
        List<TaxRelevantData.ForeignTax> foreignTaxes = new ArrayList<>();

        // Process trades section
        SectionData tradesSection = findTradesSection(report);
        if (tradesSection != null) {
            for (Map<String, String> row : tradesSection.getDataRows()) {

                LocalDate date = parseDate(row.get("Datum/Zeit"));
                if (date == null || date.getYear() != taxYear) {
                    continue; // Only process trades for the specified tax year
                }

                // Check if the transaction is a sale
                String transactionCode = row.get("Code");
                if (transactionCode != null && SALE_TRANSACTION_CODES.contains(transactionCode)) {
                    TaxRelevantData.ForeignTax foreignTax = new TaxRelevantData.ForeignTax();

                    foreignTax.setReference(row.get("Beschreibung"));

                    foreignTax.setDate(date);
                    foreignTax.setAmount(parseBigDecimal(row.get("Prov./Gebühr")));
                    foreignTax.setCurrency(row.get("Währung"));

                    foreignTaxes.add(foreignTax);
                }
            }
        }

        return foreignTaxes;
    }

    /**
     * Berechnet die Steuer-Zusammenfassung
     */
    private TaxRelevantData.TaxSummary calculateTaxSummary(
            List<TaxRelevantData.CapitalGain> capitalGains,
            List<TaxRelevantData.Dividend> dividends,
            List<TaxRelevantData.ForeignTax> foreignTaxes) {

        TaxRelevantData.TaxSummary summary = new TaxRelevantData.TaxSummary();

        // Kapitalerträge zusammenfassen
        BigDecimal totalGains = BigDecimal.ZERO;
        BigDecimal totalLosses = BigDecimal.ZERO;
        BigDecimal totalCommissions = BigDecimal.ZERO;

        for (TaxRelevantData.CapitalGain gain : capitalGains) {
            if (gain.getRealizedGain() != null) {
                if (gain.getRealizedGain().compareTo(BigDecimal.ZERO) > 0) {
                    totalGains = totalGains.add(gain.getRealizedGain());
                } else {
                    totalLosses = totalLosses.add(gain.getRealizedGain().abs());
                }
            }
            if (gain.getCommission() != null) {
                totalCommissions = totalCommissions.add(gain.getCommission());
            }
        }

        summary.setTotalCapitalGains(totalGains);
        summary.setTotalCapitalLosses(totalLosses);
        summary.setNetCapitalGains(totalGains.subtract(totalLosses));
        summary.setTotalCommissions(totalCommissions);

        // Dividenden zusammenfassen
        BigDecimal totalDividends = dividends.stream()
                .map(TaxRelevantData.Dividend::getGrossAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalDividends(totalDividends);

        BigDecimal totalWithholdingTax = dividends.stream()
                .map(TaxRelevantData.Dividend::getWithholdingTax)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalWithholdingTax(totalWithholdingTax);

        // Ausländische Steuern
        BigDecimal totalForeignTax = foreignTaxes.stream()
                .map(TaxRelevantData.ForeignTax::getAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalForeignTax(totalForeignTax);

        summary.setNumberOfTransactions(capitalGains.size() + dividends.size());

        return summary;
    }

    private String translateTransactionCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return "Unbekannt";
        }

        // Handle compound codes separated by semicolons
        String[] codeParts = code.split(";");
        List<String> translatedParts = Arrays.stream(codeParts)
                .map(String::trim)
                .map(part -> TRANSACTION_CODES.getOrDefault(part, part))
                .collect(Collectors.toList());

        return String.join(" + ", translatedParts);
    }

    private String translateAssetCategory(String category) {
        return AppConstants.AssetCategories.ASSET_CATEGORIES.getOrDefault(category, category);
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }

        // Verschiedene Datumsformate probieren
        for (DateTimeFormatter formatter : DATE_FORMATTERS) {
            try {
                // Entferne Zeit-Teil falls vorhanden
                String datePart = dateStr.split(", ")[0];
                return LocalDate.parse(datePart, formatter);
            } catch (DateTimeParseException e) {
                // Nächsten Formatter probieren
            }
        }

        return null;
    }

    private BigDecimal parseBigDecimal(String value) {
        if (value == null || value.trim().isEmpty() || "-".equals(value.trim())) {
            return null;
        }

        try {
            // Entferne Währungssymbole und andere Zeichen
            String cleanValue = value.replaceAll("[^\\d.,-]", "");

            // Handle deutsche Zahlenformate (1.234,56)
            if (cleanValue.contains(",") && cleanValue.contains(".")) {
                if (cleanValue.lastIndexOf(",") > cleanValue.lastIndexOf(".")) {
                    cleanValue = cleanValue.replace(".", "").replace(",", ".");
                } else {
                    cleanValue = cleanValue.replace(",", "");
                }
            } else if (cleanValue.contains(",")) {
                if (cleanValue.matches(".*,\\d{1,2}$")) {
                    cleanValue = cleanValue.replace(",", ".");
                } else {
                    cleanValue = cleanValue.replace(",", "");
                }
            }

            return new BigDecimal(cleanValue);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String mapCurrencyToCountry(String currency) {
        if (currency == null)
            return "Unknown";

        Map<String, String> currencyToCountry = Map.of(
                "EUR", "Deutschland",
                "USD", "USA",
                "GBP", "Vereinigtes Königreich",
                "CHF", "Schweiz",
                "JPY", "Japan",
                "CAD", "Kanada"
        );

        return currencyToCountry.getOrDefault(currency, "Unknown");
    }
}
