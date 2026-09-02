/* ==========================================================================
   CONFIGURATION OBJECT
   ========================================================================== */
const CONFIG = {
    // Personalization
    name: "BABAI",
    
    // Countdown Target Date (YYYY-MM-DDTHH:mm:ss)
    birthdayDate: "2026-09-24T00:00:00",
    
    // Direct File Names (Same folder as index.html)
    music: "music.mp3",
    video: "video.mp4",
    photos: [
        "photo1.jpg",
        "photo2.jpg",
        "photo3.jpg",
        "photo4.jpg"
    ],
    photoCaptions: [
        "Some moments are unforgettable. ❤️",
        "Every second with you is precious. ✨",
        "Your smile brightens my entire world. 🌹",
        "Looking forward to a lifetime of memories. ❤️"
    ],
    finalPhoto: "final.jpg",

    // Editable Text Sections
    introText: "কিছু দিনের অপেক্ষা, বাবাই... ❤️",
    introSubText: "তোমার সাথে সবসময় আছি,\nআর সবসময় থাকবো। ❤️",
    
    emotionalMessage: "বাবাই... ❤️\nআর একটু অপেক্ষা...\nতোমার জন্য একটা ছোট্ট surprise\nঅপেক্ষা করছে।",
    
    waitingText: "আর একটু অপেক্ষা করো, বাবাই... ❤️",
    
    birthdayMessage: `বাবাই,
কিছু কিছু মানুষ জীবনে এসে
জীবনটাকেই একটু বেশি সুন্দর করে দেয়।
তুমি আমার কাছে ঠিক তেমনই একজন।
তোমার সাথে সবসময় আছি
আর সবসময় থাকবো।
তোমার হাসিটা সবসময় এমনই থাকুক,
আর তোমার জীবনের প্রতিটা দিন
সুখে ভরে উঠুক।
শুভ জন্মদিন, বাবাই। ❤️`,

    // Music Behavior Settings
    pauseMusicDuringVideo: true,
    resumeMusicAfterVideo: true
};

/* ==========================================================================
   STATE MANAGEMENT
   ========================================================================== */
const STATES = {
    WELCOME: 'secWelcome',
    MEMORIES: 'secMemories',
    MESSAGE: 'secEmotionalMessage',
    COUNTDOWN: 'secCountdown',
    VIDEO: 'secVideo',
    BIRTHDAY: 'secBirthday',
    FINAL: 'secFinal'
};

let currentPhotoIndex = 0;
let countdownTimer = null;
let isAudioPlaying = false;

/* ==========================================================================
   DOM ELEMENTS
   ========================================================================== */
const bgMusic = document.getElementById('bgMusic');
const audioControls = document.getElementById('audioControls');
const musicToggleBtn = document.getElementById('musicToggleBtn');
const iconPlaying = document.getElementById('iconPlaying');
const iconPaused = document.getElementById('iconPaused');

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initContent();
    initParticles();
    setupEventListeners();
});

function initContent() {
    document.getElementById('introText').textContent = CONFIG.introText;
    document.getElementById('introSubText').textContent = CONFIG.introSubText;
    document.getElementById('emotionalMessageText').textContent = CONFIG.emotionalMessage;
    document.getElementById('waitingText').textContent = CONFIG.waitingText;
    document.getElementById('recipientName').textContent = `${CONFIG.name} ❤️`;
    document.getElementById('birthdayMessage').textContent = CONFIG.birthdayMessage;
    document.getElementById('finalPhoto').src = CONFIG.finalPhoto;
    
    bgMusic.src = CONFIG.music;
}

function setupEventListeners() {
    document.getElementById('btnBegin').addEventListener('click', startExperience);
    document.getElementById('btnNextPhoto').addEventListener('click', nextPhoto);
    document.getElementById('btnToCountdown').addEventListener('click', showCountdown);
    document.getElementById('btnToFinal').addEventListener('click', showFinalPhoto);
    document.getElementById('btnReplay').addEventListener('click', replayExperience);
    musicToggleBtn.addEventListener('click', toggleMusic);
}

/* ==========================================================================
   NAVIGATION & FLOW CONTROLLER
   ========================================================================== */
function transitionTo(targetSectionId) {
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(sec => {
        sec.classList.remove('active');
        setTimeout(() => {
            if (!sec.classList.contains('active')) {
                sec.classList.add('hidden');
            }
        }, 800);
    });

    const target = document.getElementById(targetSectionId);
    target.classList.remove('hidden');
    setTimeout(() => {
        target.classList.add('active');
    }, 50);
}

