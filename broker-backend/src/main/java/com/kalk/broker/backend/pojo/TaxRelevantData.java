package com.kalk.broker.backend.pojo;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO für steuerrelevante Daten entsprechend dem Elster KAP-Formular
 */
public class TaxRelevantData {
    
    private String taxpayerId;
    private String accountNumber;
    private String brokerName;
    private int taxYear;
    private List<CapitalGain> capitalGains;
    private List<Dividend> dividends;
    private List<ForeignTax> foreignTaxes;
    private TaxSummary summary;
    
    // Nested classes für strukturierte Daten
    
    public static class CapitalGain {
        private String isin;
        private String symbol;
        private String description;
        private String assetCategory;
        private LocalDate purchaseDate;
        private LocalDate saleDate;
        private BigDecimal purchasePrice;
        private BigDecimal salePrice;
        private BigDecimal quantity;
        private BigDecimal realizedGain;
        private BigDecimal commission;
        private String currency;
        private String transactionDescription;
        private boolean isShortTerm; // < 1 Jahr
        
        // Constructors
        public CapitalGain() {}
        
        public CapitalGain(String isin, String symbol, String description) {
            this.isin = isin;
            this.symbol = symbol;
            this.description = description;
        }
        
        // Getters and Setters
        public String getIsin() { return isin; }
        public void setIsin(String isin) { this.isin = isin; }
        
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getAssetCategory() { return assetCategory; }
        public void setAssetCategory(String assetCategory) { this.assetCategory = assetCategory; }
        
        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }
        
        public LocalDate getSaleDate() { return saleDate; }
        public void setSaleDate(LocalDate saleDate) { this.saleDate = saleDate; }
        
        public BigDecimal getPurchasePrice() { return purchasePrice; }
        public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
        
        public BigDecimal getSalePrice() { return salePrice; }
        public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
        
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        
        public BigDecimal getRealizedGain() { return realizedGain; }
        public void setRealizedGain(BigDecimal realizedGain) { this.realizedGain = realizedGain; }
        
        public BigDecimal getCommission() { return commission; }
        public void setCommission(BigDecimal commission) { this.commission = commission; }
        
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        
        public String getTransactionDescription() { return transactionDescription; }
        public void setTransactionDescription(String transactionDescription) { this.transactionDescription = transactionDescription; }
        
