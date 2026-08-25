/**
 * ==========================================================================
 * ROMANTIC SINGLE-PAGE APPLICATION - PHASE 3 SCRIPT
 * Centralized Content Configuration, Polaroid Image Pipeline & Easter Eggs
 * ==========================================================================
 */

/* ==========================================================================
   GLOBAL APPLICATION CONFIGURATION (CUSTOMIZE ALL CONTENT HERE)
   ========================================================================== */
const APP_CONFIG = {
    // 1. Anniversary / First Met Date for Live Counter (Year, Month [0-indexed], Day, Hour, Min, Sec)
    startDate: new Date(2024, 0, 10, 22, 25, 0),

    // 2. Intro Envelope Note
    introLetter: {
        salutation: "Dearest [Name],",
        body: "Ever since we first met, {TIMER} ago, my world has been so much brighter. I wanted to make you this special website to ask perhaps the most important question of your life.",
        signOff: "Love always,\n[Name]"
    },

    // 3. 3D Polaroid Memories (7 Moments with 3 displayed per circular shuffle)
    moments: [
        {
            id: 1,
            image: "assets/images/moments/Moments-1.jpeg",
            title: "Too Spicy For Us HAHA",
            story: "Food we bought but too spicy for us HAHA. And I was so nervous and busy talking to you, I couldn't focus on the food at all. The food was not the focus anyways. You were. And you looked so cute when you smiled at my bad jokes. Hehehe.",
            badge: "Chapter 1"
        },
        {
            id: 2,
            image: "assets/images/moments/moments-2.jpeg",
            title: "Rolling The Beads",
            story: "This... I know you just gave it to me because you felt bad for not getting me anything. But honestly, whenever I am outside and I miss you, I hold this keychain and roll the beads. And, for some reason, it calms me a bit. As if you are right there with me.",
            badge: "Chapter 2"
        },
        {
            id: 3,
            image: "assets/images/moments/moments-3.jpeg",
            title: "Scam Roses, Real Love",
            story: "Roses are red, violets are blue. These roses were technically a scam but at least it won your heart. (It didn't rhyme but what to do, I am not THAT good with my words bhahaha contrary to popular belief). But at least you loved them. I will do an even better job next time. BIGGER BOUQUET, MORE ROSES. LETS GOO!",
            badge: "Chapter 3"
        },
        {
            id: 4,
            image: "assets/images/moments/moments-4.jpeg",
            title: "Heart Attack in the Car",
            story: "OMG GURL you gave me a heart attack. YOUR STEP FATHER CAME OUT. WHAT WAS I SUPPOSED TO DOOO? Give salam or like, hide BRUH! But it was a thrilling experience. Just not good enough to do it again LOL.",
            badge: "Chapter 4"
        },
        {
            id: 5,
            image: "assets/images/moments/moments-5.jpeg",
            title: "Cici & Dessert",
            story: "Heheheheheheh. Cici went from not wanting to feed me, to feeding me dessert HAHAHAHAHHA. Honestly, that felt so intimate... I love you.",
            badge: "Chapter 5"
        },
        {
            id: 6,
            image: "assets/images/moments/moments-6.jpeg",
            title: "11/10 Hand Holding",
            story: "HEHEHEHEHEH, FIRST TIME HOLDING HANDS TOGETHER HAHAHAHAHA. OMG SOOO CUTEEEEEEEEE. 11/10, would hold your hand until the day I die.",
            badge: "Chapter 6"
        },
        {
            id: 7,
            image: "assets/images/moments/moments-7.jpeg",
            title: "When I Fell In Love",
            story: "I think around this moment, I realized that I fell in love with you. As I missed my train and watched you go home, I wanted to run back to you. I wanted to hold you again. I wanted to kiss you... I wanted to tell you, face to face, that I love you, and despite only knowing you for 4 days at the time, I wanted to spend my life with you...",
            badge: "Chapter 7"
        }
    ],

    // 4. Scratch-Off Vouchers
    vouchers: [
        {
            id: 1,
            title: "Get Out of an Argument",
            description: "Valid for one instant win during any disagreement. No questions asked!",
            uses: "1",
            badge: "🕊️"
        },
        {
            id: 2,
            title: "Late Night Food Run",
            description: "Good for one spontaneous 2 AM snack trip to wherever you want.",
            uses: "Unlimited",
            badge: "🍟"
        },
        {
            id: 3,
            title: "Unlimited Warm Hugs",
            description: "Redeemable anytime for a long, tight hug when you need it most.",
            uses: "Infinity",
            badge: "🤗"
        },
        {
            id: 4,
            title: "Movie Choice Night",
            description: "You get total control of the remote and movie pick, plus popcorn!",
            uses: "3",
            badge: "🎬"
        },
        {
            id: 5,
            title: "Full Massage & Pamper",
            description: "30 minutes of head, back, or foot massage to melt away stress.",
            uses: "2",
            badge: "💆"
        }
    ],

    // 5. Final Double-Page Letter
    finalLetter: {
        salutation: "Dearest [Name],",
        page1: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        ],
        page2: [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "P.S. I love you more than words could ever describe."
        ],
        signOff: "Yours forever and evermore,\n[Name]"
    },

    // 6. Outro Screen
    finalOutro: {
        paragraphs: [
            "Thank you for taking the time to explore this website. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        ],
        buttonText: "Go back to start ♡"
    }
};

