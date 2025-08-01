# Dienstplan-Kalender

Eine moderne Web-Anwendung zur Verwaltung von Dienstplänen, Gehaltsberechnung und Arbeitszeiterfassung.

## 🚀 Features

- 📅 **Kalender-Ansicht** mit Dienstplan-Verwaltung
- 💰 **Gehaltsberechnung** mit Zuschlägen und Überstunden
- ⏰ **Stundenübersicht** mit Überstunden-Tracking
- 👥 **Benutzerverwaltung** mit Firebase Authentication
- ☁️ **Cloud-Synchronisation** mit Firebase Firestore
- 📱 **Responsive Design** für alle Geräte
- 📥 **iCal-Export** für Kalender-Import

## 🛠️ Setup

### 1. Firebase Projekt erstellen

1. Gehen Sie zu [Firebase Console](https://console.firebase.google.com/)
2. Erstellen Sie ein neues Projekt
3. Aktivieren Sie **Authentication** und **Firestore Database**
4. Kopieren Sie die Konfigurationsdaten in `firebase-config.js`

### 2. GitHub Repository

1. Erstellen Sie ein neues Repository auf GitHub
2. Laden Sie die Dateien hoch:
   ```
   index.html
   firebase-config.js
   firebase-functions.js
   README.md
   ```

### 3. GitHub Pages aktivieren

1. Gehen Sie zu Repository Settings
2. Scrollen Sie zu "Pages"
3. Wählen Sie "Deploy from a branch"
4. Wählen Sie "main" branch und "/ (root)"
5. Klicken Sie auf "Save"

## 📁 Dateien

- `index.html` - Hauptanwendung
- `firebase-config.js` - Firebase Konfiguration
- `firebase-functions.js` - Datenbank-Funktionen
- `README.md` - Diese Datei
- `ICAL_IMPORT_ANLEITUNG.md` - Anleitung für iCal-Import

## 🔧 Konfiguration

### Firebase Setup

1. **Authentication aktivieren:**
   - Email/Password aktivieren
   - Benutzerdefinierte Domains hinzufügen

2. **Firestore Database:**
   - Datenbank erstellen
   - Sicherheitsregeln konfigurieren

3. **Konfiguration aktualisieren:**
   - Ersetzen Sie die Platzhalter in `firebase-config.js`
   - Fügen Sie Ihre Firebase-Projekt-Daten hinzu

## 📥 iCal-Export

### Funktionen
- **Vollständige Adressen** werden korrekt exportiert
- **Alle Dienste** mit korrekten Zeiten
- **Notizen** in der Beschreibung
- **Ersatzdienste** markiert mit "(E)"

### Verwendung
1. Klicken Sie auf "📥 iCal-Datei herunterladen"
2. Die Datei wird automatisch heruntergeladen
3. Importieren Sie sie in Ihren Kalender

### Unterstützte Kalender
- ✅ Google Calendar
- ✅ iCloud Calendar
- ✅ Outlook
- ✅ Android Kalender
- ✅ Windows Kalender

## 🌐 Deployment

Die Anwendung wird automatisch über GitHub Pages bereitgestellt:
`https://ihr-username.github.io/dienstplan-kalender/`

## 📱 Mobile Optimierung

Die Anwendung ist bereits für mobile Geräte optimiert:
- Responsive Design
- Touch-optimierte Buttons
- Angepasste Schriftgrößen

## 🔒 Sicherheit

- Firebase Authentication für Benutzerverwaltung
- Firestore Security Rules für Datenzugriff
- Sichere Passwort-Authentifizierung

## 📞 Hilfe

### iCal-Import Probleme
- Siehe `ICAL_IMPORT_ANLEITUNG.md` für detaillierte Anleitung
- Prüfen Sie, ob die Adressen in den Diensttypen eingetragen sind

### Firebase Probleme
- Überprüfen Sie die Domain-Einstellungen
- Stellen Sie sicher, dass die Konfiguration korrekt ist

### GitHub Pages Probleme
- Warten Sie 5-10 Minuten nach dem ersten Deploy
- Überprüfen Sie die Repository-Einstellungen

## 🎉 Fertig!

Nach der Einrichtung haben Sie:
✅ **Vollständig funktionsfähige Dienstplan-Verwaltung**  
✅ **Automatische Gehaltsberechnung**  
✅ **iCal-Export mit vollständigen Adressen**  
✅ **Mobile-optimierte Benutzeroberfläche**  
✅ **Sichere Cloud-Synchronisation**  

Die Anwendung ist bereit für den produktiven Einsatz! 