package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Repräsentiert eine Dividendenzahlung
 */
public class Dividend {
    private String symbol;
    private String description;
    private LocalDate payDate;
    private LocalDate exDate;
    private BigDecimal amount;
    private String currency;
    private BigDecimal tax;
    private BigDecimal netAmount;
    private String dividendType; // Cash, Stock, etc.

    public Dividend() {}

    public Dividend(String symbol, LocalDate payDate, BigDecimal amount) {
        this.symbol = symbol;
        this.payDate = payDate;
        this.amount = amount;
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

    public LocalDate getPayDate() {
        return payDate;
    }

    public void setPayDate(LocalDate payDate) {
        this.payDate = payDate;
    }

    public LocalDate getExDate() {
        return exDate;
    }

    public void setExDate(LocalDate exDate) {
        this.exDate = exDate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public String getDividendType() {
        return dividendType;
    }

    public void setDividendType(String dividendType) {
        this.dividendType = dividendType;
    }

    @Override
    public String toString() {
        return "Dividend{" +
                "symbol='" + symbol + '\'' +
                ", payDate=" + payDate +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                '}';
    }
}
