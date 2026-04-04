// Video Player Page JavaScript

const video = document.getElementById('videoPlayer');
const playBtn = document.getElementById('playBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressInput = document.getElementById('progressInput');
const progressFill = document.getElementById('progressFill');
const timeDisplay = document.getElementById('timeDisplay');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const playerContainer = document.getElementById('playerContainer');

// Settings
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const qualitySubmenu = document.getElementById('qualitySubmenu');
const speedSubmenu = document.getElementById('speedSubmenu');

// Subtitles
const subtitleBtn = document.getElementById('subtitleBtn');
const subtitlesMenu = document.getElementById('subtitlesMenu');

// Keyboard shortcuts
const shortcutsContainer = document.getElementById('keyboardShortcuts');
const closeShortcutsBtn = document.getElementById('closeShortcuts');

document.addEventListener('DOMContentLoaded', () => {
    setupPlayerControls();
    setupSettingsMenu();
    setupSubtitlesMenu();
    setupKeyboardShortcuts();
    setupAutoHideControls();
    loadMovieInfo();
});

function setupPlayerControls() {
    // Play/Pause
    playBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);

    // Mute
    muteBtn.addEventListener('click', toggleMute);

    // Volume
    volumeSlider.addEventListener('input', (e) => {
        video.volume = e.target.value / 100;
        updateMuteButton();
    });

    // Progress
    video.addEventListener('timeupdate', updateProgress);
    progressInput.addEventListener('input', seek);

    // Fullscreen
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Video events
    video.addEventListener('play', () => {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });

    video.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    video.addEventListener('loadedmetadata', () => {
        progressInput.max = video.duration;
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', goBack);
}

function togglePlay() {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleMute() {
    if (video.muted) {
        video.muted = false;
        volumeSlider.value = 100;
    } else {
        video.muted = true;
        volumeSlider.value = 0;
    }
    updateMuteButton();
}

function updateMuteButton() {
    if (video.muted || video.volume === 0) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (video.volume < 0.5) {
        muteBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function updateProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressFill.style.width = percent + '%';
    progressInput.value = video.currentTime;
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
}

function seek(e) {
    const time = e.target.value;
    video.currentTime = time;
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        playerContainer.requestFullscreen().catch(() => {
            // Fallback for browsers that don't support fullscreen
            playerContainer.style.position = 'fixed';
            playerContainer.style.top = '0';
            playerContainer.style.left = '0';
            playerContainer.style.width = '100vw';
            playerContainer.style.height = '100vh';
            playerContainer.style.zIndex = '9999';
        });
    } else {
        document.exitFullscreen();
    }
}

function setupSettingsMenu() {
    settingsBtn.addEventListener('click', () => {
        settingsMenu.classList.toggle('active');
        subtitlesMenu.classList.remove('active');
    });

    // Settings items
    document.querySelectorAll('.settings-item').forEach(item => {
        item.addEventListener('click', () => {
            const setting = item.dataset.setting;
            if (setting === 'quality') {
                settingsMenu.style.display = 'none';
                qualitySubmenu.classList.add('active');
            } else if (setting === 'speed') {
                settingsMenu.style.display = 'none';
                speedSubmenu.classList.add('active');
            } else if (setting === 'help') {
                showKeyboardShortcuts();
                settingsMenu.classList.remove('active');
            }
        });
    });

    // Quality options
    document.querySelectorAll('.quality-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.quality-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Speed options
    document.querySelectorAll('.speed-option').forEach(option => {
        option.addEventListener('click', () => {
            const speed = parseFloat(option.dataset.speed);
            video.playbackRate = speed;
            
            document.querySelectorAll('.speed-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });

    // Submenu back buttons
    document.querySelectorAll('.submenu-back').forEach(backBtn => {
        backBtn.addEventListener('click', () => {
            qualitySubmenu.classList.remove('active');
            speedSubmenu.classList.remove('active');
            settingsMenu.classList.add('active');
        });
    });
}

function setupSubtitlesMenu() {
    subtitleBtn.addEventListener('click', () => {
        subtitlesMenu.classList.toggle('active');
        settingsMenu.classList.remove('active');
    });

    document.querySelectorAll('.subtitles-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.subtitles-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            const lang = option.dataset.lang;
            // In a real app, this would load subtitles in the selected language
            console.log(`Subtitles changed to: ${lang}`);
        });
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target === document.body || e.target === playerContainer) {
            switch(e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'f':
                    toggleFullscreen();
                    break;
                case 'm':
                    toggleMute();
                    break;
                case 'arrowright':
                    video.currentTime = Math.min(video.currentTime + 5, video.duration);
                    break;
                case 'arrowleft':
                    video.currentTime = Math.max(video.currentTime - 5, 0);
                    break;
                case 'j':
                    video.currentTime = Math.max(video.currentTime - 10, 0);
                    break;
                case 'l':
                    video.currentTime = Math.min(video.currentTime + 10, video.duration);
                    break;
                case 'c':
                    subtitlesMenu.classList.toggle('active');
                    break;
                case '?':
                    showKeyboardShortcuts();
                    break;
                default:
                    // Numbers 0-9 for timeline jump
                    if (e.key >= '0' && e.key <= '9') {
                        const percent = parseInt(e.key) / 10;
                        video.currentTime = video.duration * percent;
                    }
            }
        }
    });

    closeShortcutsBtn.addEventListener('click', hideKeyboardShortcuts);
}

function showKeyboardShortcuts() {
    shortcutsContainer.style.display = 'flex';
    shortcutsContainer.classList.add('active');
}

function hideKeyboardShortcuts() {
    shortcutsContainer.style.display = 'none';
    shortcutsContainer.classList.remove('active');
}

function setupAutoHideControls() {
    let controlsTimeout;
    
    document.addEventListener('mousemove', () => {
        clearTimeout(controlsTimeout);
        
        if (!video.paused) {
            // Controls will be hidden after 3 seconds of no mouse movement
            controlsTimeout = setTimeout(() => {
                // CSS handles the hiding via .player-container:not(:hover) selector
            }, 3000);
        }
    });

    playerContainer.addEventListener('mouseleave', () => {
        clearTimeout(controlsTimeout);
    });
}

function loadMovieInfo() {
    // Load from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('movieId');

    // Sample data
    const movieData = {
        title: 'Big Buck Bunny',
        description: 'Um vídeo de demonstração que mostra um pequeno coelho branco em sua luta contra uma floresta malvada em busca de vingança.'
    };

    document.getElementById('movieTitle').textContent = movieData.title;
    document.getElementById('movieDescription').textContent = movieData.description;
}

function goBack() {
    window.history.back();
}