function startExperience() {
    startMusic();
    audioControls.classList.remove('hidden');
    currentPhotoIndex = 0;
    showPhoto(currentPhotoIndex);
    transitionTo(STATES.MEMORIES);
}

/* ==========================================================================
   AUDIO SYSTEM
   ========================================================================== */
function startMusic() {
    bgMusic.play().then(() => {
        isAudioPlaying = true;
        updateAudioIcons();
    }).catch(err => {
        console.log("Audio autoplay prevented:", err);
    });
}

function toggleMusic() {
    if (isAudioPlaying) {
        bgMusic.pause();
        isAudioPlaying = false;
    } else {
        bgMusic.play();
        isAudioPlaying = true;
    }
    updateAudioIcons();
}

function updateAudioIcons() {
    if (isAudioPlaying) {
        iconPlaying.classList.remove('hidden');
        iconPaused.classList.add('hidden');
    } else {
        iconPlaying.classList.add('hidden');
        iconPaused.classList.remove('hidden');
    }
}

/* ==========================================================================
   PHOTO MEMORIES SYSTEM
   ========================================================================== */
function showPhoto(index) {
    if (index >= CONFIG.photos.length) {
        transitionTo(STATES.MESSAGE);
        return;
    }
    
    const photoImg = document.getElementById('memoryPhoto');
    const stageBg = document.getElementById('photoStageBackground');
    const caption = document.getElementById('photoCaption');
    
    photoImg.style.transform = 'scale(1.05)';
    photoImg.style.opacity = '0.3';
    
    setTimeout(() => {
        photoImg.src = CONFIG.photos[index];
        stageBg.style.backgroundImage = `url('${CONFIG.photos[index]}')`;
        caption.textContent = CONFIG.photoCaptions[index] || '';
        
        photoImg.style.transform = 'scale(1)';
        photoImg.style.opacity = '1';
    }, 300);
}

function nextPhoto() {
    currentPhotoIndex++;
    if (currentPhotoIndex < CONFIG.photos.length) {
        showPhoto(currentPhotoIndex);
    } else {
        transitionTo(STATES.MESSAGE);
    }
}

/* ==========================================================================
   COUNTDOWN & LOCK SYSTEM
   ========================================================================== */
function showCountdown() {
    transitionTo(STATES.COUNTDOWN);
    startCountdown();
}

function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    
    const targetTime = new Date(CONFIG.birthdayDate).getTime();

    function update() {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            clearInterval(countdownTimer);
            document.getElementById('cntDays').textContent = "00";
            document.getElementById('cntHours').textContent = "00";
            document.getElementById('cntMinutes').textContent = "00";
            document.getElementById('cntSeconds').textContent = "00";
            
            unlockVideo();
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById('cntDays').textContent = String(days).padStart(2, '0');
        document.getElementById('cntHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cntMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cntSeconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownTimer = setInterval(update, 1000);
}

/* ==========================================================================
   UNLOCKED VIDEO SYSTEM
   ========================================================================== */
function unlockVideo() {
    transitionTo(STATES.VIDEO);

    const container = document.getElementById('videoContainer');
    container.innerHTML = ''; 

    const videoElement = document.createElement('video');
    videoElement.src = CONFIG.video;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.playsInline = true;

    if (CONFIG.pauseMusicDuringVideo && isAudioPlaying) {
        bgMusic.pause();
    }

    videoElement.addEventListener('ended', handleVideoEnd);
    container.appendChild(videoElement);
    videoElement.play().catch(e => console.log("Video playback error:", e));
}

function handleVideoEnd() {
    if (CONFIG.resumeMusicAfterVideo && isAudioPlaying) {
        bgMusic.play();
    }
    showBirthdayReveal();
}

/* ==========================================================================
   REVEAL & FINAL STAGES
   ========================================================================== */
function showBirthdayReveal() {
    transitionTo(STATES.BIRTHDAY);
}

function showFinalPhoto() {
    transitionTo(STATES.FINAL);
}

function replayExperience() {
    if (countdownTimer) clearInterval(countdownTimer);
    
    // Clean video element completely
    const container = document.getElementById('videoContainer');
    container.innerHTML = '';
    
    currentPhotoIndex = 0;
    transitionTo(STATES.WELCOME);
}

/* ==========================================================================
   PARTICLE BACKGROUND CANVAS
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.2
    }));

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.y -= p.speedY;
            if (p.y < 0) p.y = height;
            
            ctx.fillStyle = `rgba(226, 192, 141, ${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    animate();
}
