package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Repräsentiert eine Position im Portfolio mit allen zugehörigen Daten
 */
public class Position {

    private String symbol;
    private String assetCategory;
    private String currency;
    private BigDecimal quantity;
    private BigDecimal openingPrice;
    private BigDecimal costBasis;
    private BigDecimal value;
    private BigDecimal closingPrice;
    private BigDecimal winLoss;
    private String code;

    // Zugehörige Transaktionen
    private List<Transaction> transactions = new ArrayList<>();

    // Zugehörige Dividenden
    private List<Dividend> dividends = new ArrayList<>();

    // Performance-Daten
    private PerformanceData performance;

    public Position() {
    }

    public Position(String symbol) {
        this.symbol = symbol;
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getAssetCategory() {
        return assetCategory;
    }

    public void setAssetCategory(String assetCategory) {
        this.assetCategory = assetCategory;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public void addTransaction(Transaction transaction) {
        this.transactions.add(transaction);
    }

    public List<Dividend> getDividends() {
        return dividends;
    }

    public void setDividends(List<Dividend> dividends) {
        this.dividends = dividends;
    }

    public void addDividend(Dividend dividend) {
        this.dividends.add(dividend);
    }

    public PerformanceData getPerformance() {
        return performance;
    }

    public void setPerformance(PerformanceData performance) {
        this.performance = performance;
    }

    public BigDecimal getCostPrice() {
        return openingPrice;
    }

    public void setOpeningPrice(BigDecimal openPrice) {
        this.openingPrice = openPrice;
    }

    public BigDecimal getCostBasis() {
        return costBasis;
    }

    public void setCostBasis(BigDecimal costBasis) {
        this.costBasis = costBasis;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public BigDecimal getClosingPrice() {
        return closingPrice;
    }

    public void setClosingPrice(BigDecimal closingPrice) {
        this.closingPrice = closingPrice;
    }

    public BigDecimal getWinLoss() {
        return winLoss;
    }

    public void setWinLoss(BigDecimal winLoss) {
        this.winLoss = winLoss;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "Position{" +
                "symbol='" + symbol + '\'' +
                ", assetCategory='" + assetCategory + '\'' +
                ", currency='" + currency + '\'' +
                ", quantity=" + quantity +
                ", openingPrice=" + openingPrice +
                ", costBasis=" + costBasis +
                ", value=" + value +
                ", closingPrice=" + closingPrice +
                ", transactions=" + transactions +
                ", dividends=" + dividends +
                ", performance=" + performance +
                ", unrealized win/loss=" + winLoss +
                '}';
    }
}
