package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SymbolTransactions {

    private Asset asset;

    private String currency;

    private BigDecimal sumProceeds;
    private BigDecimal sumFees;
    private BigDecimal sumRealizedPnL;

    private List<Transaction> transactions = new ArrayList<>();

    public SymbolTransactions() {
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getSumProceeds() {
        return sumProceeds;
    }

    public void setSumProceeds(BigDecimal sumProceeds) {
        this.sumProceeds = sumProceeds;
    }

    public BigDecimal getSumFees() {
        return sumFees;
    }

    public void setSumFees(BigDecimal sumFees) {
        this.sumFees = sumFees;
    }

    public BigDecimal getSumRealizedPnL() {
        return sumRealizedPnL;
    }

    public void setSumRealizedPnL(BigDecimal sumRealizedPnL) {
        this.sumRealizedPnL = sumRealizedPnL;
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

    @Override
    public String toString() {
        return "SymbolTransactions{" +
                "asset='" + asset + '\'' +
                ", currency='" + currency + '\'' +
                ", sumProceeds=" + sumProceeds +
                ", sumFees=" + sumFees +
                ", sumRealizedPnL=" + sumRealizedPnL +
                ", transactions=" + transactions +
                '}';
    }
}
