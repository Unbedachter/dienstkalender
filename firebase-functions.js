// Firebase Datenbank-Funktionen für den Dienst-Kalender

// Benutzerdaten laden
async function loadUserDataFromFirebase(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            return userDoc.data();
        } else {
            // Standarddaten für neue Benutzer
            return {
                serviceTypes: [
                    {
                        id: '1',
                        name: 'Frühdienst',
                        startTime: '06:00',
                        endTime: '14:00',
                        workTimePercentage: 100,
                        changeTime: 15,
                        color: '#28a745',
                        isOnCall: false
                    },
                    {
                        id: '2',
                        name: 'Spätdienst',
                        startTime: '14:00',
                        endTime: '22:00',
                        workTimePercentage: 100,
                        changeTime: 15,
                        color: '#ffc107',
                        isOnCall: false
                    },
                    {
                        id: '3',
                        name: 'Nachtdienst',
                        startTime: '22:00',
                        endTime: '06:00',
                        workTimePercentage: 100,
                        changeTime: 20,
                        color: '#6f42c1',
                        isOnCall: false
                    }
                ],
                services: [],
                freeDays: [],
                overtimeHistory: {},
                salarySettings: {
                    basicSalary: 3000,
                    shiftAllowance: 200,
                    nightShiftBonus: 50,
                    sundayBonus: 25,
                    holidayBonus: 50,
                    sundayHolidayBonus: 75,
                    substituteBonus: 30,
                    overtimeHourlyRate: 25,
                    targetHoursPerMonth: 170,
                    vacationDaysPerYear: 30,
                    manualOvertimeHours: 0,
                    manualOvertimeMonth: '',
                    nightShiftStart: '22:00',
                    nightShiftEnd: '06:00',
                    federalState: 'HE',
                    customBasicItems: [],
                    customBonusItems: [],
                    customBenefitItems: []
                }
            };
        }
    } catch (error) {
        console.error('Fehler beim Laden der Benutzerdaten:', error);
        return null;
    }
}

// Benutzerdaten speichern
async function saveUserDataToFirebase(userId, userData) {
    try {
        await db.collection('users').doc(userId).set(userData);
        console.log('Benutzerdaten erfolgreich gespeichert');
        return true;
    } catch (error) {
        console.error('Fehler beim Speichern der Benutzerdaten:', error);
        return false;
    }
}

// iCal-Daten für Kalender-Abonnements generieren
async function generateICalForUser(userId) {
    try {
        const userData = await loadUserDataFromFirebase(userId);
        if (!userData) {
            return null;
        }

        const { serviceTypes, services, freeDays } = userData;
        
        let icalContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Dienst-Kalender//DE',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        // Helper function to escape iCal text content
        function escapeICalText(text) {
            if (!text) return '';
            return text
                .replace(/\\/g, '\\\\')
                .replace(/;/g, '\\;')
                .replace(/,/g, '\\,')
                .replace(/\n/g, '\\n')
                .replace(/\r/g, '\\r');
        }

        // Add services as events
        services.forEach(service => {
            const serviceType = serviceTypes.find(st => st.id === service.serviceTypeId);
            if (!serviceType) return;

            const startTime = new Date(`${service.date}T${serviceType.startTime}`);
            const endTime = new Date(`${service.date}T${serviceType.endTime}`);
            
            // Handle overnight shifts
            if (endTime <= startTime) {
                endTime.setDate(endTime.getDate() + 1);
            }

            const eventId = service.id;
            const summary = serviceType.name + (service.isSubstitute ? ' (E)' : '');
            const description = service.notes || '';
            const location = serviceType.address || '';

            // Ensure location is properly formatted and complete
            const formattedLocation = location.trim();

            icalContent.push(
                'BEGIN:VEVENT',
                `UID:${eventId}@dienst-kalender`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTSTART:${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTEND:${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `SUMMARY:${escapeICalText(summary)}`,
                `DESCRIPTION:${escapeICalText(description)}`,
                `LOCATION:${escapeICalText(formattedLocation)}`,
                'END:VEVENT'
            );
        });

        // Add free days as events
        freeDays.forEach(freeDay => {
            const startTime = new Date(`${freeDay.date}T00:00`);
            const endTime = new Date(`${freeDay.date}T23:59`);
            
            let summary = '';
            if (freeDay.type === 'vacation') {
                summary = 'Urlaub';
            } else if (freeDay.type === 'overtime') {
                summary = 'Überstundenfrei';
            }

            icalContent.push(
                'BEGIN:VEVENT',
                `UID:free-${freeDay.id}@dienst-kalender`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTSTART:${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTEND:${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `SUMMARY:${escapeICalText(summary)}`,
                `DESCRIPTION:${escapeICalText(freeDay.notes || '')}`,
                'END:VEVENT'
            );
        });

        icalContent.push('END:VCALENDAR');
        return icalContent.join('\r\n');
    } catch (error) {
        console.error('Fehler beim Generieren der iCal-Daten:', error);
        return null;
    }
}

// Benutzer registrieren
async function registerUserWithFirebase(username, password) {
    try {
        // Prüfe, ob es eine gültige E-Mail-Adresse ist
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(username)) {
            return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein' };
        }
        
        // Firebase Auth Benutzer erstellen
        const userCredential = await auth.createUserWithEmailAndPassword(username, password);
        const user = userCredential.user;
        
        // Benutzerdaten in Firestore speichern
        const userData = await loadUserDataFromFirebase(user.uid);
        await saveUserDataToFirebase(user.uid, userData);
        
        return { success: true, user: user };
    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        let errorMessage = 'Ein Fehler ist aufgetreten';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Diese E-Mail-Adresse wird bereits verwendet';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Das Passwort ist zu schwach (mindestens 6 Zeichen)';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Ungültige E-Mail-Adresse';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Benutzer anmelden
async function loginUserWithFirebase(username, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(username, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Fehler bei der Anmeldung:', error);
        let errorMessage = 'Anmeldung fehlgeschlagen';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Benutzer nicht gefunden';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Falsches Passwort';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Ungültige E-Mail-Adresse';
        }
        
        return { success: false, error: errorMessage };
    }
}

// Benutzer abmelden
async function logoutUserFromFirebase() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('Fehler bei der Abmeldung:', error);
        return { success: false, error: 'Abmeldung fehlgeschlagen' };
    }
}

// Aktuellen Benutzer abrufen
function getCurrentUser() {
    return auth.currentUser;
}

// Auth State Listener
auth.onAuthStateChanged(function(user) {
    if (user) {
        console.log('Benutzer ist angemeldet:', user.uid);
        // Hier können weitere Aktionen nach der Anmeldung ausgeführt werden
    } else {
        console.log('Kein Benutzer angemeldet');
        // Hier können Aktionen nach der Abmeldung ausgeführt werden
    }
}); 