(function () {
    'use strict';

    /* ==========================================================================
       1. WEB AUDIO SOUND FX & AMBIENT CHIME ENGINE
       ========================================================================== */
    class SoundEngine {
        constructor() {
            this.audioCtx = null;
            this.enabled = localStorage.getItem('sound_enabled') !== 'false';
            this.initUI();
        }

        initContext() {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.audioCtx = new AudioContext();
                }
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        initUI() {
            const toggleBtn = document.getElementById('audio-toggle-btn');
            const icon = document.getElementById('audio-icon');
            const label = document.getElementById('audio-label');

            const updateDisplay = () => {
                if (icon && label) {
                    icon.textContent = this.enabled ? '🎵' : '🔇';
                    label.textContent = this.enabled ? 'Sound FX: ON' : 'Sound FX: OFF';
                }
            };

            updateDisplay();

            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    this.enabled = !this.enabled;
                    localStorage.setItem('sound_enabled', this.enabled ? 'true' : 'false');
                    updateDisplay();
                    if (this.enabled) {
                        this.initContext();
                        this.playChime([523.25, 659.25, 783.99], 0.08); // C - E - G
                    }
                });
            }
        }

        playTone(freq, type = 'sine', duration = 0.25, volume = 0.09) {
            if (!this.enabled) return;
            try {
                this.initContext();
                if (!this.audioCtx) return;

                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

                gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start();
                osc.stop(this.audioCtx.currentTime + duration);
            } catch (e) {
                // Audio context blocked or unsupported
            }
        }

        playChime(notes = [523.25, 659.25, 783.99, 1046.50], delay = 0.07) {
            if (!this.enabled) return;
            this.initContext();
            notes.forEach((note, index) => {
                setTimeout(() => {
                    this.playTone(note, 'triangle', 0.35, 0.1);
                }, index * (delay * 1000));
            });
        }

        playPaperSlide() {
            if (!this.enabled) return;
            this.playTone(480, 'sine', 0.15, 0.12);
            setTimeout(() => this.playChime([659.25, 880.00, 1046.50], 0.06), 80);
        }

        playMagic() {
            if (!this.enabled) return;
            const arpeggio = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51];
            this.playChime(arpeggio, 0.05);
        }
    }

    const sound = new SoundEngine();

    /* ==========================================================================
       2. OPTIMIZED ZERO-LAG CANVAS PARTICLE ENGINE (60 FPS + POOLING)
       ========================================================================== */
    class ParticleEngine {
        constructor() {
            this.canvas = document.getElementById('bg-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particlePool = [];
            this.isMobile = window.innerWidth < 768;
            // Increased floating particle count by 25% (Mobile: 30, Desktop: 60)
            this.maxAmbientParticles = this.isMobile ? 30 : 60;
            this.mouse = { x: -1000, y: -1000, active: false };
            this.colors = ['#ff8da1', '#ff6b85', '#ffb6c1', '#AFCBFF', '#FFE4E1', '#FFD700', '#db4e4e'];
            this.isRunning = true;

            this.resize();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 768;
                this.maxAmbientParticles = this.isMobile ? 30 : 60;
                this.resize();
            });

            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.mouse.active = true;
            }, { passive: true });

            window.addEventListener('mouseleave', () => {
                this.mouse.active = false;
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    this.mouse.x = e.touches[0].clientX;
                    this.mouse.y = e.touches[0].clientY;
                    this.mouse.active = true;
                }
            }, { passive: true });

            window.addEventListener('touchend', () => {
                this.mouse.active = false;
            });

            document.addEventListener('visibilitychange', () => {
                this.isRunning = !document.hidden;
                if (this.isRunning) {
                    requestAnimationFrame(this.animate);
                }
            });

            for (let i = 0; i < this.maxAmbientParticles; i++) {
                this.particles.push(this.spawnAmbientParticle(true));
            }

            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.scale(dpr, dpr);
        }

        getParticleFromPool() {
            return this.particlePool.length > 0 ? this.particlePool.pop() : {};
        }

        releaseParticleToPool(p) {
            if (this.particlePool.length < 150) {
                this.particlePool.push(p);
            }
        }

        spawnAmbientParticle(randomY = false) {
            const p = this.getParticleFromPool();
            const isHeart = Math.random() > 0.35;
            p.type = isHeart ? 'heart' : 'sparkle';
            p.x = Math.random() * this.width;
            p.y = randomY ? Math.random() * this.height : this.height + Math.random() * 20;
            p.size = isHeart ? Math.random() * 8 + 6 : Math.random() * 3 + 2;
            p.baseSpeed = Math.random() * 0.2 + 0.25; // Strictly constant 0.25px - 0.45px per frame
            p.vx = 0;
            p.vy = p.baseSpeed;
            p.angle = Math.random() * Math.PI * 2;
            p.angleSpeed = Math.random() * 0.008 + 0.003;
            p.waveAmplitude = Math.random() * 0.5 + 0.2;
            p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            p.alpha = Math.random() * 0.38 + 0.22;
            p.isBurst = false;
            return p;
        }

        spawnBurstParticle(x, y, type = 'confetti') {
            const p = this.getParticleFromPool();
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5.5 + 2;
            p.type = type;
            p.x = x;
            p.y = y;
            p.size = type === 'heart' ? Math.random() * 12 + 8 : Math.random() * 5 + 3;
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed - 2.2;
            p.gravity = 0.11;
            p.friction = 0.95;
            p.rotation = Math.random() * 360;
            p.rotationSpeed = (Math.random() - 0.5) * 8;
            p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            p.alpha = 1;
            p.decay = Math.random() * 0.02 + 0.016;
            p.isBurst = true;
            return p;
        }

        burst(x, y, count = 28, type = 'mixed') {
            const targetX = x !== undefined ? x : this.width / 2;
            const targetY = y !== undefined ? y : this.height / 2;
            const burstCount = this.isMobile ? Math.min(count, 22) : count;

            for (let i = 0; i < burstCount; i++) {
                let pType = type;
                if (type === 'mixed') {
                    pType = Math.random() > 0.5 ? 'heart' : 'sparkle';
                }
                this.particles.push(this.spawnBurstParticle(targetX, targetY, pType));
            }
        }

        drawHeart(x, y, size, color, alpha, rotation = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            if (rotation) this.ctx.rotate((rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, alpha);
            this.ctx.fillStyle = color;

            this.ctx.beginPath();
            const topCurveHeight = size * 0.3;
            this.ctx.moveTo(0, topCurveHeight);
            this.ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, size / 3, 0, size);
            this.ctx.bezierCurveTo(size, size / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

        drawSparkle(x, y, size, color, alpha, rotation = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            if (rotation) this.ctx.rotate((rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, alpha);
            this.ctx.fillStyle = color;

            this.ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                this.ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
                this.ctx.lineTo(
                    Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35),
                    Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.35)
                );
            }
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }

        drawConfetti(x, y, size, color, alpha, rotation = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate((rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, alpha);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(-size / 2, -size / 4, size, size / 2);
            this.ctx.restore();
        }

        animate() {
            if (!this.isRunning) return;

            this.ctx.clearRect(0, 0, this.width, this.height);

            const mouseRadius = 110;
            const mouseRadiusSq = mouseRadius * mouseRadius;

            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];

                if (p.isBurst) {
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.speedX *= p.friction;
                    p.speedY *= p.friction;
                    p.speedY += p.gravity;
                    p.rotation += p.rotationSpeed;
                    p.alpha -= p.decay;

                    if (p.type === 'heart') {
                        this.drawHeart(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
                    } else if (p.type === 'sparkle') {
                        this.drawSparkle(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
                    } else {
                        this.drawConfetti(p.x, p.y, p.size, p.color, p.alpha, p.rotation);
                    }

                    if (p.alpha <= 0 || p.y > this.height + 50) {
                        this.releaseParticleToPool(p);
                        this.particles.splice(i, 1);
                    }
                } else {
                    // Constant-speed linear upward movement + gentle sine wave (Zero Acceleration)
                    p.angle += p.angleSpeed;
                    p.x += Math.sin(p.angle) * p.waveAmplitude + p.vx;
                    p.y -= p.vy;

                    // Immediately damp velocity offsets back to baseline
                    p.vx *= 0.92;
                    p.vy = p.baseSpeed + (p.vy - p.baseSpeed) * 0.92;

                    // Gentle mouse repulsion
                    if (this.mouse.active) {
                        const dx = p.x - this.mouse.x;
                        const dy = p.y - this.mouse.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < mouseRadiusSq && distSq > 0) {
                            const dist = Math.sqrt(distSq);
                            const force = (1 - dist / mouseRadius) * 0.8;
                            p.vx += (dx / dist) * force;
                            p.vy += (dy / dist) * force * 0.2;
                        }
                    }

                    if (p.type === 'heart') {
                        this.drawHeart(p.x, p.y, p.size, p.color, p.alpha);
                    } else {
                        this.drawSparkle(p.x, p.y, p.size, p.color, p.alpha);
                    }

                    // Reset coordinates cleanly when floating off top
                    if (p.y < -30) {
                        p.y = this.height + Math.random() * 20;
                        p.x = Math.random() * this.width;
                        p.vx = 0;
                        p.vy = p.baseSpeed;
                        p.angle = Math.random() * Math.PI * 2;
                    }
                }
            }

            const ambientCount = this.particles.filter(p => !p.isBurst).length;
            if (ambientCount < this.maxAmbientParticles) {
                this.particles.push(this.spawnAmbientParticle(false));
            }

            requestAnimationFrame(this.animate);
        }
    }

    const particleEngine = new ParticleEngine();

    /* ==========================================================================
       3. SINGLE-PAGE APPLICATION (SPA) ROUTER & STATE MACHINE
       ========================================================================== */
    const SCREENS = {
        'intro': 'screen-intro',
        'question': 'screen-question',
        'no-choice': 'screen-no-choice',
        'yay': 'screen-yay',
        'letter': 'screen-letter',
        'moments': 'screen-moments',
        'coupons': 'screen-coupons',
        'final': 'screen-final'
    };

    let currentScreenId = 'screen-intro';

    function getScreenAlias(screenId) {
        for (const [alias, id] of Object.entries(SCREENS)) {
            if (id === screenId) return alias;
        }
        return 'intro';
    }

    function goToScreen(screenId, updateHash = true) {
        const targetScreen = document.getElementById(screenId);
        if (!targetScreen) return;

        const allScreens = document.querySelectorAll('.app-screen');
        allScreens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.add('active');
            } else {
                screen.classList.remove('active');
            }
        });

        currentScreenId = screenId;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (updateHash) {
            const alias = getScreenAlias(screenId);
            if (window.location.hash !== `#${alias}`) {
                history.pushState(null, '', `#${alias}`);
            }
        }

        onScreenEnter(screenId);
    }

    function onScreenEnter(screenId) {
        sound.playChime([587.33, 659.25, 783.99], 0.06);

        if (screenId === 'screen-yay') {
            particleEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 45, 'mixed');
        } else if (screenId === 'screen-moments') {
            initPolaroidMoments();
        } else if (screenId === 'screen-coupons') {
            initScratchCoupons();
        }
    }

    function handleHashChange() {
        const hash = window.location.hash.replace('#', '').trim();
        if (hash && SCREENS[hash]) {
            goToScreen(SCREENS[hash], false);
        } else {
            goToScreen('screen-intro', false);
        }
    }

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);

    /* ==========================================================================
       4. DYNAMIC CONTENT RENDERING PIPELINE (POPULATE FROM APP_CONFIG)
       ========================================================================== */
    function renderDynamicContent() {
        // 1. Populate Intro Letter Paper
        const introPaper = document.getElementById('intro-letter-paper');
        if (introPaper && APP_CONFIG.introLetter) {
            const salutation = APP_CONFIG.introLetter.salutation || 'Dearest,';
            const bodyText = (APP_CONFIG.introLetter.body || '').replace('{TIMER}', '<span id="timer">Calculating...</span>');
            const signOff = (APP_CONFIG.introLetter.signOff || '').replace(/\n/g, '<br>');

            introPaper.innerHTML = `
                <p>
                    ${salutation}
                    <br><br>
                    ${bodyText}
                    <br><br>
                    ${signOff}
                </p>
            `;
        }

        // 2. Populate Final Double-Page Letter
        const letterWrapper = document.getElementById('letter-dual-wrapper');
        if (letterWrapper && APP_CONFIG.finalLetter) {
            const page1Paragraphs = (APP_CONFIG.finalLetter.page1 || []).map(p => `<p>${p}</p>`).join('');
            const page2Paragraphs = (APP_CONFIG.finalLetter.page2 || []).map(p => `<p>${p}</p>`).join('');
            const signOff = (APP_CONFIG.finalLetter.signOff || '').replace(/\n/g, '<br>');

            letterWrapper.innerHTML = `
                <!-- Page 1 -->
                <article class="letter-page page-1">
                    <header>
                        <h2>${APP_CONFIG.finalLetter.salutation || 'Dearest,'}</h2>
                    </header>
                    ${page1Paragraphs}
                    <footer class="turn-page-note">(Letter continues on right...)</footer>
                </article>

                <!-- Page 2 -->
                <article class="letter-page page-2">
                    ${page2Paragraphs}
                    <p class="letter-signoff">
                        ${signOff}
                    </p>
                </article>
            `;
        }

        // 3. Populate Final Outro Screen
        const outroBox = document.getElementById('final-letter-box');
        if (outroBox && APP_CONFIG.finalOutro) {
            const paragraphs = (APP_CONFIG.finalOutro.paragraphs || []).map(p => `<p>${p}</p>`).join('');
            outroBox.innerHTML = `
                ${paragraphs}
                <button id="final-restart-btn" class="back-home-btn">
                    ${APP_CONFIG.finalOutro.buttonText || 'Go back to start ♡'}
                </button>
            `;

            const finalRestartBtn = document.getElementById('final-restart-btn');
            if (finalRestartBtn) {
                finalRestartBtn.addEventListener('click', () => {
                    goToScreen('screen-intro');
                });
            }
        }
    }

    /* ==========================================================================
       5. SCREEN 1: INTRO & LIVE COUNTER CONTROLLER
       ========================================================================== */
    let timerInterval = null;
    let envelopeOpened = false;

    function updateTimer() {
        const timerElement = document.getElementById("timer");
        if (!timerElement) return;

        const now = new Date().getTime();
        const start = APP_CONFIG.startDate ? APP_CONFIG.startDate.getTime() : new Date("January 10, 2026 22:25:00").getTime();
        const distance = now - start;

        let timeStr = "a little while";
        if (distance >= 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        timerElement.textContent = timeStr;
    }

    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        const envContainer = document.getElementById('envelope-container');
        const messageContent = document.getElementById('message-content');
        const proceedBtn = document.getElementById('intro-proceed-btn');

        if (envContainer && messageContent && proceedBtn) {
            const rect = envContainer.getBoundingClientRect();
            particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, 'sparkle');
            sound.playPaperSlide();

            envContainer.style.display = 'none';
            messageContent.style.display = 'flex';
            proceedBtn.style.display = 'inline-block';

            updateTimer();
            if (!timerInterval) {
                timerInterval = setInterval(updateTimer, 1000);
            }
        }
    }

    const envelopeContainer = document.getElementById('envelope-container');
    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', openEnvelope);
        envelopeContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEnvelope();
            }
        });
    }

    const introProceedBtn = document.getElementById('intro-proceed-btn');
    if (introProceedBtn) {
        introProceedBtn.addEventListener('click', () => {
            goToScreen('screen-question');
        });
    }

    /* ==========================================================================
       6. SCREEN 2 & 3: QUESTION & NO-CHOICE LOGIC
       ========================================================================== */
    const noMessages = [
        "Are you sure?",
        "Are you really sure?",
        "Pookie Please?",
        "Even Melody is sad!",
        "Please say yes!",
        "Last chance to say yes!"
    ];

    const sadGifs = [
        "assets/images/togepi-sad-1.gif",
        "assets/images/togepi-sad-2.gif",
        "assets/images/melody-sad-2.gif",
        "assets/images/melody-sad-3.gif"
    ];

    let noMessageIndex = 0;
    let yesButtonScale = 1;

    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const togepiGif = document.getElementById('togepi-gif');
    const noChoiceYesBtn = document.getElementById('no-choice-yes-btn');

    if (noBtn) {
        noBtn.addEventListener('click', () => {
            sound.playTone(330, 'sawtooth', 0.2, 0.08);

            if (noMessageIndex >= noMessages.length) {
                goToScreen('screen-no-choice');
                return;
            }

            noBtn.innerText = noMessages[noMessageIndex];

            if (togepiGif && sadGifs.length > 0) {
                togepiGif.src = sadGifs[noMessageIndex % sadGifs.length];
            }

            yesButtonScale += 0.25;
            if (yesBtn) {
                yesBtn.style.transform = `scale(${yesButtonScale})`;
            }

            noMessageIndex++;
        });
    }

    function handleYesClick(e) {
        sound.playMagic();
        const clientX = e ? e.clientX : window.innerWidth / 2;
        const clientY = e ? e.clientY : window.innerHeight / 2;
        particleEngine.burst(clientX, clientY, 50, 'mixed');
        goToScreen('screen-yay');
    }

    if (yesBtn) yesBtn.addEventListener('click', handleYesClick);
    if (noChoiceYesBtn) noChoiceYesBtn.addEventListener('click', handleYesClick);

    /* ==========================================================================
       7. SCREEN 4 & 5: CELEBRATION & DOUBLE-PAGE NAVIGATION
       ========================================================================== */
    const yayNextBtn = document.getElementById('yay-next-btn');
    if (yayNextBtn) {
        yayNextBtn.addEventListener('click', () => {
            goToScreen('screen-letter');
        });
    }

    const letterNextBtn = document.getElementById('letter-next-btn');
    if (letterNextBtn) {
        letterNextBtn.addEventListener('click', () => {
            goToScreen('screen-moments');
        });
    }

    /* ==========================================================================
       8. SCREEN 6: 3D POLAROID MEMORY GALLERY & IMAGE PIPELINE
       ========================================================================== */
    let momentStartIndex = 0;
    let momentsInitialized = false;

    function getVisibleMoments(startIndex) {
        const list = APP_CONFIG.moments && APP_CONFIG.moments.length > 0 ? APP_CONFIG.moments : [];
        const total = list.length;
        if (total === 0) return [];
        return [
            list[startIndex % total],
            list[(startIndex + 1) % total],
            list[(startIndex + 2) % total]
        ];
    }

    function updateShuffleCounter() {
        const counter = document.getElementById('counter');
        if (!counter) return;
        const total = APP_CONFIG.moments ? APP_CONFIG.moments.length : 7;
        const start = (momentStartIndex % total) + 1;
        const mid = ((momentStartIndex + 1) % total) + 1;
        const end = ((momentStartIndex + 2) % total) + 1;
        counter.innerText = `Viewing Chapters ${start}, ${mid}, ${end} of ${total} ↻`;
    }

    function initPolaroidMoments() {
        if (momentsInitialized) return;
        momentsInitialized = true;
        momentStartIndex = 0;
        updateShuffleCounter();
        renderPolaroidCards();
    }

    function handleImageFallback(img) {
        if (!img) return;
        const currentSrc = img.getAttribute('src') || '';
        if (currentSrc.endsWith('.jpg') && !img.dataset.triedJpeg) {
            img.dataset.triedJpeg = 'true';
            img.src = currentSrc.replace(/\.jpg$/i, '.jpeg');
        } else if (currentSrc.endsWith('.jpeg') && !img.dataset.triedJpg) {
            img.dataset.triedJpg = 'true';
            img.src = currentSrc.replace(/\.jpeg$/i, '.jpg');
        } else {
            img.classList.add('img-error');
        }
    }

    function renderPolaroidCards() {
        const grid = document.getElementById('polaroid-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const currentSet = getVisibleMoments(momentStartIndex);

        currentSet.forEach((moment, idx) => {
            const randomRotation = (Math.random() * 3.6 - 1.8).toFixed(1); // Organic subtle tilt

            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.style.transform = `rotate(${randomRotation}deg)`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Polaroid photo: ${moment.title}`);

            card.innerHTML = `
                <div class="polaroid-inner">
                    <div class="polaroid-front">
                        <div class="washi-tape" title="Touch washi tape for a sparkle! ✨"></div>
                        <div class="polaroid-photo-frame">
                            <!-- Graceful Image Pipeline with Fallback -->
                            <img src="${moment.image}" class="polaroid-img" alt="${moment.title}" onerror="handleImageFallback(this)">
                            <div class="polaroid-placeholder">
                                <div class="polaroid-emoji">📷</div>
                                <div class="placeholder-title">${moment.title}</div>
                                <span class="polaroid-tap-hint">Tap to Flip ♡</span>
                            </div>
                        </div>
                        <div class="polaroid-caption">${moment.title}</div>
                    </div>
                    <div class="polaroid-back">
                        <div class="polaroid-stamp">
                            <span>${moment.badge || `Chapter #${moment.id || idx + 1}`}</span>
                        </div>
                        <p>${moment.story}</p>
                    </div>
                </div>
            `;

            // Card Flip Event
            const toggleFlip = (e) => {
                if (e.target.closest('.washi-tape')) return;

                const isFlipped = card.classList.toggle('flipped');
                if (isFlipped) {
                    sound.playChime([659.25, 880.00], 0.07);
                    const rect = card.getBoundingClientRect();
                    particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18, 'sparkle');
                }
            };

            card.onclick = toggleFlip;
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip(e);
                }
            };

            // Easter Egg: Washi Tape Sparkle Interaction
            const tape = card.querySelector('.washi-tape');
            if (tape) {
                tape.addEventListener('click', (e) => {
                    e.stopPropagation();
                    sound.playTone(1046.50, 'triangle', 0.25, 0.12);
                    const rect = tape.getBoundingClientRect();
                    particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 14, 'sparkle');
                });
            }

            grid.appendChild(card);
        });
    }

    function handlePolaroidReshuffle() {
        const grid = document.getElementById('polaroid-grid');
        if (!grid) return;

        sound.playChime([440.00, 554.37, 659.25], 0.05);

        const total = APP_CONFIG.moments ? APP_CONFIG.moments.length : 7;
        momentStartIndex = (momentStartIndex + 3) % total;

        updateShuffleCounter();
        renderPolaroidCards();
    }

    const reshuffleBtn = document.getElementById('reshuffle-btn');
    if (reshuffleBtn) reshuffleBtn.addEventListener('click', handlePolaroidReshuffle);

    const momentsNextBtn = document.getElementById('moments-next-btn');
    if (momentsNextBtn) {
        momentsNextBtn.addEventListener('click', () => {
            goToScreen('screen-coupons');
        });
    }

    /* ==========================================================================
       9. SCREEN 7: INTERACTIVE HTML5 SCRATCH-OFF VOUCHERS (HIGH-DPI SCALED)
       ========================================================================== */
    const scratchedCouponSet = new Set();
    let scratchCouponsInitialized = false;

    function initScratchCoupons() {
        if (scratchCouponsInitialized) return;
        scratchCouponsInitialized = true;

        const grid = document.getElementById('scratch-coupons-grid');
        const nextBtn = document.getElementById('coupons-next-btn');
        if (!grid) return;

        const voucherList = APP_CONFIG.vouchers && APP_CONFIG.vouchers.length > 0 ? APP_CONFIG.vouchers : [];

        voucherList.forEach((coupon, index) => {
            const card = document.createElement('div');
            card.className = 'coupon-scratch-card';
            card.id = `scratch-card-${index}`;

            card.innerHTML = `
                <div class="coupon-reward">
                    <span class="reward-badge">${coupon.badge || '🎟️'}</span>
                    <div class="reward-title">${coupon.title}</div>
                    <div class="reward-desc">${coupon.description}</div>
                    <div class="reward-uses">Uses: ${coupon.uses}</div>
                </div>
                <canvas class="scratch-canvas" id="canvas-card-${index}"></canvas>
                <div class="scratch-instruction">✨ Scratch to Reveal ✨</div>
            `;

            grid.appendChild(card);
            setupScratchCanvas(card, index, voucherList.length);
        });
    }

    function setupScratchCanvas(card, index, totalVouchers) {
        const canvas = card.querySelector('.scratch-canvas');
        if (!canvas) return;

        // High-DPI Canvas Scaling for Crisp Text & Graphics
        const dpr = Math.min(window.devicePixelRatio || 1, 3);
        const rect = card.getBoundingClientRect();
        const width = rect.width || 300;
        const height = rect.height || 210;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        // Pastel foil gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#ff9ebb');
        grad.addColorStop(0.5, '#ff8da1');
        grad.addColorStop(1, '#ff6b85');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Patterned sparkle stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        for (let i = 0; i < 18; i++) {
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Crisp vector decorative foil text
        ctx.font = 'bold 15px "CustomFont", "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 4;
        ctx.fillText('✨ SPECIAL VOUCHER ✨', width / 2, height / 2 - 12);
        ctx.font = '600 13px "CustomFont", "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.fillText('(Scratch to Uncover)', width / 2, height / 2 + 12);
        ctx.shadowBlur = 0;

        let isDrawing = false;
        let isScratched = false;
        let strokeCount = 0;

        function scratch(e) {
            if (!isDrawing || isScratched) return;

            const cRect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = clientX - cRect.left;
            const y = clientY - cRect.top;

            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 22, 0, Math.PI * 2);
            ctx.fill();

            strokeCount++;
            if (strokeCount % 6 === 0) {
                checkClearance();
            }
        }

        function checkClearance() {
            if (isScratched) return;

            try {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                const stride = Math.max(16, Math.round(32 * dpr));
                let clearedPixels = 0;
                let totalSamples = 0;

                for (let i = 3; i < data.length; i += stride) {
                    totalSamples++;
                    if (data[i] === 0) {
                        clearedPixels++;
                    }
                }

                const ratio = clearedPixels / (totalSamples || 1);

                if (ratio >= 0.45) {
                    isScratched = true;
                    card.classList.add('scratched');
                    canvas.style.opacity = '0';
                    canvas.style.pointerEvents = 'none';

                    sound.playMagic();
                    const cardRect = card.getBoundingClientRect();
                    particleEngine.burst(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, 25, 'mixed');

                    scratchedCouponSet.add(index);

                    if (scratchedCouponSet.size === totalVouchers) {
                        const nextBtn = document.getElementById('coupons-next-btn');
                        if (nextBtn) {
                            nextBtn.style.display = 'inline-block';
                            sound.playMagic();
                            particleEngine.burst(window.innerWidth / 2, window.innerHeight - 70, 45, 'mixed');
                        }
                    }
                }
            } catch (err) {
                // Ignore canvas sampling security errors if local file protocol
            }
        }

        const startScratch = (e) => {
            isDrawing = true;
            scratch(e);
        };

        const stopScratch = () => {
            if (isDrawing) {
                isDrawing = false;
                checkClearance();
            }
        };

        canvas.addEventListener('mousedown', startScratch);
        window.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', stopScratch);

        canvas.addEventListener('touchstart', (e) => {
            startScratch(e);
        }, { passive: true });

        canvas.addEventListener('touchmove', (e) => {
            scratch(e);
        }, { passive: true });

        window.addEventListener('touchend', stopScratch);
    }

    const couponsNextBtn = document.getElementById('coupons-next-btn');
    if (couponsNextBtn) {
        couponsNextBtn.addEventListener('click', () => {
            goToScreen('screen-final');
        });
    }

    /* ==========================================================================
       10. EASTER EGGS & MICRO-INTERACTIONS
       ========================================================================== */
    function initEasterEggs() {
        // Top Surprise Button
        const easterEggBtn = document.getElementById('easter-egg-btn');
        if (easterEggBtn) {
            easterEggBtn.addEventListener('click', (e) => {
                sound.playMagic();
                const width = window.innerWidth;
                const height = window.innerHeight;
                particleEngine.burst(e.clientX, e.clientY, 30, 'heart');
                setTimeout(() => particleEngine.burst(width * 0.3, height * 0.35, 25, 'sparkle'), 120);
                setTimeout(() => particleEngine.burst(width * 0.7, height * 0.35, 25, 'mixed'), 240);
            });
        }

        // Bouncy Pixel Cats Easter Egg
        const cats = document.querySelectorAll('.easter-egg-cat');
        cats.forEach(cat => {
            cat.addEventListener('click', (e) => {
                cat.classList.remove('bouncing');
                void cat.offsetWidth; // Force CSS reflow to retrigger animation
                cat.classList.add('bouncing');

                sound.playMagic();
                const rect = cat.getBoundingClientRect();
                particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 'heart');
            });
        });

        // Togepi & Pikachu GIFs Tap Feedback
        document.querySelectorAll('#togepi-gif, #togepi-angry-gif, #yay-gif').forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', (e) => {
                sound.playTone(880, 'sine', 0.2, 0.08);
                particleEngine.burst(e.clientX, e.clientY, 15, 'sparkle');
            });
        });
    }

    /* ==========================================================================
       11. INITIALIZATION ON DOM READY
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        renderDynamicContent();
        initEasterEggs();
        handleHashChange();
    });

})();