        public boolean isShortTerm() { return isShortTerm; }
        public void setShortTerm(boolean shortTerm) { isShortTerm = shortTerm; }
    }
    
    public static class Dividend {
        private String isin;
        private String symbol;
        private String description;
        private LocalDate paymentDate;
        private BigDecimal grossAmount;
        private BigDecimal netAmount;
        private BigDecimal withholdingTax;
        private BigDecimal foreignTax;
        private String currency;
        private String country;
        private String transactionDescription;
        
        // Constructors
        public Dividend() {}
        
        public Dividend(String isin, String symbol, LocalDate paymentDate) {
            this.isin = isin;
            this.symbol = symbol;
            this.paymentDate = paymentDate;
        }
        
        // Getters and Setters
        public String getIsin() { return isin; }
        public void setIsin(String isin) { this.isin = isin; }
        
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public LocalDate getPaymentDate() { return paymentDate; }
        public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
        
        public BigDecimal getGrossAmount() { return grossAmount; }
        public void setGrossAmount(BigDecimal grossAmount) { this.grossAmount = grossAmount; }
        
        public BigDecimal getNetAmount() { return netAmount; }
        public void setNetAmount(BigDecimal netAmount) { this.netAmount = netAmount; }
        
        public BigDecimal getWithholdingTax() { return withholdingTax; }
        public void setWithholdingTax(BigDecimal withholdingTax) { this.withholdingTax = withholdingTax; }
        
        public BigDecimal getForeignTax() { return foreignTax; }
        public void setForeignTax(BigDecimal foreignTax) { this.foreignTax = foreignTax; }
        
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
        
        public String getTransactionDescription() { return transactionDescription; }
        public void setTransactionDescription(String transactionDescription) { this.transactionDescription = transactionDescription; }
    }
    
    public static class ForeignTax {
        private String country;
        private String currency;
        private BigDecimal amount;
        private LocalDate date;
        private String reference;
        
        // Constructors
        public ForeignTax() {}
        
        public ForeignTax(String country, String currency, BigDecimal amount) {
            this.country = country;
            this.currency = currency;
            this.amount = amount;
        }
        
        // Getters and Setters
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }
        
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        
        public String getReference() { return reference; }
        public void setReference(String reference) { this.reference = reference; }
    }
    
    public static class TaxSummary {
        private BigDecimal totalCapitalGains;
        private BigDecimal totalCapitalLosses;
        private BigDecimal netCapitalGains;
        private BigDecimal totalDividends;
        private BigDecimal totalWithholdingTax;
        private BigDecimal totalForeignTax;
        private BigDecimal totalCommissions;
        private int numberOfTransactions;

        // Getters and Setters
        public BigDecimal getTotalCapitalGains() { return totalCapitalGains; }
        public void setTotalCapitalGains(BigDecimal totalCapitalGains) { this.totalCapitalGains = totalCapitalGains; }
        
        public BigDecimal getTotalCapitalLosses() { return totalCapitalLosses; }
        public void setTotalCapitalLosses(BigDecimal totalCapitalLosses) { this.totalCapitalLosses = totalCapitalLosses; }
        
        public BigDecimal getNetCapitalGains() { return netCapitalGains; }
        public void setNetCapitalGains(BigDecimal netCapitalGains) { this.netCapitalGains = netCapitalGains; }
        
        public BigDecimal getTotalDividends() { return totalDividends; }
        public void setTotalDividends(BigDecimal totalDividends) { this.totalDividends = totalDividends; }
        
        public BigDecimal getTotalWithholdingTax() { return totalWithholdingTax; }
        public void setTotalWithholdingTax(BigDecimal totalWithholdingTax) { this.totalWithholdingTax = totalWithholdingTax; }
        
        public BigDecimal getTotalForeignTax() { return totalForeignTax; }
        public void setTotalForeignTax(BigDecimal totalForeignTax) { this.totalForeignTax = totalForeignTax; }
        
        public BigDecimal getTotalCommissions() { return totalCommissions; }
        public void setTotalCommissions(BigDecimal totalCommissions) { this.totalCommissions = totalCommissions; }
        
        public int getNumberOfTransactions() { return numberOfTransactions; }
        public void setNumberOfTransactions(int numberOfTransactions) { this.numberOfTransactions = numberOfTransactions; }
    }
    
    // Main class constructors
    public TaxRelevantData() {}
    
    public TaxRelevantData(String taxpayerId, String accountNumber, int taxYear) {
        this.taxpayerId = taxpayerId;
        this.accountNumber = accountNumber;
        this.taxYear = taxYear;
    }
    
    // Main class getters and setters
    public String getTaxpayerId() { return taxpayerId; }
    public void setTaxpayerId(String taxpayerId) { this.taxpayerId = taxpayerId; }
    
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    
    public String getBrokerName() { return brokerName; }
    public void setBrokerName(String brokerName) { this.brokerName = brokerName; }
    
    public int getTaxYear() { return taxYear; }
    public void setTaxYear(int taxYear) { this.taxYear = taxYear; }
    
    public List<CapitalGain> getCapitalGains() { return capitalGains; }
    public void setCapitalGains(List<CapitalGain> capitalGains) { this.capitalGains = capitalGains; }
    
    public List<Dividend> getDividends() { return dividends; }
    public void setDividends(List<Dividend> dividends) { this.dividends = dividends; }
    
    public List<ForeignTax> getForeignTaxes() { return foreignTaxes; }
    public void setForeignTaxes(List<ForeignTax> foreignTaxes) { this.foreignTaxes = foreignTaxes; }
    
    public TaxSummary getSummary() { return summary; }
    public void setSummary(TaxSummary summary) { this.summary = summary; }
}
