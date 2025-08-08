import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        taxAnalysis: 'Tax Analysis',
        dataExplorer: 'Data Explorer',
        help: 'Codes & Help',
        optionsCalculator: 'Options Calculator',
        brandName: 'Broker Analyzer'
      },

      // Dashboard
      dashboard: {
        title: 'Portfolio Dashboard',
        currentFile: 'Current file',
        noFileUploaded: 'No CSV file uploaded',
        noFileDescription: 'Upload a CSV file to start analyzing your broker data.',
        uploadFile: 'Upload CSV File',
        refreshData: 'Refresh data',
        newFile: 'New File',
        quickAccess: 'Quick Access',
        activityOverview: 'Activity Overview',
        portfolioOverview: 'Portfolio Overview',
        dataOverview: 'Data Overview',
        sections: 'Sections',
        totalEntries: 'Total Entries',
        taxRelevant: 'Tax Relevant',
        status: 'Status',
        ready: 'Ready',
        complete: 'Complete',
        active: 'Active',
        analyzed: 'Analyzed',
        kapExport: 'KAP Export',
        structured: 'Structured'
      },

      // File Upload
      upload: {
        title: 'Welcome to Broker Analyzer',
        description: 'Upload your CSV file to start professional analysis of your broker data',
        features: {
          analysis: {
            title: 'Automatic Analysis',
            description: 'Your CSV file is automatically analyzed and structured'
          },
          optimization: {
            title: 'Tax Optimization',
            description: 'Optimally prepare your KAP form data'
          },
          security: {
            title: 'Secure Processing',
            description: 'All data is processed locally and not stored'
          }
        },
        supportedFormats: 'Supported formats: CSV files from Interactive Brokers, Comdirect, and other common brokers',
        dragDrop: 'Drag and drop your CSV file here, or click to select',
        selectFile: 'Select File',
        uploading: 'Uploading...',
        success: 'File uploaded successfully!',
        error: 'Error uploading file'
      },

      // Tax Analysis
      tax: {
        title: 'Tax Analysis',
        description: 'Generate tax-relevant data for your German tax return',
        year: 'Tax Year',
        selectYear: 'Select tax year',
        capitalGains: 'Capital Gains',
        dividends: 'Dividends',
        foreignTaxes: 'Foreign Taxes',
        summary: 'Tax Summary',
        export: 'Export Data',
        noData: 'No tax data available for the selected year',
        totalGains: 'Total Gains',
        totalLosses: 'Total Losses',
        netGains: 'Net Gains',
        totalDividends: 'Total Dividends',
        withholdingTax: 'Withholding Tax',
        transactions: 'Transactions'
      },

      // Data Explorer
      explorer: {
        title: 'Data Explorer',
        description: 'Browse and analyze all available data sections',
        search: 'Search sections or columns...',
        categories: {
          all: 'All Sections',
          trades: 'Trading',
          dividends: 'Dividends',
          performance: 'Performance',
          cash: 'Liquidity',
          other: 'Other'
        },
        sectionsFound: 'sections found',
        openAll: 'Open All',
        closeAll: 'Close All',
        noSections: 'No sections found',
        tryDifferent: 'Try different search terms or categories',
        entries: 'entries',
        columns: 'columns',
        exportCsv: 'Export as CSV'
      },

      // Help & Codes
      help: {
        title: 'Codes & Help',
        description: 'Reference guide for transaction codes and application help',
        search: 'Search codes or descriptions...',
        tabs: {
          transactionCodes: 'Transaction Codes',
          assetCategories: 'Asset Categories',
          applicationHelp: 'Application Help'
        },
        transactionCodesInfo: 'These codes are used by brokers to identify different transaction types.',
        assetCategoriesInfo: 'Asset categories classify the different types of financial instruments.',
        categories: {
          trading: 'Trading',
          income: 'Income',
          costs: 'Costs',
          other: 'Other'
        },
        assetTypes: {
          stock: 'Stock',
          option: 'Option',
          future: 'Future',
          bond: 'Bond',
          etf: 'ETF',
          fund: 'Fund',
          cash: 'Cash',
          forex: 'Forex'
        },
        assetDetails: {
          stock: 'Individual company shares',
          option: 'Option contracts on underlying assets',
          future: 'Futures contracts',
          bond: 'Government and corporate bonds',
          etf: 'Exchange Traded Funds',
          fund: 'Investment funds',
          cash: 'Liquidity and money market instruments',
          forex: 'Foreign exchange transactions'
        },
        sections: {
          csvUpload: {
            title: 'CSV File Upload',
            content: [
              'Supported formats: CSV files from Interactive Brokers, Comdirect and other brokers',
              'Maximum file size: 50 MB',
              'The file is automatically analyzed and divided into sections',
              'All data is processed locally and not permanently stored'
            ]
          },
          taxAnalysis: {
            title: 'Tax Analysis (KAP Form)',
            content: [
              'Automatic calculation of capital gains and losses',
              'FIFO method for matching purchases and sales',
              'Recording of dividends and foreign withholding taxes',
              'Export-ready data for tax returns',
              'Distinction between short and long-term capital gains'
            ]
          },
          dataProcessing: {
            title: 'Data Processing',
            content: [
              'Flexible CSV parser for different broker formats',
              'Automatic recognition of transaction types',
              'Currency conversion and cost calculation',
              'Grouping of related transactions',
              'Validation and cleaning of input data'
            ]
          },
          dataExplorer: {
            title: 'Data Explorer',
            content: [
              'Structured view of all available data sections',
              'Search and filter functions for specific data',
              'Export options for individual sections',
              'Detailed views for trades, dividends and other transactions',
              'Clear categorization by data types'
            ]
          }
        }
      },

      // Options Calculator
      options: {
        title: 'Options Profitability Calculator',
        description: 'Calculate the profitability of buying or selling stock options',
        tabs: {
          calculator: 'Calculator',
          scenarios: 'Scenarios',
          analysis: 'Analysis'
        },
        optionType: 'Option Type',
        call: 'Call Option',
        put: 'Put Option',
        strategy: 'Strategy',
        buy: 'Buy Option',
        sell: 'Sell Option',
        stockPrice: 'Current Stock Price',
        strikePrice: 'Strike Price',
        premium: 'Option Premium',
        expiration: 'Days to Expiration',
        volatility: 'Implied Volatility (%)',
        riskFreeRate: 'Risk-Free Rate (%)',
        calculate: 'Calculate',
        results: 'Results',
        profitLoss: 'Profit/Loss',
        breakeven: 'Breakeven Point',
        maxProfit: 'Maximum Profit',
        maxLoss: 'Maximum Loss',
        probability: 'Probability of Profit',
        greeks: 'Option Greeks',
        delta: 'Delta',
        gamma: 'Gamma',
        theta: 'Theta',
        vega: 'Vega',
        rho: 'Rho',
        scenarios: 'Price Scenarios',
        currentPrice: 'Current Price',
        targetPrice: 'Target Price',
        timeDecay: 'Time Decay Effect',
        volatilityImpact: 'Volatility Impact',
        profitProbability: 'Profit Probability',
        riskReturn: 'Risk/Return Analysis',
        recommendation: 'Recommendation',
        inputValidation: {
          stockPriceRequired: 'Stock price is required',
          strikePriceRequired: 'Strike price is required',
          premiumRequired: 'Option premium is required',
          invalidNumber: 'Please enter a valid number',
          negativeValue: 'Value cannot be negative'
        }
      },

      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        open: 'Open',
        refresh: 'Refresh',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        download: 'Download',
        upload: 'Upload',
        language: 'Language'
      },

      // Table headers and data
      table: {
        symbol: 'Symbol',
        description: 'Description',
        quantity: 'Quantity',
        price: 'Price',
        amount: 'Amount',
        currency: 'Currency',
        date: 'Date',
        type: 'Type',
        category: 'Category',
        commission: 'Commission',
        code: 'Code',
        noData: 'No data available'
      }
    }
  },
  de: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        taxAnalysis: 'Steueranalyse',
        dataExplorer: 'Datenexplorer',
        help: 'Codes & Hilfe',
        optionsCalculator: 'Optionsrechner',
        brandName: 'Broker Analyzer'
      },

      // Dashboard
      dashboard: {
        title: 'Portfolio Dashboard',
        currentFile: 'Aktuelle Datei',
        noFileUploaded: 'Keine CSV-Datei hochgeladen',
        noFileDescription: 'Laden Sie eine CSV-Datei hoch, um mit der Analyse Ihrer Broker-Daten zu beginnen.',
        uploadFile: 'CSV-Datei hochladen',
        refreshData: 'Daten aktualisieren',
        newFile: 'Neue Datei',
        quickAccess: 'Schnellzugriff',
        activityOverview: 'Aktivitätsübersicht',
        portfolioOverview: 'Portfolio Übersicht',
        dataOverview: 'Datenübersicht',
        sections: 'Sektionen',
        totalEntries: 'Gesamte Einträge',
        taxRelevant: 'Steuerrelevant',
        status: 'Status',
        ready: 'Bereit',
        complete: 'Vollständig',
        active: 'Aktiv',
        analyzed: 'Analysiert',
        kapExport: 'KAP-Export',
        structured: 'Strukturiert'
      },

      // File Upload
      upload: {
        title: 'Willkommen bei Broker Analyzer',
        description: 'Laden Sie Ihre CSV-Datei hoch, um mit der professionellen Analyse Ihrer Broker-Daten zu beginnen',
        features: {
          analysis: {
            title: 'Automatische Analyse',
            description: 'Ihre CSV-Datei wird automatisch analysiert und strukturiert'
          },
          optimization: {
            title: 'Steueroptimierung',
            description: 'Bereiten Sie Ihre KAP-Formulardaten optimal vor'
          },
          security: {
            title: 'Sichere Verarbeitung',
            description: 'Alle Daten werden lokal verarbeitet und nicht gespeichert'
          }
        },
        supportedFormats: 'Unterstützte Formate: CSV-Dateien von Interactive Brokers, Comdirect und anderen gängigen Brokern',
        dragDrop: 'CSV-Datei hier hineinziehen oder klicken zum Auswählen',
        selectFile: 'Datei auswählen',
        uploading: 'Hochladen...',
        success: 'Datei erfolgreich hochgeladen!',
        error: 'Fehler beim Hochladen der Datei'
      },

      // Tax Analysis
      tax: {
        title: 'Steueranalyse',
        description: 'Erstellen Sie steuerrelevante Daten für Ihre deutsche Steuererklärung',
        year: 'Steuerjahr',
        selectYear: 'Steuerjahr auswählen',
        capitalGains: 'Kapitalerträge',
        dividends: 'Dividenden',
        foreignTaxes: 'Ausländische Steuern',
        summary: 'Steuer-Zusammenfassung',
        export: 'Daten exportieren',
        noData: 'Keine Steuerdaten für das ausgewählte Jahr verfügbar',
        totalGains: 'Gesamtgewinne',
        totalLosses: 'Gesamtverluste',
        netGains: 'Nettogewinne',
        totalDividends: 'Gesamtdividenden',
        withholdingTax: 'Quellensteuer',
        transactions: 'Transaktionen'
      },

      // Data Explorer
      explorer: {
        title: 'Datenexplorer',
        description: 'Durchsuchen und analysieren Sie alle verfügbaren Datensektionen',
        search: 'Suche nach Sektionen oder Spalten...',
        categories: {
          all: 'Alle Sektionen',
          trades: 'Handel',
          dividends: 'Dividenden',
          performance: 'Performance',
          cash: 'Liquidität',
          other: 'Sonstige'
        },
        sectionsFound: 'Sektionen gefunden',
        openAll: 'Alle öffnen',
        closeAll: 'Alle schließen',
        noSections: 'Keine Sektionen gefunden',
        tryDifferent: 'Versuchen Sie es mit anderen Suchbegriffen oder Kategorien',
        entries: 'Einträge',
        columns: 'Spalten',
        exportCsv: 'Als CSV exportieren'
      },

      // Help & Codes
      help: {
        title: 'Codes & Hilfe',
        description: 'Nachschlagewerk für Transaktionscodes und Anwendungshilfe',
        search: 'Suche nach Codes oder Beschreibungen...',
        tabs: {
          transactionCodes: 'Transaktionscodes',
          assetCategories: 'Asset-Kategorien',
          applicationHelp: 'Anwendungshilfe'
        },
        transactionCodesInfo: 'Diese Codes werden von Brokern zur Kennzeichnung verschiedener Transaktionstypen verwendet.',
        assetCategoriesInfo: 'Asset-Kategorien klassifizieren die verschiedenen Arten von Finanzinstrumenten.',
        categories: {
          trading: 'Handel',
          income: 'Einkommen',
          costs: 'Kosten',
          other: 'Sonstige'
        },
        assetTypes: {
          stock: 'Aktie',
          option: 'Option',
          future: 'Futures',
          bond: 'Anleihe',
          etf: 'ETF',
          fund: 'Fonds',
          cash: 'Bargeld',
          forex: 'Devisen'
        },
        assetDetails: {
          stock: 'Aktien einzelner Unternehmen',
          option: 'Optionsscheine auf Basiswerte',
          future: 'Futures-Kontrakte',
          bond: 'Staats- und Unternehmensanleihen',
          etf: 'Exchange Traded Funds',
          fund: 'Investmentfonds',
          cash: 'Liquiditäts- und Geldmarktinstrumente',
          forex: 'Devisenhandel'
        },
        sections: {
          csvUpload: {
            title: 'CSV-Datei Upload',
            content: [
              'Unterstützte Formate: CSV-Dateien von Interactive Brokers, Comdirect und anderen Brokern',
              'Maximale Dateigröße: 50 MB',
              'Die Datei wird automatisch analysiert und in Sektionen unterteilt',
              'Alle Daten werden lokal verarbeitet und nicht dauerhaft gespeichert'
            ]
          },
          taxAnalysis: {
            title: 'Steueranalyse (KAP-Formular)',
            content: [
              'Automatische Berechnung von Kapitalerträgen und -verlusten',
              'FIFO-Methode für die Zuordnung von Käufen und Verkäufen',
              'Erfassung von Dividenden und ausländischen Quellensteuern',
              'Export-ready Daten für die Steuererklärung',
              'Unterscheidung zwischen kurz- und langfristigen Kapitalerträgen'
            ]
          },
          dataProcessing: {
            title: 'Datenverarbeitung',
            content: [
              'Flexible CSV-Parser für verschiedene Broker-Formate',
              'Automatische Erkennung von Transaktionstypen',
              'Währungsumrechnung und Kostenberechnung',
              'Gruppierung von zusammengehörigen Transaktionen',
              'Validierung und Bereinigung der Eingabedaten'
            ]
          },
          dataExplorer: {
            title: 'Datenexplorer',
            content: [
              'Strukturierte Ansicht aller verfügbaren Datensektionen',
              'Such- und Filterfunktionen für spezifische Daten',
              'Export-Möglichkeiten für einzelne Sektionen',
              'Detailansichten für Trades, Dividenden und andere Transaktionen',
              'Übersichtliche Kategorisierung nach Datentypen'
            ]
          }
        }
      },

      // Options Calculator
      options: {
        title: 'Optionen Rentabilitätsrechner',
        description: 'Berechnen Sie die Rentabilität von Kauf oder Verkauf von Aktienoptionen',
        tabs: {
          calculator: 'Rechner',
          scenarios: 'Szenarien',
          analysis: 'Analyse'
        },
        optionType: 'Optionstyp',
        call: 'Call-Option',
        put: 'Put-Option',
        strategy: 'Strategie',
        buy: 'Option kaufen',
        sell: 'Option verkaufen',
        stockPrice: 'Aktueller Aktienkurs',
        strikePrice: 'Ausübungspreis',
        premium: 'Optionsprämie',
        expiration: 'Tage bis Ablauf',
        volatility: 'Implizite Volatilität (%)',
        riskFreeRate: 'Risikofreier Zinssatz (%)',
        calculate: 'Berechnen',
        results: 'Ergebnisse',
        profitLoss: 'Gewinn/Verlust',
        breakeven: 'Break-Even-Punkt',
        maxProfit: 'Maximaler Gewinn',
        maxLoss: 'Maximaler Verlust',
        probability: 'Gewinnwahrscheinlichkeit',
        greeks: 'Options-Griechen',
        delta: 'Delta',
        gamma: 'Gamma',
        theta: 'Theta',
        vega: 'Vega',
        rho: 'Rho',
        scenarios: 'Kurs-Szenarien',
        currentPrice: 'Aktueller Kurs',
        targetPrice: 'Zielkurs',
        timeDecay: 'Zeitwertverfall',
        volatilityImpact: 'Volatilitätsauswirkung',
        profitProbability: 'Gewinnwahrscheinlichkeit',
        riskReturn: 'Risiko-/Rendite-Analyse',
        recommendation: 'Empfehlung',
        inputValidation: {
          stockPriceRequired: 'Aktienkurs ist erforderlich',
          strikePriceRequired: 'Ausübungspreis ist erforderlich',
          premiumRequired: 'Optionsprämie ist erforderlich',
          invalidNumber: 'Bitte geben Sie eine gültige Zahl ein',
          negativeValue: 'Wert kann nicht negativ sein'
        }
      },

      // Common
      common: {
        loading: 'Laden...',
        error: 'Fehler',
        success: 'Erfolg',
        cancel: 'Abbrechen',
        save: 'Speichern',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        view: 'Anzeigen',
        back: 'Zurück',
        next: 'Weiter',
        previous: 'Zurück',
        close: 'Schließen',
        open: 'Öffnen',
        refresh: 'Aktualisieren',
        search: 'Suchen',
        filter: 'Filtern',
        export: 'Exportieren',
        import: 'Importieren',
        download: 'Herunterladen',
        upload: 'Hochladen',
        language: 'Sprache'
      },

      // Table headers and data
      table: {
        symbol: 'Symbol',
        description: 'Beschreibung',
        quantity: 'Menge',
        price: 'Preis',
        amount: 'Betrag',
        currency: 'Währung',
        date: 'Datum',
        type: 'Typ',
        category: 'Kategorie',
        commission: 'Provision',
        code: 'Code',
        noData: 'Keine Daten verfügbar'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
