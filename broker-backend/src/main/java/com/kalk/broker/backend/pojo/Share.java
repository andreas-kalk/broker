package com.kalk.broker.backend.pojo;

public class Share implements Asset {

    private final String symbol;

    private String category;

    public Share(String symbol, String category) {
        this.symbol = symbol;
        this.category = category;
    }

    @Override
    public String getKey() {
        return symbol;
    }

    @Override
    public String getSymbol() {
        return symbol;
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
        return "Share{" +
                "symbol='" + symbol + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}
