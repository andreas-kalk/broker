package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Repräsentiert eine Position im Portfolio mit allen zugehörigen Daten
 */
public class Position {
    private String symbol;
    private String description;
    private String assetCategory;
    private String currency;
    private BigDecimal quantity;
    private BigDecimal marketPrice;
    private BigDecimal marketValue;
    private BigDecimal unrealizedPnL;
    private BigDecimal realizedPnL;

    // Zugehörige Transaktionen
    private List<Transaction> transactions = new ArrayList<>();

    // Zugehörige Dividenden
    private List<Dividend> dividends = new ArrayList<>();

    // Performance-Daten
    private PerformanceData performance;

    public Position() {}

    public Position(String symbol, String description) {
        this.symbol = symbol;
        this.description = description;
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public BigDecimal getMarketValue() {
        return marketValue;
    }

    public void setMarketValue(BigDecimal marketValue) {
        this.marketValue = marketValue;
    }

    public BigDecimal getUnrealizedPnL() {
        return unrealizedPnL;
    }

    public void setUnrealizedPnL(BigDecimal unrealizedPnL) {
        this.unrealizedPnL = unrealizedPnL;
    }

    public BigDecimal getRealizedPnL() {
        return realizedPnL;
    }

    public void setRealizedPnL(BigDecimal realizedPnL) {
        this.realizedPnL = realizedPnL;
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

    @Override
    public String toString() {
        return "Position{" +
                "symbol='" + symbol + '\'' +
                ", description='" + description + '\'' +
                ", quantity=" + quantity +
                ", marketValue=" + marketValue +
                ", unrealizedPnL=" + unrealizedPnL +
                '}';
    }
}
