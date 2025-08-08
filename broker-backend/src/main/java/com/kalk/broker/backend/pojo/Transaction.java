package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Repräsentiert eine Transaktion (Kauf/Verkauf) für ein Wertpapier
 */
public class Transaction {
    private String symbol;
    private String description;
    private LocalDateTime dateTime;
    private String action; // BOT (Kauf), SLD (Verkauf), etc.
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal proceeds; // Erlös/Kosten
    private BigDecimal commission;
    private String currency;
    private String exchange;
    private String orderId;
    private String transactionId;

    public Transaction() {}

    public Transaction(String symbol, String action, BigDecimal quantity, BigDecimal price) {
        this.symbol = symbol;
        this.action = action;
        this.quantity = quantity;
        this.price = price;
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

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getProceeds() {
        return proceeds;
    }

    public void setProceeds(BigDecimal proceeds) {
        this.proceeds = proceeds;
    }

    public BigDecimal getCommission() {
        return commission;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "symbol='" + symbol + '\'' +
                ", action='" + action + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", dateTime=" + dateTime +
                '}';
    }
}
