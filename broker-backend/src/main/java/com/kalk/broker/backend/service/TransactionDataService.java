package com.kalk.broker.backend.service;

import static com.kalk.broker.backend.config.ReportConstants.ASSET_OPTION;
import static com.kalk.broker.backend.config.ReportConstants.DATA_TYPE_DATA;
import static com.kalk.broker.backend.config.ReportConstants.DATA_TYPE_SUBTOTAL;
import static com.kalk.broker.backend.config.ReportField.ASSET_CATEGORY;
import static com.kalk.broker.backend.config.ReportField.CODE;
import static com.kalk.broker.backend.config.ReportField.CURRENCY;
import static com.kalk.broker.backend.config.ReportField.DATETIME;
import static com.kalk.broker.backend.config.ReportField.DATE_TYPE;
import static com.kalk.broker.backend.config.ReportField.FEES;
import static com.kalk.broker.backend.config.ReportField.PRICE;
import static com.kalk.broker.backend.config.ReportField.PROCEEDS;
import static com.kalk.broker.backend.config.ReportField.QUANTITY;
import static com.kalk.broker.backend.config.ReportField.REALIZED_PNL;
import static com.kalk.broker.backend.config.ReportField.SUBTOTAL;
import static com.kalk.broker.backend.config.ReportField.SYMBOL;
import static com.kalk.broker.backend.config.ReportField.TRANSACTIONS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import com.kalk.broker.backend.pojo.Asset;
import com.kalk.broker.backend.pojo.IndexOption;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import com.kalk.broker.backend.pojo.Share;
import com.kalk.broker.backend.pojo.SymbolTransactions;
import com.kalk.broker.backend.pojo.Transaction;
import com.kalk.broker.backend.utils.ReportUtils;
import org.springframework.stereotype.Service;

/**
 * Service for processing transaction data from a report.
 * It processes the transactions section of the report and returns a list of
 * {@link SymbolTransactions}, which contains the asset information and a list of {@link Transaction transactions}
 * for that asset, along with calculated totals such as proceeds, fees, and realized PnL.
 */
@Service
public class TransactionDataService {

    /**
     * Processes the transactions section of the given report.
     *
     * @param report the report containing transaction data
     * @return a list of {@link SymbolTransactions} containing processed transactions
     */
    public List<SymbolTransactions> processTransactions(Report report) {
        for (String sectionName : TRANSACTIONS.getKeys()) {
            SectionData section = report.getSection(sectionName);
            if (section != null) {
                return processTransactionsSection(section);
            }
        }

        return List.of();
    }

    private List<SymbolTransactions> processTransactionsSection(SectionData section) {
        Map<String, List<Transaction>> transactionsBySymbol = new HashMap<>();

        section.getDataRows()
                .forEach(row -> {
                    if (Objects.nonNull(ReportUtils.getRowValue(row, SYMBOL))) {
                        Transaction transaction = createTransactionFromRow(row);
                        if (Objects.nonNull(transaction.getAsset())) {
                            transactionsBySymbol.computeIfAbsent(transaction.getAsset().getKey(), k -> new ArrayList<>()).add(transaction);
                        }
                    }
                });

        List<SymbolTransactions> result = new ArrayList<>();
        for (Map.Entry<String, List<Transaction>> entry : transactionsBySymbol.entrySet()) {

            SymbolTransactions symbolTransactions = new SymbolTransactions();

            entry.getValue().forEach(transaction -> {
                if (transaction.getDataType().equalsIgnoreCase(DATA_TYPE_SUBTOTAL.getKey())) {
                    symbolTransactions.setCurrency(transaction.getCurrency());
                    symbolTransactions.setAsset(transaction.getAsset());
                    symbolTransactions.setSumProceeds(transaction.getProceeds());
                    symbolTransactions.setSumFees(transaction.getFees());
                    symbolTransactions.setSumRealizedPnL(transaction.getRealizedPnL());
                }
                if (transaction.getDataType().equalsIgnoreCase(DATA_TYPE_DATA.getKey())) {
                    symbolTransactions.addTransaction(transaction);
                }
            });
            result.add(symbolTransactions);
        }

        return result;
    }

