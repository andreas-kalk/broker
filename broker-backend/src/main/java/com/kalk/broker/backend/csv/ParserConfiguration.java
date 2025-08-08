package com.kalk.broker.backend.csv;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Konfigurationsklasse für CSV-Parser
 * Registriert automatisch den flexiblen Parser als Spring Bean
 */
@Configuration
public class ParserConfiguration {
    
    @Bean
    public FlexibleCsvParser flexibleCsvParser() {
        return new FlexibleCsvParser();
    }
}
