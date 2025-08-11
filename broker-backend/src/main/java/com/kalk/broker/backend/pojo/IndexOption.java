package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Locale;

import com.kalk.broker.backend.utils.ReportUtils;

public class IndexOption implements Asset {

    private final String key;

    private final String symbol;

    private final String type; // e.g. "call", "put"

    private final LocalDate expirationDate; // Format: YYYY-MM-DD

    private final BigDecimal strikePrice; // Format: 123.45

    private String category;

    public IndexOption(String key, String category) {
        this.key = key;
        String[] keyParts = key.split(" ");
        this.symbol = keyParts[0];

        String dateString = keyParts[1].substring(0, 2) + keyParts[1].charAt(2) + keyParts[1].substring(3).toLowerCase(Locale.ROOT);
        this.expirationDate = ReportUtils.parseLocalDateTime(dateString).toLocalDate();
        this.strikePrice = new BigDecimal(keyParts[2]);
        this.type = keyParts[3];
        this.category = category;
    }

    @Override
    public String getKey() {
        return key;
    }

    @Override
    public String getSymbol() {
        return symbol;
    }

    public String getType() {
        return type;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public BigDecimal getStrikePrice() {
        return strikePrice;
    }

    @Override
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "IndexOption{" +
                "key='" + key + '\'' +
                ", symbol='" + symbol + '\'' +
                ", type='" + type + '\'' +
                ", expirationDate=" + expirationDate +
                ", strikePrice=" + strikePrice +
                ", category='" + category + '\'' +
                '}';
    }
}
