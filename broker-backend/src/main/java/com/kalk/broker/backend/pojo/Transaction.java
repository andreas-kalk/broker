package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Repräsentiert eine Transaktion (Kauf/Verkauf) für ein Wertpapier
 */
public class Transaction {

    private Asset asset;

    private String currency;
    private LocalDateTime dateTime;
    private BigDecimal quantity;
    private BigDecimal price; // T-.Kurs
    private BigDecimal proceeds; // Erlös/Kosten
    private BigDecimal fees;
    private BigDecimal subTotal; // Zwischensumme (proceeds - fees)
    private BigDecimal realizedPnL; // Realisierter Gewinn/Verlust
    private String code;

    private transient String dataType;

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getAction() {
        return quantity.compareTo(BigDecimal.ZERO) < 0 ? "SELL" : "BUY";
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

    public BigDecimal getFees() {
        return fees;
    }

    public void setFees(BigDecimal fees) {
        this.fees = fees;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public BigDecimal getRealizedPnL() {
        return realizedPnL;
    }

    public void setRealizedPnL(BigDecimal realizedPnL) {
        this.realizedPnL = realizedPnL;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "asset='" + asset + '\'' +
                ", action='" + getAction() + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", dateTime=" + dateTime +
                '}';
    }
}
