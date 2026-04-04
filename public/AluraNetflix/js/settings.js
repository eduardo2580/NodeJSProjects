// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupParentalControls();
});

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings')) || getDefaultSettings();
    
    // Load all toggles
    document.getElementById('darkmode').checked = settings.darkMode;
    document.getElementById('autoplay').checked = settings.autoplay;
    document.getElementById('autofill').checked = settings.autoFillSubtitles;
    document.getElementById('notif-new').checked = settings.notifications.newReleases;
    document.getElementById('notif-suggest').checked = settings.notifications.recommendations;
    document.getElementById('notif-download').checked = settings.notifications.downloads;
    document.getElementById('data-collection').checked = settings.dataCollection;
    document.getElementById('wifi-only').checked = settings.wifiOnly;
    document.getElementById('high-contrast').checked = settings.accessibility.highContrast;
    document.getElementById('parental-lock').checked = settings.parentalControl.enabled;
    
    // Load all selects
    document.getElementById('language').value = settings.language;
    document.getElementById('subtitle-lang').value = settings.subtitleLanguage;
    document.getElementById('quality').value = settings.videoQuality;
    document.getElementById('audio').value = settings.audioPreference;
    document.getElementById('content-rating').value = settings.parentalControl.contentRating;
    document.getElementById('text-size').value = settings.accessibility.textSize;
}

function getDefaultSettings() {
    return {
        darkMode: true,
        autoplay: true,
        autoFillSubtitles: false,
        language: 'pt-BR',
        subtitleLanguage: 'pt-BR',
        videoQuality: 'auto',
        audioPreference: 'dolby',
        notifications: {
            newReleases: true,
            recommendations: true,
            downloads: true
        },
        dataCollection: true,
        wifiOnly: true,
        parentalControl: {
            enabled: false,
            pin: null,
            contentRating: 'all'
        },
        accessibility: {
            highContrast: false,
            textSize: 'normal'
        }
    };
}

function setupParentalControls() {
    const parentalLock = document.getElementById('parental-lock');
    const pinSection = document.getElementById('PIN-section');
    
    parentalLock.addEventListener('change', (e) => {
        if (e.target.checked) {
            pinSection.style.display = 'block';
        } else {
            pinSection.style.display = 'none';
        }
    });
}

function saveSettings() {
    const settings = {
        darkMode: document.getElementById('darkmode').checked,
        autoplay: document.getElementById('autoplay').checked,
        autoFillSubtitles: document.getElementById('autofill').checked,
        language: document.getElementById('language').value,
        subtitleLanguage: document.getElementById('subtitle-lang').value,
        videoQuality: document.getElementById('quality').value,
        audioPreference: document.getElementById('audio').value,
        notifications: {
            newReleases: document.getElementById('notif-new').checked,
            recommendations: document.getElementById('notif-suggest').checked,
            downloads: document.getElementById('notif-download').checked
        },
        dataCollection: document.getElementById('data-collection').checked,
        wifiOnly: document.getElementById('wifi-only').checked,
        parentalControl: {
            enabled: document.getElementById('parental-lock').checked,
            pin: document.getElementById('parental-pin').value || null,
            contentRating: document.getElementById('content-rating').value
        },
        accessibility: {
            highContrast: document.getElementById('high-contrast').checked,
            textSize: document.getElementById('text-size').value
        }
    };

    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

function viewPrivacy() {
    alert('Política de Privacidade Netflix:\n\nNós coletamos dados para melhorar sua experiência...');
}

function viewTerms() {
    alert('Termos de Serviço Netflix:\n\nAo usar nossa plataforma, você concorda com nossos termos...');
}
