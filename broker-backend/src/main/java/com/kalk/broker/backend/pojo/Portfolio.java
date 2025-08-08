package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Repräsentiert das gesamte Portfolio mit allen Positionen
 */
public class Portfolio {
    private String accountId;
    private LocalDateTime reportDate;
    private String baseCurrency;
    private BigDecimal totalMarketValue;
    private BigDecimal totalUnrealizedPnL;
    private BigDecimal totalRealizedPnL;
    private BigDecimal totalDividends;
    private List<Position> positions = new ArrayList<>();
    private Map<String, BigDecimal> currencyTotals = new HashMap<>();

    public Portfolio() {}

    public Portfolio(String accountId) {
        this.accountId = accountId;
    }

    // Getters and Setters
    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public LocalDateTime getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDateTime reportDate) {
        this.reportDate = reportDate;
    }

    public String getBaseCurrency() {
        return baseCurrency;
    }

    public void setBaseCurrency(String baseCurrency) {
        this.baseCurrency = baseCurrency;
    }

    public BigDecimal getTotalMarketValue() {
        return totalMarketValue;
    }

    public void setTotalMarketValue(BigDecimal totalMarketValue) {
        this.totalMarketValue = totalMarketValue;
    }

    public BigDecimal getTotalUnrealizedPnL() {
        return totalUnrealizedPnL;
    }

    public void setTotalUnrealizedPnL(BigDecimal totalUnrealizedPnL) {
        this.totalUnrealizedPnL = totalUnrealizedPnL;
    }

    public BigDecimal getTotalRealizedPnL() {
        return totalRealizedPnL;
    }

    public void setTotalRealizedPnL(BigDecimal totalRealizedPnL) {
        this.totalRealizedPnL = totalRealizedPnL;
    }

    public BigDecimal getTotalDividends() {
        return totalDividends;
    }

    public void setTotalDividends(BigDecimal totalDividends) {
        this.totalDividends = totalDividends;
    }

    public List<Position> getPositions() {
        return positions;
    }

    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    public void addPosition(Position position) {
        this.positions.add(position);
    }

    public Map<String, BigDecimal> getCurrencyTotals() {
        return currencyTotals;
    }

    public void setCurrencyTotals(Map<String, BigDecimal> currencyTotals) {
        this.currencyTotals = currencyTotals;
    }

    public void addCurrencyTotal(String currency, BigDecimal amount) {
        this.currencyTotals.put(currency, amount);
    }

    @Override
    public String toString() {
        return "Portfolio{" +
                "accountId='" + accountId + '\'' +
                ", totalMarketValue=" + totalMarketValue +
                ", positionsCount=" + positions.size() +
                '}';
    }
}
