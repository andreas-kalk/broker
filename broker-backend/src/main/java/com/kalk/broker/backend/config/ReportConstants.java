package com.kalk.broker.backend.config;

public enum ReportConstants {

    ASSET_OPTION("indexoption"),
    ASSET_SHARE("aktie"),

    DATA_TYPE_SUBTOTAL("subtotal"),
    DATA_TYPE_DATA("data");

    private final String key;

    ReportConstants(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }
}
