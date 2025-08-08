package com.kalk.broker.backend.config;

import java.util.Map;

/**
 * Application configuration constants
 */
public final class AppConstants {

    // File handling
    public static final String DEFAULT_FILE_NAME = "de.csv";
    public static final String CSV_FILE_EXTENSION = ".csv";

    // Error messages
    public static final class ErrorMessages {

        private ErrorMessages() {
        }

        public static final String FILE_EMPTY = "Datei ist leer";
        public static final String INVALID_FILE_TYPE = "Nur CSV-Dateien sind erlaubt";
        public static final String PARSING_ERROR = "Fehler beim Parsen der Datei";
        public static final String PROCESSING_ERROR = "Fehler beim Verarbeiten der Datei: ";
    }

    // Success messages
    public static final class SuccessMessages {

        private SuccessMessages() {
        }

        public static final String FILE_UPLOADED = "Datei erfolgreich hochgeladen";
    }

    // Asset category mappings
    public static final class AssetCategories {

        public static final Map<String, String> ASSET_CATEGORIES = Map.of(
                "STK", "Aktie (Stock)",
                "OPT", "Option",
                "FUT", "Future",
                "CASH", "Bargeld (Cash)",
                "BOND", "Anleihe (Bond)",
                "FUND", "Fonds",
                "ETF", "ETF",
                "CFD", "CFD",
                "CRYPTO", "Kryptowährung",
                "FOREX", "Devisen"
        );

        private AssetCategories() {
            // Utility class - prevent instantiation
        }
    }

    private AppConstants() {
        // Utility class - prevent instantiation
    }
}
