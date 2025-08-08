package com.kalk.broker.backend.pojo;

import java.time.LocalDateTime;

public record Statement(String title, String period, LocalDateTime generated) {
    
}
