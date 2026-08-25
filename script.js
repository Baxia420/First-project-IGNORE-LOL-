/**
 * ==========================================================================
 * ROMANTIC SINGLE-PAGE APPLICATION - PHASE 2 SCRIPT
 * High-performance 60 FPS Canvas Particle Engine, Interactive Scratch Cards,
 * 3D Polaroid Memory Flip Gallery, and Physics Wax Seal Controller.
 * ==========================================================================
 */

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
            this.maxAmbientParticles = this.isMobile ? 24 : 48;
            this.mouse = { x: -1000, y: -1000, active: false };
            this.colors = ['#ff8da1', '#ff6b85', '#ffb6c1', '#AFCBFF', '#FFE4E1', '#FFD700', '#db4e4e'];
            this.isRunning = true;

            this.resize();
            window.addEventListener('resize', () => {
                this.isMobile = window.innerWidth < 768;
                this.maxAmbientParticles = this.isMobile ? 24 : 48;
                this.resize();
            });

            // Pointer event listeners
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

            // Visibility optimization (sleep loop when tab hidden)
            document.addEventListener('visibilitychange', () => {
                this.isRunning = !document.hidden;
                if (this.isRunning) {
                    requestAnimationFrame(this.animate);
                }
            });

            // Populate initial ambient particles
            for (let i = 0; i < this.maxAmbientParticles; i++) {
                this.particles.push(this.spawnAmbientParticle(true));
            }

            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2x DPR to save mobile GPU
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
            if (this.particlePool.length < 100) {
                this.particlePool.push(p);
            }
        }

        spawnAmbientParticle(randomY = false) {
            const p = this.getParticleFromPool();
            const isHeart = Math.random() > 0.35;
            p.type = isHeart ? 'heart' : 'sparkle';
            p.x = Math.random() * this.width;
            p.y = randomY ? Math.random() * this.height : this.height + Math.random() * 40;
            p.size = isHeart ? Math.random() * 9 + 6 : Math.random() * 3.5 + 2;
            // Drastically reduced vertical drift speed for a gentle, relaxing float:
            p.speedY = -(Math.random() * 0.35 + 0.2); // ~0.2 to 0.55 px per frame
            p.speedX = 0;
            p.baseSpeedX = (Math.random() - 0.5) * 0.12;
            p.angle = Math.random() * Math.PI * 2;
            p.angleSpeed = Math.random() * 0.008 + 0.003; // slow, gentle wave
            p.oscillationAmp = Math.random() * 0.5 + 0.2; // subtle amplitude
            p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
            p.alpha = Math.random() * 0.4 + 0.22;
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
                    // Burst particle physics
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
                    // Ambient particle physics - slow & gentle float
                    p.angle += p.angleSpeed;
                    p.x += Math.sin(p.angle) * p.oscillationAmp + p.baseSpeedX + p.speedX;
                    p.y += p.speedY;
                    p.speedX *= 0.94; // smooth decay

                    // Gentle mouse repulsion (squared distance check)
                    if (this.mouse.active) {
                        const dx = p.x - this.mouse.x;
                        const dy = p.y - this.mouse.y;
                        const distSq = dx * dx + dy * dy;

                        if (distSq < mouseRadiusSq && distSq > 0) {
                            const dist = Math.sqrt(distSq);
                            const force = (1 - dist / mouseRadius) * 1.2;
                            p.speedX += (dx / dist) * force;
                            p.y += (dy / dist) * force * 0.3;
                        }
                    }

                    if (p.type === 'heart') {
                        this.drawHeart(p.x, p.y, p.size, p.color, p.alpha);
                    } else {
                        this.drawSparkle(p.x, p.y, p.size, p.color, p.alpha);
                    }

                    // Recycle particle if it floats off the top
                    if (p.y < -25) {
                        this.releaseParticleToPool(p);
                        this.particles[i] = this.spawnAmbientParticle(false);
                    }
                }
            }

            // Keep ambient pool filled
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
       4. SCREEN 1: INTRO & ENVELOPE CONTROLLER
       ========================================================================== */
    const startDate = new Date("January 10, 2026 22:25:00").getTime();
    let timerInterval = null;
    let envelopeOpened = false;

    function updateTimer() {
        const timerElement = document.getElementById("timer");
        if (!timerElement) return;

        const now = new Date().getTime();
        const distance = now - startDate;

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
            sound.playMagic();

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
       5. SCREEN 2 & 3: QUESTION & NO-CHOICE LOGIC
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
       6. SCREEN 4 & 5: YAY CELEBRATION & DOUBLE-PAGE LETTER
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
       7. SCREEN 6: 3D POLAROID MEMORY FLIP GALLERY
       ========================================================================== */
    const allMemories = [
        "Our first conversation and laughing together all evening.",
        "The time we spent hours talking about our favorite music and movies.",
        "That unforgettable spontaneous walk under the city lights.",
        "Sharing our favorite childhood stories and silly memories.",
        "The cozy afternoon we spent drinking coffee and talking about everything.",
        "When we couldn't stop laughing at that ridiculous inside joke.",
        "Planning our dream trips and places we want to explore together.",
        "Cooking together and making a huge mess in the kitchen.",
        "Every quiet moment spent together just enjoying each other's company."
    ];

    const polaroidIcons = ['🌸', '✨', '☕', '🌟', '🎶', '💌', '🧸', '🍰', '🎈'];

    let shuffledMoments = [];
    let momentIndex = 0;
    let reshufflesLeft = 0;
    let momentsInitialized = false;

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function initPolaroidMoments() {
        if (momentsInitialized) return;
        momentsInitialized = true;

        shuffledMoments = shuffleArray(allMemories);
        momentIndex = 0;
        reshufflesLeft = Math.ceil(allMemories.length / 3) - 1;

        const counter = document.getElementById('counter');
        if (counter) counter.innerText = `Shuffles left: ${reshufflesLeft}`;

        renderPolaroidCards();
    }

    function renderPolaroidCards() {
        const grid = document.getElementById('polaroid-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const currentSet = shuffledMoments.slice(momentIndex, momentIndex + 3);
        momentIndex += 3;

        currentSet.forEach((memory, idx) => {
            const globalIndex = momentIndex - 3 + idx + 1;
            const randomRotation = (Math.random() * 4 - 2).toFixed(1); // -2deg to +2deg
            const randomIcon = polaroidIcons[(globalIndex - 1) % polaroidIcons.length];

            const card = document.createElement('div');
            card.className = 'polaroid-card';
            card.style.transform = `rotate(${randomRotation}deg)`;
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Polaroid photo ${globalIndex}: Tap to flip`);

            card.innerHTML = `
                <div class="polaroid-inner">
                    <div class="polaroid-front">
                        <div class="washi-tape"></div>
                        <div class="polaroid-photo-frame">
                            <div class="polaroid-emoji">${randomIcon}</div>
                            <span class="polaroid-tap-hint">Tap to Flip ♡</span>
                        </div>
                        <div class="polaroid-caption">Memory #${globalIndex}</div>
                    </div>
                    <div class="polaroid-back">
                        <div class="polaroid-stamp">
                            <span>Chapter #${globalIndex}</span>
                            <span>♡ Secret Note</span>
                        </div>
                        <p>${memory}</p>
                    </div>
                </div>
            `;

            const toggleFlip = () => {
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
                    toggleFlip();
                }
            };

            grid.appendChild(card);
        });
    }

    function handlePolaroidReshuffle() {
        const grid = document.getElementById('polaroid-grid');
        const counter = document.getElementById('counter');
        const reshuffleBtn = document.getElementById('reshuffle-btn');
        if (!grid) return;

        sound.playChime([440.00, 554.37, 659.25], 0.05);

        if (momentIndex >= shuffledMoments.length) {
            if (reshuffleBtn) reshuffleBtn.disabled = true;
            if (counter) counter.innerText = "Shuffles left: 0";

            grid.style.animation = "boxFadeOut 0.6s forwards";
            setTimeout(() => {
                grid.innerHTML = '<div class="final-letter-box" style="margin: 20px auto;"><p>✨ You have explored all the memories! More unforgettable chapters await ahead. ♡</p></div>';
                grid.style.animation = "fadeIn 0.6s forwards";
            }, 600);
            return;
        }

        reshufflesLeft--;
        if (counter) counter.innerText = `Shuffles left: ${reshufflesLeft}`;
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
       8. SCREEN 7: INTERACTIVE HTML5 SCRATCH-OFF VOUCHERS
       ========================================================================== */
    const couponData = [
        {
            title: "\"Get Out of an Argument\" Coupon",
            description: "Can be used to immediately end a minor disagreement and move on without further discussion.",
            uses: "2",
            badge: "🕊️"
        },
        {
            title: "\"Hugs Hugs Hugs\" Coupon",
            description: "A hug, for you, anytime, anywhere, any moment.",
            uses: "Unlimited",
            badge: "🤗"
        },
        {
            title: "\"Ask me anything\" Coupon",
            description: "You get to ask me a question, ANY QUESTION. I will have to answer completely honestly.",
            uses: "2",
            badge: "💬"
        },
        {
            title: "\"Can we eat?\" Coupon",
            description: "We eat whatever you feel like eating, wherever it is, and whatever the price. No objections or vetoes allowed!",
            uses: "2",
            badge: "🍣"
        },
        {
            title: "\"Get out of jail\" Coupon",
            description: "Made me angry/upset for whatever reason? Use this voucher to instantly make me okay again.<br><br><strong>NOTE:</strong> Silly mistakes only!",
            uses: "1",
            badge: "🗝️"
        }
    ];

    const scratchedCouponSet = new Set();
    let scratchCouponsInitialized = false;

    function initScratchCoupons() {
        if (scratchCouponsInitialized) return;
        scratchCouponsInitialized = true;

        const grid = document.getElementById('scratch-coupons-grid');
        const nextBtn = document.getElementById('coupons-next-btn');
        if (!grid) return;

        couponData.forEach((coupon, index) => {
            const card = document.createElement('div');
            card.className = 'coupon-scratch-card';
            card.id = `scratch-card-${index}`;

            card.innerHTML = `
                <div class="coupon-reward">
                    <span class="reward-badge">${coupon.badge}</span>
                    <div class="reward-title">${coupon.title}</div>
                    <div class="reward-desc">${coupon.description}</div>
                    <div class="reward-uses">Uses: ${coupon.uses}</div>
                </div>
                <canvas class="scratch-canvas" id="canvas-card-${index}"></canvas>
                <div class="scratch-instruction">✨ Scratch to Reveal ✨</div>
            `;

            grid.appendChild(card);

            // Initialize Scratch Canvas
            setupScratchCanvas(card, index);
        });
    }

    function setupScratchCanvas(card, index) {
        const canvas = card.querySelector('.scratch-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = card.getBoundingClientRect();
        const width = rect.width || 300;
        const height = rect.height || 210;

        canvas.width = width;
        canvas.height = height;

        // Draw foil coating (pastel shimmer gradient)
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#ff9ebb');
        grad.addColorStop(0.5, '#ff8da1');
        grad.addColorStop(1, '#ff6b85');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Add subtle patterned sparkles on foil
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        for (let i = 0; i < 18; i++) {
            const sx = Math.random() * width;
            const sy = Math.random() * height;
            ctx.beginPath();
            ctx.arc(sx, sy, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw decorative banner text
        ctx.font = 'bold 15px "CustomFont", "Nunito", sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 4;
        ctx.fillText('✨ SPECIAL VOUCHER ✨', width / 2, height / 2 - 12);
        ctx.font = '12px "CustomFont", "Nunito", sans-serif';
        ctx.fillText('(Scratch to Uncover)', width / 2, height / 2 + 12);
        ctx.shadowBlur = 0; // reset shadow

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
            if (strokeCount % 8 === 0) {
                checkClearance();
            }
        }

        function checkClearance() {
            if (isScratched) return;

            try {
                // High-performance stride sampling
                const imgData = ctx.getImageData(0, 0, width, height);
                const data = imgData.data;
                const stride = 32; // check every 8th pixel (4 bytes each)
                let clearedPixels = 0;
                let totalSamples = 0;

                for (let i = 3; i < data.length; i += stride) {
                    totalSamples++;
                    if (data[i] === 0) {
                        clearedPixels++;
                    }
                }

                const ratio = clearedPixels / totalSamples;

                if (ratio >= 0.45) {
                    isScratched = true;
                    card.classList.add('scratched');
                    canvas.style.opacity = '0';
                    canvas.style.pointerEvents = 'none';

                    sound.playMagic();
                    const cardRect = card.getBoundingClientRect();
                    particleEngine.burst(cardRect.left + cardRect.width / 2, cardRect.top + cardRect.height / 2, 25, 'mixed');

                    scratchedCouponSet.add(index);

                    if (scratchedCouponSet.size === couponData.length) {
                        const nextBtn = document.getElementById('coupons-next-btn');
                        if (nextBtn) {
                            nextBtn.style.display = 'inline-block';
                            sound.playMagic();
                            particleEngine.burst(window.innerWidth / 2, window.innerHeight - 70, 45, 'mixed');
                        }
                    }
                }
            } catch (err) {
                // Ignore canvas sampling security errors if local file
            }
        }

        // Pointer & Touch Event Listeners
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
       9. SCREEN 8: FINAL OUTRO & RESTART
       ========================================================================== */
    const finalRestartBtn = document.getElementById('final-restart-btn');
    if (finalRestartBtn) {
        finalRestartBtn.addEventListener('click', () => {
            goToScreen('screen-intro');
        });
    }

    /* ==========================================================================
       10. EASTER EGGS & INTERACTIVE POLISH
       ========================================================================== */
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

    // Attach mini-sparkles to GIFs & interactive elements
    document.querySelectorAll('.side-cat, #togepi-gif, #togepi-angry-gif, #yay-gif').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            sound.playTone(880, 'sine', 0.2, 0.08);
            particleEngine.burst(e.clientX, e.clientY, 15, 'sparkle');
        });
    });

    /* ==========================================================================
       11. INITIALIZATION ON DOM READY
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        handleHashChange();
    });

})();
