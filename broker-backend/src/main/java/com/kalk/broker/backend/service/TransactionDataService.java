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
}
