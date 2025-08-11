package com.kalk.broker.backend.service;

import static com.kalk.broker.backend.config.CsvField.ASSET_CATEGORY;
import static com.kalk.broker.backend.config.CsvField.CODE;
import static com.kalk.broker.backend.config.CsvField.CURRENCY;
import static com.kalk.broker.backend.config.CsvField.DATETIME;
import static com.kalk.broker.backend.config.CsvField.DATE_TYPE;
import static com.kalk.broker.backend.config.CsvField.FEES;
import static com.kalk.broker.backend.config.CsvField.PRICE;
import static com.kalk.broker.backend.config.CsvField.PROCEEDS;
import static com.kalk.broker.backend.config.CsvField.QUANTITY;
import static com.kalk.broker.backend.config.CsvField.REALIZED_PNL;
import static com.kalk.broker.backend.config.CsvField.SUBTOTAL;
import static com.kalk.broker.backend.config.CsvField.SYMBOL;
import static com.kalk.broker.backend.config.CsvField.TRANSACTIONS;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.kalk.broker.backend.pojo.Asset;
import com.kalk.broker.backend.pojo.IndexOption;
import com.kalk.broker.backend.pojo.Report;
import com.kalk.broker.backend.pojo.SectionData;
import com.kalk.broker.backend.pojo.Share;
import com.kalk.broker.backend.pojo.SymbolTransactions;
import com.kalk.broker.backend.pojo.Transaction;
import com.kalk.broker.backend.utils.ReportUtils;
import org.springframework.stereotype.Service;

@Service
public class TransactionDataService {

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
                    if (ReportUtils.getRowValue(row, SYMBOL) != null) {
                        Transaction transaction = createTransactionFromRow(row);
                        transactionsBySymbol.computeIfAbsent(transaction.getAsset().getKey(), k -> new ArrayList<>()).add(transaction);
                    }
                });

        List<SymbolTransactions> result = new ArrayList<>();
        for (Map.Entry<String, List<Transaction>> entry : transactionsBySymbol.entrySet()) {

            SymbolTransactions symbolTransactions = new SymbolTransactions();

            entry.getValue().forEach(transaction -> {
                if (transaction.getDataType().equalsIgnoreCase("subtotal")) {
                    symbolTransactions.setCurrency(transaction.getCurrency());
                    symbolTransactions.setAsset(transaction.getAsset());
                    symbolTransactions.setSumProceeds(transaction.getProceeds());
                    symbolTransactions.setSumFees(transaction.getFees());
                    symbolTransactions.setSumRealizedPnL(transaction.getRealizedPnL());
                }
                if (transaction.getDataType().equalsIgnoreCase("data")) {
                    symbolTransactions.addTransaction(transaction);
                }
            });
            result.add(symbolTransactions);
        }

        return result;
    }

    private Transaction createTransactionFromRow(Map<String, String> row) {
        Transaction transaction = new Transaction();

        String assetCategory = ReportUtils.getRowValue(row, ASSET_CATEGORY);
        String symbol = ReportUtils.getRowValue(row, SYMBOL);
        Asset asset = null;
        if (symbol != null && assetCategory != null) {
            if (assetCategory.toLowerCase(Locale.ROOT).contains("indexoptionen")) {
                asset = new IndexOption(symbol, assetCategory);
            } else {
                asset = new Share(symbol, assetCategory);
            }
        }

        transaction.setAsset(asset);
        transaction.setCurrency(ReportUtils.getRowValue(row, CURRENCY));

        // Datum parsen
        String dateStr = ReportUtils.getRowValue(row, DATETIME);
        if (dateStr != null) {
            transaction.setDateTime(ReportUtils.parseLocalDateTime(dateStr));
        }

        // Numerische Werte
        transaction.setQuantity(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, QUANTITY)));
        transaction.setPrice(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, PRICE)));
        transaction.setProceeds(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, PROCEEDS)));
        transaction.setFees(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, FEES)));

        transaction.setSubTotal(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, SUBTOTAL)));
        transaction.setRealizedPnL(ReportUtils.parseBigDecimal(ReportUtils.getRowValue(row, REALIZED_PNL)));
        transaction.setCode(ReportUtils.getRowValue(row, CODE));

        transaction.setDataType(ReportUtils.getRowValue(row, DATE_TYPE));

        return transaction;
    }
}
