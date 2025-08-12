package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;

/**
 * Repräsentiert Performance-Daten für eine Position
 */
public class PerformanceData {
    private BigDecimal realizedPnL;
    private BigDecimal unrealizedPnL;
    private BigDecimal totalPnL;
    private BigDecimal totalReturn;
    private BigDecimal totalReturnPercent;
    private BigDecimal costBasis;
    private BigDecimal totalDividends;
    
    public PerformanceData() {}
    
    public PerformanceData(BigDecimal realizedPnL, BigDecimal unrealizedPnL) {
        this.realizedPnL = realizedPnL;
        this.unrealizedPnL = unrealizedPnL;
        this.totalPnL = realizedPnL.add(unrealizedPnL);
    }
    
    // Getters and Setters
    public BigDecimal getRealizedPnL() {
        return realizedPnL;
    }
    
    public void setRealizedPnL(BigDecimal realizedPnL) {
        this.realizedPnL = realizedPnL;
    }
    
    public BigDecimal getUnrealizedPnL() {
        return unrealizedPnL;
    }
    
    public void setUnrealizedPnL(BigDecimal unrealizedPnL) {
        this.unrealizedPnL = unrealizedPnL;
    }
    
    public BigDecimal getTotalPnL() {
        return totalPnL;
    }
    
    public void setTotalPnL(BigDecimal totalPnL) {
        this.totalPnL = totalPnL;
    }
    
    public BigDecimal getTotalReturn() {
        return totalReturn;
    }
    
    public void setTotalReturn(BigDecimal totalReturn) {
        this.totalReturn = totalReturn;
    }
    
    public BigDecimal getTotalReturnPercent() {
        return totalReturnPercent;
    }
    
    public void setTotalReturnPercent(BigDecimal totalReturnPercent) {
        this.totalReturnPercent = totalReturnPercent;
    }
    
    public BigDecimal getCostBasis() {
        return costBasis;
    }
    
    public void setCostBasis(BigDecimal costBasis) {
        this.costBasis = costBasis;
    }
    
    public BigDecimal getTotalDividends() {
        return totalDividends;
    }
    
    public void setTotalDividends(BigDecimal totalDividends) {
        this.totalDividends = totalDividends;
    }
    
    @Override
    public String toString() {
        return "PerformanceData{" +
                "totalPnL=" + totalPnL +
                ", totalReturnPercent=" + totalReturnPercent +
                ", totalDividends=" + totalDividends +
                '}';
    }
}
