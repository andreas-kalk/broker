package com.kalk.broker.backend.config;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public enum ReportField {

    TRANSACTIONS("transaktionen", "transactions", "trades"),

    SYMBOL("Symbol"),
    ASSET_CATEGORY("Vermögenswertkategorie"),
    CURRENCY("Währung"),
    QUANTITY("Menge"),
    DATETIME("Datum/Zeit"),
    PRICE("T.-Kurs"),
    OPENING_PRICE("Einstands Kurs"),
    CLOSING_PRICE("Schlusskurs"),
    COST_BASIS("Kostenbasis"),
    VALUE("Wert"),
    PROCEEDS("Erlös"),
    FEES("Prov./Gebühr"),
    SUBTOTAL("Basis"),
    UNREALIZED_PNL("Unrealisierter G/V"),
    REALIZED_PNL("Realisierter G&V"),
    CODE("Code"),
    DATE_TYPE("_record_type");

    private static final Map<String, ReportField> KEY_MAP = Arrays.stream(ReportField.values())
            .flatMap(field -> field.keys.stream().map(key -> Map.entry(key, field)))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    private final Set<String> keys = new HashSet<>();

    ReportField(String... keys) {
        this.keys.addAll(Arrays.stream(keys).collect(Collectors.toSet()));
    }

    public Set<String> getKeys() {
        return keys;
    }

    public static ReportField fromKey(String key) {
        return KEY_MAP.get(key);
    }
}
