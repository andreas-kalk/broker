# 📊 Broker Analyzer

Eine moderne, professionelle Anwendung zur Analyse von Broker-Daten und automatischen Generierung steuerrelevanter Informationen für das deutsche KAP-Formular.

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/yourusername/broker-analyzer/ci-cd.yml?branch=main)
![Java](https://img.shields.io/badge/Java-17-orange)
![React](https://img.shields.io/badge/React-18-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Features

### 📈 **Datenanalyse**
- **Multi-Format CSV Parser** für verschiedene Broker (Interactive Brokers, Comdirect, etc.)
- **Automatische Sektionserkennung** und Datenklassifizierung
- **Flexible Datenstruktur** mit intelligenter Spalten-Zuordnung
- **Echtzeit-Datenvalidierung** und Bereinigung

### 💰 **Steueranalyse (KAP-Formular)**
- **FIFO-Algorithmus** für Kapitalertragsberechnung
- **Automatische Gewinn-/Verlustrechnung** mit Kommissionsberücksichtigung
- **Dividenden-Tracking** mit Quellensteuer-Erfassung
- **Export-ready Daten** für die deutsche Steuererklärung
- **Kurz-/Langfristige Kapitalerträge** Unterscheidung

### 🎨 **Moderne Benutzeroberfläche**
- **React 18** mit TypeScript und Material-UI
- **Responsive Design** für Desktop und Mobile
- **Dark/Light Theme** Support
- **Intuitive Navigation** mit strukturierten Bereichen
- **Real-time Data Visualization** mit Charts und Tabellen

### 🔧 **Backend-Architektur**
- **Spring Boot 3.x** mit Java 17
- **RESTful API** mit OpenAPI Documentation
- **Global Exception Handling** und Validation
- **Flexible CSV Processing Engine**
- **Memory-optimized** für große Datensätze

## 🏗️ Architektur

```
┌──────────────────┐    ┌──────────────────┐
│   Frontend       │    │    Backend       │
│   (React/TS)     │◄──►│  (Spring Boot)   │
│                  │    │                  │
│ ┌──────────────┐ │    │ ┌──────────────┐ │
│ │ Dashboard    │ │    │ │ Controllers  │ │
│ │ Tax Analysis │ │    │ │ Services     │ │
│ │ Data Explorer│ │    │ │ CSV Parser   │ │
│ │ Help & Codes │ │    │ │ Tax Engine   │ │
│ └──────────────┘ │    │ └──────────────┘ │
└──────────────────┘    └──────────────────┘
```

## 🚀 Quick Start

### Voraussetzungen

- **Java 17** oder höher
- **Node.js 18** oder höher
- **Maven 3.8+**
- **Git**

### Installation

1. **Repository klonen**
   ```bash
   git clone https://github.com/yourusername/broker-analyzer.git
   cd broker-analyzer
   ```

2. **Backend starten**
   ```bash
   cd broker-backend
   mvn spring-boot:run
   ```

3. **Frontend starten** (in einem neuen Terminal)
   ```bash
   cd broker-frontend
   npm install
   npm run dev
   ```

4. **Anwendung öffnen**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html

### Docker Deployment

```bash
# Mit Docker Compose
docker-compose up -d

# Oder einzeln
docker build -t broker-analyzer-backend ./broker-backend
docker build -t broker-analyzer-frontend ./broker-frontend
```

## 📋 Verwendung

### 1. **CSV-Datei hochladen**
- Navigieren Sie zum Dashboard
- Klicken Sie auf "CSV hochladen"
- Wählen Sie Ihre Broker-CSV-Datei aus
- Die Datei wird automatisch analysiert und strukturiert

### 2. **Daten erkunden**
- **Dashboard**: Übersicht aller wichtigen Metriken
- **Datenexplorer**: Detaillierte Ansicht aller Sektionen
- **Suchfunktion**: Filtern nach Sektionen und Inhalten

### 3. **Steueranalyse**
- Navigieren Sie zu "Steueranalyse"
- Wählen Sie das Steuerjahr (Standard: 2024)
- Exportieren Sie die KAP-Formular-ready Daten
- Nutzen Sie die automatischen Berechnungen für Ihre Steuererklärung

### 4. **Codes & Hilfe**
- Nachschlagewerk für Transaktionscodes
- Asset-Kategorien Erklärungen
- Detaillierte Anwendungshinweise

## 🛠️ Entwicklung

### Backend Development

```bash
cd broker-backend

# Tests ausführen
mvn test

# Build erstellen
mvn clean package

# Mit Profilen
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Frontend Development

```bash
cd broker-frontend

# Entwicklungsserver
npm run dev

# Build für Produktion
npm run build

# Tests ausführen
npm test

# Linting
npm run lint
```

### Code-Qualität

```bash
# Backend: SonarQube Analyse
mvn sonar:sonar

# Frontend: ESLint + Prettier
npm run lint:fix
npm run format
```

## 📁 Projektstruktur

### Backend (Spring Boot)
```
broker-backend/
├── src/main/java/com/kalk/broker/backend/
│   ├── config/           # Konfigurationsklassen
│   ├── controller/       # REST Controllers
│   ├── service/          # Business Logic
│   ├── csv/             # CSV Processing Engine
│   ├── pojo/            # Data Transfer Objects
│   └── exception/       # Exception Handling
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

### Frontend (React + TypeScript)
```
broker-frontend/
├── src/
│   ├── components/      # React Komponenten
│   ├── hooks/          # Custom React Hooks
│   ├── services/       # API Services
│   ├── utils/          # Utility Functions
│   ├── types/          # TypeScript Types
│   ├── theme/          # Material-UI Theme
│   └── config/         # App Konfiguration
├── public/
└── package.json
```

## 🔒 Sicherheit

- **Input Validation** auf Backend und Frontend
- **CORS-Konfiguration** für sicheren API-Zugriff
- **File Upload Limits** und Typ-Validierung
- **Error Handling** ohne sensitive Daten-Exposition
- **Dependency Scanning** mit GitHub Actions

## 🧪 Testing

### Backend Tests
```bash
# Unit Tests
mvn test

# Integration Tests
mvn verify

# Test Coverage
mvn jacoco:report
```

### Frontend Tests
```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

## 📊 Unterstützte Broker

| Broker | Status | Features |
|--------|--------|----------|
| Interactive Brokers | ✅ Vollständig | Alle Transaktionstypen |
| Comdirect | 🔄 In Entwicklung | Geplant für v2.0 |
| Trade Republic | 🔄 In Entwicklung | Geplant für v2.0 |
| Scalable Capital | 🔄 In Entwicklung | Geplant für v2.0 |

## 🤝 Contributing

1. Fork das Repository
2. Erstellen Sie einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add amazing feature'`)
4. Pushen Sie den Branch (`git push origin feature/amazing-feature`)
5. Öffnen Sie eine Pull Request

### Development Guidelines

- **Code Style**: ESLint (Frontend) + Checkstyle (Backend)
- **Commit Messages**: Conventional Commits
- **Testing**: Mindestens 80% Code Coverage
- **Documentation**: JavaDoc (Backend) + TSDoc (Frontend)

## 📈 Roadmap

### Version 2.0 (Q2 2025)
- [ ] Zusätzliche Broker-Unterstützung
- [ ] Portfolio-Performance Analytics
- [ ] API für Drittanbieter-Integration
- [ ] Mobile App (React Native)

### Version 2.1 (Q3 2025)
- [ ] Multi-Tenant-Unterstützung
- [ ] Cloud-Deployment (AWS/Azure)
- [ ] Advanced Reporting Features
- [ ] Automatische Steuererklärung-Integration

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/broker-analyzer/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/broker-analyzer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/broker-analyzer/discussions)

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 👥 Autoren

- **Ihr Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Danksagungen

- Material-UI Team für das exzellente Design System
- Spring Boot Community für das robuste Framework
- Alle Mitwirkenden und Beta-Tester

---

**⭐ Wenn Ihnen dieses Projekt gefällt, geben Sie ihm einen Stern auf GitHub! ⭐**
