package com.kalk.broker.backend.config;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public enum CsvField {

    TRANSACTIONS("transaktionen", "transactions", "trades"),

    SYMBOL("Symbol"),
    ASSET_CATEGORY("Vermögenswertkategorie"),
    CURRENCY("Währung"),
    QUANTITY("Menge"),
    DATETIME("Datum/Zeit"),
    PRICE("T.-Kurs"),
    PROCEEDS("Erlös"),
    FEES("Prov./Gebühr"),
    SUBTOTAL("Basis"),
    REALIZED_PNL("Realisierter G&V"),
    CODE("Code"),
    DATE_TYPE("_record_type");

    private static final Map<String, CsvField> KEY_MAP = Arrays.stream(CsvField.values())
            .flatMap(field -> field.keys.stream().map(key -> Map.entry(key, field)))
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));

    private final Set<String> keys = new HashSet<>();

    CsvField(String... keys) {
        this.keys.addAll(Arrays.stream(keys).collect(Collectors.toSet()));
    }

    public Set<String> getKeys() {
        return keys;
    }

    public static CsvField fromKey(String key) {
        return KEY_MAP.get(key);
    }
}
