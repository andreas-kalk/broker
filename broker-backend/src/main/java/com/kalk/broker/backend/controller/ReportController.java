package com.kalk.broker.backend.controller;

import com.kalk.broker.backend.config.AppConstants;
import com.kalk.broker.backend.csv.FileImporter;
import com.kalk.broker.backend.exception.FileProcessingException;
import com.kalk.broker.backend.pojo.*;
import com.kalk.broker.backend.service.TaxDataService;
import com.kalk.broker.backend.service.PortfolioDataService;
import com.kalk.broker.backend.service.TransactionDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    private final FileImporter fileImporter;
    private final TaxDataService taxRelevantDataService;
    private final PortfolioDataService portfolioDataService;
    private final TransactionDataService transactionDataService;

    private String currentFileName = AppConstants.DEFAULT_FILE_NAME;

    @Autowired
    public ReportController(FileImporter fileImporter, TaxDataService taxRelevantDataService,
                          PortfolioDataService portfolioDataService, TransactionDataService transactionDataService) {
        this.fileImporter = fileImporter;
        this.taxRelevantDataService = taxRelevantDataService;
        this.portfolioDataService = portfolioDataService;
        this.transactionDataService = transactionDataService;
    }

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("Received file upload request: {}", file.getOriginalFilename());

        validateFile(file);

        try {
            Report report = fileImporter.parseUploadedFile(file);
            if (report == null) {
                throw new FileProcessingException(AppConstants.ErrorMessages.PARSING_ERROR);
            }

            currentFileName = file.getOriginalFilename();

            UploadResponse response = createSuccessUploadResponse(report);
            logger.info("File uploaded successfully: {} with {} sections", currentFileName, report.getSections().size());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            logger.error("Error processing file: {}", e.getMessage());
            throw new FileProcessingException(AppConstants.ErrorMessages.PROCESSING_ERROR + e.getMessage(), e);
        }
    }

    @GetMapping("/current-file")
    public ResponseEntity<String> getCurrentFileName() {
        return ResponseEntity.ok(currentFileName);
    }

    @GetMapping("/has-uploaded-file")
    public ResponseEntity<Boolean> hasUploadedFile() {
        return ResponseEntity.ok(fileImporter.hasUploadedFile());
    }

    @DeleteMapping("/uploaded-file")
    public ResponseEntity<Void> clearUploadedFile() {
        fileImporter.clearUploadedFile();
        currentFileName = AppConstants.DEFAULT_FILE_NAME;
        logger.info("Uploaded file cleared, reset to default: {}", currentFileName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sections")
    public ResponseEntity<Map<String, SectionData>> getAllSections() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> ResponseEntity.ok(report.getSections()))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sections/{sectionName}")
    public ResponseEntity<SectionData> getSection(@PathVariable String sectionName) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .filter(report -> report.hasSection(sectionName))
            .map(report -> ResponseEntity.ok(report.getSection(sectionName)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sections/{sectionName}/data")
    public ResponseEntity<List<Map<String, String>>> getSectionData(@PathVariable String sectionName) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .filter(report -> report.hasSection(sectionName))
            .map(report -> {
                SectionData section = report.getSection(sectionName);
                return ResponseEntity.ok(section.getDataRows());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/summary")
    public ResponseEntity<ReportSummary> getReportSummary() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.ok(createEmptyReportSummary());
        }

        return getCurrentReportSafely()
            .map(this::createReportSummary)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // === TAX RELEVANT DATA ENDPOINTS ===

    @GetMapping("/tax-data")
    public ResponseEntity<TaxRelevantData> getTaxRelevantData(
            @RequestParam(name = "taxYear", defaultValue = "2024") int taxYear) {

        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TaxRelevantData taxData = taxRelevantDataService.extractTaxRelevantData(report, taxYear);
                return ResponseEntity.ok(taxData);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tax-data/capital-gains")
    public ResponseEntity<List<TaxRelevantData.CapitalGain>> getCapitalGains(
            @RequestParam(defaultValue = "2024") int taxYear) {

        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TaxRelevantData taxData = taxRelevantDataService.extractTaxRelevantData(report, taxYear);
                return ResponseEntity.ok(taxData.getCapitalGains());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt nur Dividenden zurück (für KAP-Formular Anlage KAP-INV)
     */
    @GetMapping("/tax-data/dividends")
    public ResponseEntity<List<TaxRelevantData.Dividend>> getDividends(
            @RequestParam(defaultValue = "2024") int taxYear) {

        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TaxRelevantData taxData = taxRelevantDataService.extractTaxRelevantData(report, taxYear);
                return ResponseEntity.ok(taxData.getDividends());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt nur die Steuer-Zusammenfassung zurück (für KAP-Übersicht)
     */
    @GetMapping("/tax-data/summary")
    public ResponseEntity<TaxRelevantData.TaxSummary> getTaxSummary(
            @RequestParam(defaultValue = "2024") int taxYear) {

        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TaxRelevantData taxData = taxRelevantDataService.extractTaxRelevantData(report, taxYear);
                return ResponseEntity.ok(taxData.getSummary());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt ausländische Steuern zurück (für Anrechnung/Erstattung)
     */
    @GetMapping("/tax-data/foreign-taxes")
    public ResponseEntity<List<TaxRelevantData.ForeignTax>> getForeignTaxes(
            @RequestParam(defaultValue = "2024") int taxYear) {

        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TaxRelevantData taxData = taxRelevantDataService.extractTaxRelevantData(report, taxYear);
                return ResponseEntity.ok(taxData.getForeignTaxes());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // === PORTFOLIO DATA ENDPOINTS ===

    /**
     * Erstellt und gibt das vollständige Portfolio zurück
     */
    @GetMapping("/portfolio")
    public ResponseEntity<Portfolio> getPortfolio() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                return ResponseEntity.ok(portfolio);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt nur die Positionen des Portfolios zurück
     */
    @GetMapping("/portfolio/positions")
    public ResponseEntity<List<Position>> getPositions() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                return ResponseEntity.ok(portfolio.getPositions());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt eine spezifische Position zurück
     */
    @GetMapping("/portfolio/positions/{symbol}")
    public ResponseEntity<Position> getPosition(@PathVariable String symbol) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                return portfolio.getPositions().stream()
                    .filter(pos -> symbol.equals(pos.getSymbol()))
                    .findFirst()
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt alle Transaktionen für eine bestimmte Position zurück
     */
    @GetMapping("/portfolio/positions/{symbol}/transactions")
    public ResponseEntity<List<Transaction>> getPositionTransactions(@PathVariable String symbol) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                return portfolio.getPositions().stream()
                    .filter(pos -> symbol.equals(pos.getSymbol()))
                    .findFirst()
                    .map(pos -> ResponseEntity.ok(pos.getTransactions()))
                    .orElse(ResponseEntity.notFound().build());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt alle Dividenden für eine bestimmte Position zurück
     */
    @GetMapping("/portfolio/positions/{symbol}/dividends")
    public ResponseEntity<List<Dividend>> getPositionDividends(@PathVariable String symbol) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                return portfolio.getPositions().stream()
                    .filter(pos -> symbol.equals(pos.getSymbol()))
                    .findFirst()
                    .map(pos -> ResponseEntity.ok(pos.getDividends()))
                    .orElse(ResponseEntity.notFound().build());
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt eine Portfolio-Übersicht mit Summen zurück
     */
    @GetMapping("/portfolio/summary")
    public ResponseEntity<PortfolioSummary> getPortfolioSummary() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Portfolio portfolio = portfolioDataService.createPortfolio(report);
                PortfolioSummary summary = createPortfolioSummary(portfolio);
                return ResponseEntity.ok(summary);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // === TRANSACTION DATA ENDPOINTS ===

    /**
     * Gibt alle Transaktionen zurück
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<SymbolTransactions>> getAllTransactions() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                List<SymbolTransactions> transactions = transactionDataService.processTransactions(report);
                return ResponseEntity.ok(transactions);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt Transaktionen gruppiert nach Asset-Key zurück
     */
    @GetMapping("/transactions/by-asset-key")
    public ResponseEntity<Map<String, SymbolTransactions>> getTransactionsByAssetKey() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Map<String, SymbolTransactions> transactions = transactionDataService.getTransactionsByAssetKey(report);
                return ResponseEntity.ok(transactions);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt Transaktionen gruppiert nach Symbol zurück
     */
    @GetMapping("/transactions/by-symbol")
    public ResponseEntity<Map<String, SymbolTransactions>> getTransactionsBySymbol() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Map<String, SymbolTransactions> transactions = transactionDataService.getTransactionsBySymbol(report);
                return ResponseEntity.ok(transactions);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt alle einzelnen Transaktionen zurück
     */
    @GetMapping("/transactions/all")
    public ResponseEntity<List<Transaction>> getAllIndividualTransactions() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                List<Transaction> transactions = transactionDataService.extractAllTransactions(report);
                return ResponseEntity.ok(transactions);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt Transaktionszusammenfassung zurück
     */
    @GetMapping("/transactions/summary")
    public ResponseEntity<TransactionDataService.TransactionSummary> getTransactionSummary() {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                TransactionDataService.TransactionSummary summary = transactionDataService.getTransactionSummary(report);
                return ResponseEntity.ok(summary);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt alle Transaktionen für ein bestimmtes Steuerjahr zurück
     */
    @GetMapping("/transactions/year/{taxYear}")
    public ResponseEntity<List<Transaction>> getTransactionsByYear(@PathVariable int taxYear) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.noContent().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                List<Transaction> transactions = transactionDataService.extractTransactions(report, taxYear);
                return ResponseEntity.ok(transactions);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Gibt eine spezifische Transaktion zurück
     */
    @GetMapping("/transactions/{transactionId}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable String transactionId) {
        if (!fileImporter.hasUploadedFile()) {
            return ResponseEntity.notFound().build();
        }

        return getCurrentReportSafely()
            .map(report -> {
                Transaction transaction = transactionDataService.getTransactionById(report, transactionId);
                return ResponseEntity.ok(transaction);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    // === PRIVATE HELPER METHODS ===

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileProcessingException(AppConstants.ErrorMessages.FILE_EMPTY);
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(AppConstants.CSV_FILE_EXTENSION)) {
            throw new FileProcessingException(AppConstants.ErrorMessages.INVALID_FILE_TYPE);
        }
    }

    private UploadResponse createSuccessUploadResponse(Report report) {
        UploadResponse response = new UploadResponse(true, AppConstants.SuccessMessages.FILE_UPLOADED);
        response.setSectionCount(report.getSections().size());
        response.setSectionNames(report.getSections().keySet().stream().toList());
        response.setFileName(currentFileName);
        return response;
    }

    private Optional<Report> getCurrentReportSafely() {
        try {
            return Optional.ofNullable(getCurrentReport());
        } catch (IOException e) {
            logger.error("Error getting current report: {}", e.getMessage());
            throw new FileProcessingException(AppConstants.ErrorMessages.PROCESSING_ERROR + e.getMessage(), e);
        }
    }

    private ReportSummary createEmptyReportSummary() {
        ReportSummary summary = new ReportSummary();
        summary.setSectionCount(0);
        summary.setSectionNames(List.of());
        summary.setTotalDataRows(0);
        summary.setCurrentFileName(null);
        return summary;
    }

    private ReportSummary createReportSummary(Report report) {
        ReportSummary summary = new ReportSummary();
        summary.setSectionCount(report.getSections().size());
        summary.setSectionNames(report.getSections().keySet().stream().toList());
        summary.setCurrentFileName(currentFileName);

        int totalDataRows = report.getSections().values().stream()
            .mapToInt(section -> section.getDataRows().size())
            .sum();
        summary.setTotalDataRows(totalDataRows);

        return summary;
    }

    private PortfolioSummary createPortfolioSummary(Portfolio portfolio) {
        PortfolioSummary summary = new PortfolioSummary();
        summary.setTotalPositions(portfolio.getPositions().size());
        summary.setTotalMarketValue(portfolio.getTotalMarketValue());
        summary.setTotalUnrealizedPnL(portfolio.getTotalUnrealizedPnL());
        summary.setTotalRealizedPnL(portfolio.getTotalRealizedPnL());
        summary.setTotalDividends(portfolio.getTotalDividends());
        summary.setAccountId(portfolio.getAccountId());
        summary.setReportDate(portfolio.getReportDate());
        summary.setBaseCurrency(portfolio.getBaseCurrency());
        return summary;
    }

    private Report getCurrentReport() throws IOException {
        if (fileImporter.hasUploadedFile()) {
            return fileImporter.getUploadedReport();
        }
        return new Report();
    }

    // DTO für Report Summary
    public static class ReportSummary {
        private int sectionCount;
        private List<String> sectionNames;
        private int totalDataRows;
        private String currentFileName;

        // Getters and Setters
        public int getSectionCount() { return sectionCount; }
        public void setSectionCount(int sectionCount) { this.sectionCount = sectionCount; }

        public List<String> getSectionNames() { return sectionNames; }
        public void setSectionNames(List<String> sectionNames) { this.sectionNames = sectionNames; }
        
        public int getTotalDataRows() { return totalDataRows; }
        public void setTotalDataRows(int totalDataRows) { this.totalDataRows = totalDataRows; }

        public String getCurrentFileName() { return currentFileName; }
        public void setCurrentFileName(String currentFileName) { this.currentFileName = currentFileName; }
    }

    // DTO für Upload Response
    public static class UploadResponse {
        private boolean success;
        private String message;
        private int sectionCount;
        private List<String> sectionNames;
        private String fileName;

        public UploadResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // Getters and Setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public int getSectionCount() { return sectionCount; }
        public void setSectionCount(int sectionCount) { this.sectionCount = sectionCount; }

        public List<String> getSectionNames() { return sectionNames; }
        public void setSectionNames(List<String> sectionNames) { this.sectionNames = sectionNames; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
    }

    // DTO für Portfolio Summary
    public static class PortfolioSummary {
        private int totalPositions;
        private BigDecimal totalMarketValue;
        private BigDecimal totalUnrealizedPnL;
        private BigDecimal totalRealizedPnL;
        private BigDecimal totalDividends;
        private String accountId;
        private LocalDateTime reportDate;
        private String baseCurrency;

        // Getters and Setters
        public int getTotalPositions() { return totalPositions; }
        public void setTotalPositions(int totalPositions) { this.totalPositions = totalPositions; }

        public BigDecimal getTotalMarketValue() { return totalMarketValue; }
        public void setTotalMarketValue(BigDecimal totalMarketValue) { this.totalMarketValue = totalMarketValue; }

        public BigDecimal getTotalUnrealizedPnL() { return totalUnrealizedPnL; }
        public void setTotalUnrealizedPnL(BigDecimal totalUnrealizedPnL) { this.totalUnrealizedPnL = totalUnrealizedPnL; }

        public BigDecimal getTotalRealizedPnL() { return totalRealizedPnL; }
        public void setTotalRealizedPnL(BigDecimal totalRealizedPnL) { this.totalRealizedPnL = totalRealizedPnL; }

        public BigDecimal getTotalDividends() { return totalDividends; }
        public void setTotalDividends(BigDecimal totalDividends) { this.totalDividends = totalDividends; }

        public String getAccountId() { return accountId; }
        public void setAccountId(String accountId) { this.accountId = accountId; }

        public LocalDateTime getReportDate() { return reportDate; }
        public void setReportDate(LocalDateTime reportDate) { this.reportDate = reportDate; }

        public String getBaseCurrency() { return baseCurrency; }
        public void setBaseCurrency(String baseCurrency) { this.baseCurrency = baseCurrency; }
    }
}