    private Transaction createTransactionFromRow(Map<String, String> row) {
        Transaction transaction = new Transaction();

        Optional<String> assetCategory = ReportUtils.getRowValue(row, ASSET_CATEGORY);
        Optional<String> symbol = ReportUtils.getRowValue(row, SYMBOL);
        Asset asset = null;
        if (symbol.isPresent() && assetCategory.isPresent()) {
            if (assetCategory.get().toLowerCase(Locale.ROOT).contains(ASSET_OPTION.getKey())) {
                asset = new IndexOption(symbol.get(), assetCategory.get());
            } else {
                asset = new Share(symbol.get(), assetCategory.get());
            }
        }

        transaction.setAsset(asset);
        ReportUtils.getRowValue(row, CURRENCY).ifPresent(transaction::setCurrency);

        Optional<String> dateStr = ReportUtils.getRowValue(row, DATETIME);
        dateStr.ifPresent(s -> transaction.setDateTime(ReportUtils.parseLocalDateTime(s)));

        ReportUtils.getRowValue(row, QUANTITY).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setQuantity);
        ReportUtils.getRowValue(row, PRICE).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setPrice);
        ReportUtils.getRowValue(row, PROCEEDS).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setProceeds);
        ReportUtils.getRowValue(row, FEES).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setFees);

        ReportUtils.getRowValue(row, SUBTOTAL).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setSubTotal);
        ReportUtils.getRowValue(row, REALIZED_PNL).map(ReportUtils::parseBigDecimal).ifPresent(transaction::setRealizedPnL);
        ReportUtils.getRowValue(row, CODE).ifPresent(transaction::setCode);
        ReportUtils.getRowValue(row, DATE_TYPE).ifPresent(transaction::setDataType);

        return transaction;
    }

    /**
     * Extrahiert alle Transaktionen für ein bestimmtes Steuerjahr
     *
     * @param report das Report-Objekt
     * @param taxYear das Steuerjahr
     * @return Liste aller Transaktionen
     */
    public List<Transaction> extractTransactions(Report report, int taxYear) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);
        return symbolTransactions.stream()
            .flatMap(st -> st.getTransactions().stream())
            .filter(transaction -> transaction.getDateTime() != null &&
                    transaction.getDateTime().getYear() == taxYear)
            .sorted((t1, t2) -> t1.getDateTime().compareTo(t2.getDateTime()))
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Extrahiert alle Transaktionen ohne Jahresfilter
     *
     * @param report das Report-Objekt
     * @return Liste aller Transaktionen
     */
    public List<Transaction> extractAllTransactions(Report report) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);
        return symbolTransactions.stream()
            .flatMap(st -> st.getTransactions().stream())
            .sorted((t1, t2) -> {
                if (t1.getDateTime() == null && t2.getDateTime() == null) return 0;
                if (t1.getDateTime() == null) return 1;
                if (t2.getDateTime() == null) return -1;
                return t1.getDateTime().compareTo(t2.getDateTime());
            })
            .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Gruppiert Transaktionen nach Asset-Key
     *
     * @param report das Report-Objekt
     * @return Map mit Asset-Key als Schlüssel und SymbolTransactions als Wert
     */
    public Map<String, SymbolTransactions> getTransactionsByAssetKey(Report report) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);
        Map<String, SymbolTransactions> result = new HashMap<>();

        for (SymbolTransactions st : symbolTransactions) {
            if (st.getAsset() != null) {
                result.put(st.getAsset().getKey(), st);
            }
        }

        return result;
    }

    /**
     * Gruppiert Transaktionen nach Symbol
     *
     * @param report das Report-Objekt
     * @return Map mit Symbol als Schlüssel und SymbolTransactions als Wert
     */
    public Map<String, SymbolTransactions> getTransactionsBySymbol(Report report) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);
        Map<String, SymbolTransactions> result = new HashMap<>();

        for (SymbolTransactions st : symbolTransactions) {
            if (st.getAsset() != null) {
                result.put(st.getAsset().getSymbol(), st);
            }
        }

        return result;
    }

    /**
     * Gibt eine spezifische Transaktion basierend auf einer ID zurück
     *
     * @param report das Report-Objekt
     * @param transactionId die Transaktions-ID (Symbol + DateTime)
     * @return die Transaktion oder null wenn nicht gefunden
     */
    public Transaction getTransactionById(Report report, String transactionId) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);
        return symbolTransactions.stream()
            .flatMap(st -> st.getTransactions().stream())
            .filter(transaction -> generateTransactionId(transaction).equals(transactionId))
            .findFirst()
            .orElse(null);
    }

    /**
     * Erstellt eine Zusammenfassung der Transaktionsdaten
     *
     * @param report das Report-Objekt
     * @return TransactionSummary mit aggregierten Daten
     */
    public TransactionSummary getTransactionSummary(Report report) {
        List<SymbolTransactions> symbolTransactions = processTransactions(report);

        TransactionSummary summary = new TransactionSummary();
        summary.setTotalSymbols(symbolTransactions.size());

        double totalProceeds = symbolTransactions.stream()
            .mapToDouble(st -> st.getSumProceeds() != null ? st.getSumProceeds().doubleValue() : 0.0)
            .sum();
        summary.setTotalProceeds(java.math.BigDecimal.valueOf(totalProceeds));

        double totalFees = symbolTransactions.stream()
            .mapToDouble(st -> st.getSumFees() != null ? st.getSumFees().doubleValue() : 0.0)
            .sum();
        summary.setTotalFees(java.math.BigDecimal.valueOf(totalFees));

        double totalRealizedPnL = symbolTransactions.stream()
            .mapToDouble(st -> st.getSumRealizedPnL() != null ? st.getSumRealizedPnL().doubleValue() : 0.0)
            .sum();
        summary.setTotalRealizedPnL(java.math.BigDecimal.valueOf(totalRealizedPnL));

        int totalTransactions = symbolTransactions.stream()
            .mapToInt(st -> st.getTransactions() != null ? st.getTransactions().size() : 0)
            .sum();
        summary.setTotalTransactions(totalTransactions);

        return summary;
    }

    /**
     * Generiert eine eindeutige ID für eine Transaktion
     */
    private String generateTransactionId(Transaction transaction) {
        if (transaction.getAsset() != null && transaction.getDateTime() != null) {
            return transaction.getAsset().getSymbol() + "_" + transaction.getDateTime().toString();
        }
        return "";
    }

    // Inner class for transaction summary
    public static class TransactionSummary {
        private int totalSymbols;
        private int totalTransactions;
        private java.math.BigDecimal totalProceeds;
        private java.math.BigDecimal totalFees;
        private java.math.BigDecimal totalRealizedPnL;

        // Getters and Setters
        public int getTotalSymbols() { return totalSymbols; }
        public void setTotalSymbols(int totalSymbols) { this.totalSymbols = totalSymbols; }

        public int getTotalTransactions() { return totalTransactions; }
        public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }

        public java.math.BigDecimal getTotalProceeds() { return totalProceeds; }
        public void setTotalProceeds(java.math.BigDecimal totalProceeds) { this.totalProceeds = totalProceeds; }

        public java.math.BigDecimal getTotalFees() { return totalFees; }
        public void setTotalFees(java.math.BigDecimal totalFees) { this.totalFees = totalFees; }

        public java.math.BigDecimal getTotalRealizedPnL() { return totalRealizedPnL; }
        public void setTotalRealizedPnL(java.math.BigDecimal totalRealizedPnL) { this.totalRealizedPnL = totalRealizedPnL; }
    }
}
