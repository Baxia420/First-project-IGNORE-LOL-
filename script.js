/**
 * ==========================================================================
 * ROMANTIC SINGLE-PAGE APPLICATION CONTROLLER & PARTICLE ENGINE
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

        playTone(freq, type = 'sine', duration = 0.3, volume = 0.1) {
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

        playChime(notes = [523.25, 659.25, 783.99, 1046.50], delay = 0.08) {
            if (!this.enabled) return;
            this.initContext();
            notes.forEach((note, index) => {
                setTimeout(() => {
                    this.playTone(note, 'triangle', 0.4, 0.12);
                }, index * (delay * 1000));
            });
        }

        playMagic() {
            if (!this.enabled) return;
            const arpeggio = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1318.51];
            this.playChime(arpeggio, 0.06);
        }
    }

    const sound = new SoundEngine();

    /* ==========================================================================
       2. INTERACTIVE CANVAS PARTICLE ENGINE (60 FPS + MOUSE PHYSICS)
       ========================================================================== */
    class ParticleEngine {
        constructor() {
            this.canvas = document.getElementById('bg-canvas');
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.maxAmbientParticles = 38;
            this.mouse = { x: -1000, y: -1000, active: false };
            this.colors = ['#ff8da1', '#ff6b85', '#ffb6c1', '#AFCBFF', '#FFE4E1', '#FFD700', '#db4e4e'];

            this.resize();
            window.addEventListener('resize', () => this.resize());

            // Pointer event listeners
            window.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
                this.mouse.active = true;
            });

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

            // Populate initial ambient particles
            for (let i = 0; i < this.maxAmbientParticles; i++) {
                this.particles.push(this.createAmbientParticle(true));
            }

            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        resize() {
            const dpr = window.devicePixelRatio || 1;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.canvas.width = this.width * dpr;
            this.canvas.height = this.height * dpr;
            this.ctx.scale(dpr, dpr);
        }

        createAmbientParticle(randomY = false) {
            const isHeart = Math.random() > 0.35;
            return {
                type: isHeart ? 'heart' : 'sparkle',
                x: Math.random() * this.width,
                y: randomY ? Math.random() * this.height : this.height + Math.random() * 50,
                size: isHeart ? Math.random() * 12 + 8 : Math.random() * 5 + 3,
                speedY: -(Math.random() * 0.8 + 0.5),
                speedX: 0,
                baseSpeedX: (Math.random() - 0.5) * 0.4,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: Math.random() * 0.02 + 0.01,
                oscillationAmp: Math.random() * 1.2 + 0.4,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: Math.random() * 0.5 + 0.3,
                life: 1,
                isBurst: false
            };
        }

        createBurstParticle(x, y, type = 'confetti') {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            return {
                type: type,
                x: x,
                y: y,
                size: type === 'heart' ? Math.random() * 14 + 10 : Math.random() * 6 + 3,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed - 2,
                gravity: 0.12,
                friction: 0.96,
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                alpha: 1,
                life: 1,
                decay: Math.random() * 0.02 + 0.015,
                isBurst: true
            };
        }

        burst(x, y, count = 30, type = 'mixed') {
            const targetX = x !== undefined ? x : this.width / 2;
            const targetY = y !== undefined ? y : this.height / 2;

            for (let i = 0; i < count; i++) {
                let pType = type;
                if (type === 'mixed') {
                    pType = Math.random() > 0.5 ? 'heart' : 'sparkle';
                }
                this.particles.push(this.createBurstParticle(targetX, targetY, pType));
            }
        }

        drawHeart(x, y, size, color, alpha, rotation = 0) {
            this.ctx.save();
            this.ctx.translate(x, y);
            if (rotation) this.ctx.rotate((rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, alpha);
            this.ctx.fillStyle = color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = color;

            this.ctx.beginPath();
            const topCurveHeight = size * 0.3;
            this.ctx.moveTo(0, topCurveHeight);
            // Top left curve
            this.ctx.bezierCurveTo(
                -size / 2, -topCurveHeight,
                -size, size / 3,
                0, size
            );
            // Top right curve
            this.ctx.bezierCurveTo(
                size, size / 3,
                size / 2, -topCurveHeight,
                0, topCurveHeight
            );
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
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = color;

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
            this.ctx.clearRect(0, 0, this.width, this.height);

            const mouseRadius = 120;

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
                        this.particles.splice(i, 1);
                    }
                } else {
                    // Ambient particle physics
                    p.angle += p.angleSpeed;
                    p.x += Math.sin(p.angle) * p.oscillationAmp + p.baseSpeedX + p.speedX;
                    p.y += p.speedY;
                    p.speedX *= 0.92; // decay push speed

                    // Mouse repulsion force
                    if (this.mouse.active) {
                        const dx = p.x - this.mouse.x;
                        const dy = p.y - this.mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < mouseRadius && dist > 0) {
                            const force = (1 - dist / mouseRadius) * 2.5;
                            p.speedX += (dx / dist) * force;
                            p.y += (dy / dist) * force * 0.5;
                        }
                    }

                    if (p.type === 'heart') {
                        this.drawHeart(p.x, p.y, p.size, p.color, p.alpha);
                    } else {
                        this.drawSparkle(p.x, p.y, p.size, p.color, p.alpha);
                    }

                    // Recycle particle if off screen
                    if (p.y < -30) {
                        this.particles[i] = this.createAmbientParticle(false);
                    }
                }
            }

            // Maintain ambient particle pool
            const ambientCount = this.particles.filter(p => !p.isBurst).length;
            if (ambientCount < this.maxAmbientParticles) {
                this.particles.push(this.createAmbientParticle(false));
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

        // Screen-specific on-enter hooks
        onScreenEnter(screenId);
    }

    function onScreenEnter(screenId) {
        sound.playChime([587.33, 659.25, 783.99], 0.07);

        if (screenId === 'screen-yay') {
            particleEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 50, 'mixed');
        } else if (screenId === 'screen-moments') {
            initMoments();
        } else if (screenId === 'screen-coupons') {
            initCoupons();
        }
    }

    // Handle browser hash navigation & back/forward buttons
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
       4. SCREEN 1: INTRO & ENVELOPE LOGIC
       ========================================================================== */
    const startDate = new Date("January 10, 2026 22:25:00").getTime();
    let timerInterval = null;

    function updateTimer() {
        const timerElement = document.getElementById("timer");
        if (!timerElement) return;

        const now = new Date().getTime();
        const distance = now - startDate;

        if (distance < 0) {
            timerElement.textContent = "a little while";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function openEnvelope() {
        const envContainer = document.getElementById('envelope-container');
        const messageContent = document.getElementById('message-content');
        const proceedBtn = document.getElementById('intro-proceed-btn');

        if (envContainer && messageContent && proceedBtn) {
            const rect = envContainer.getBoundingClientRect();
            particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, 'sparkle');
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
            sound.playTone(330, 'sawtooth', 0.2, 0.08); // playful boop

            if (noMessageIndex >= noMessages.length) {
                goToScreen('screen-no-choice');
                return;
            }

            noBtn.innerText = noMessages[noMessageIndex];

            if (togepiGif && sadGifs.length > 0) {
                togepiGif.src = sadGifs[noMessageIndex % sadGifs.length];
            }

            yesButtonScale += 0.28;
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
        particleEngine.burst(clientX, clientY, 60, 'mixed');
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
       7. SCREEN 6: MYSTERY MOMENTS (3D BOX GAME)
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

    function initMoments() {
        if (momentsInitialized) return;
        momentsInitialized = true;

        shuffledMoments = shuffleArray(allMemories);
        momentIndex = 0;
        reshufflesLeft = Math.ceil(allMemories.length / 3) - 1;

        const counter = document.getElementById('counter');
        if (counter) counter.innerText = `Reshuffles left: ${reshufflesLeft}`;

        renderBoxes();
    }

    function renderBoxes() {
        const grid = document.getElementById('boxes-grid');
        if (!grid) return;
        grid.innerHTML = '';

        const currentSet = shuffledMoments.slice(momentIndex, momentIndex + 3);
        momentIndex += 3;

        currentSet.forEach((memory) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'box-wrapper';
            wrapper.setAttribute('role', 'button');
            wrapper.setAttribute('tabindex', '0');
            wrapper.setAttribute('aria-label', 'Open mystery gift box');

            wrapper.innerHTML = `
                <div class="box-lid"></div>
                <div class="box-message">${memory}</div>
                <div class="box-body">
                    <span style="font-size: 3rem; color: white;">?</span>
                </div>
            `;

            const toggleBox = (e) => {
                const isOpen = wrapper.classList.toggle('open');
                if (isOpen) {
                    sound.playChime([659.25, 880.00], 0.08);
                    const rect = wrapper.getBoundingClientRect();
                    particleEngine.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, 'sparkle');
                }
            };

            wrapper.onclick = toggleBox;
            wrapper.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleBox(e);
                }
            };

            grid.appendChild(wrapper);
        });
    }

    function handleReshuffle() {
        const grid = document.getElementById('boxes-grid');
        const counter = document.getElementById('counter');
        const reshuffleBtn = document.getElementById('reshuffle-btn');
        if (!grid) return;

        sound.playChime([440.00, 554.37, 659.25], 0.06);

        if (momentIndex >= shuffledMoments.length) {
            if (reshuffleBtn) reshuffleBtn.disabled = true;
            if (counter) counter.innerText = "Reshuffles left: 0";

            grid.style.animation = "boxFadeOut 0.8s forwards";
            setTimeout(() => {
                grid.innerHTML = '<div class="final-message">That is all the moments I could think of for now. Do not worry, we will be making more. ♡</div>';
                grid.style.animation = "fadeIn 0.8s forwards";
            }, 800);
            return;
        }

        reshufflesLeft--;
        if (counter) counter.innerText = `Reshuffles left: ${reshufflesLeft}`;
        renderBoxes();
    }

    const reshuffleBtn = document.getElementById('reshuffle-btn');
    if (reshuffleBtn) reshuffleBtn.addEventListener('click', handleReshuffle);

    const momentsNextBtn = document.getElementById('moments-next-btn');
    if (momentsNextBtn) {
        momentsNextBtn.addEventListener('click', () => {
            goToScreen('screen-coupons');
        });
    }

    /* ==========================================================================
       8. SCREEN 7: GIFT COUPONS LOGIC
       ========================================================================== */
    const couponData = [
        {
            title: "\"Get Out of an Argument\" Coupon",
            description: "Can be used to immediately end a minor disagreement and move on without further discussion.",
            uses: "2"
        },
        {
            title: "\"Hugs Hugs Hugs\" Coupon",
            description: "A hug, for you, anytime, anywhere, any moment.",
            uses: "Unlimited"
        },
        {
            title: "\"Ask me anything\" Coupon",
            description: "You get to ask me a question, ANY QUESTION. I will have to answer completely honestly.",
            uses: "2"
        },
        {
            title: "\"Can we eat?\" Coupon",
            description: "We eat whatever you feel like eating, wherever it is, and whatever the price. No objections or vetoes allowed!",
            uses: "2"
        },
        {
            title: "\"Get out of jail\" Coupon",
            description: "Made me angry/upset for whatever reason? Use this voucher to instantly make me okay again.<br><br><strong>NOTE:</strong> Does not cover high-level crimes against my feelings. Silly mistakes only!",
            uses: "1"
        }
    ];

    const clickedCouponIndices = new Set();
    let couponsInitialized = false;

    function initCoupons() {
        if (couponsInitialized) return;
        couponsInitialized = true;

        const grid = document.getElementById('coupons-grid');
        const nextBtn = document.getElementById('coupons-next-btn');
        if (!grid) return;

        couponData.forEach((coupon, index) => {
            const card = document.createElement('div');
            card.className = 'coupon-card';
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `View ${coupon.title}`);

            card.innerHTML = `
                <div class="coupon-tooltip">
                    <span class="tooltip-title">${coupon.title}</span>
                    <div class="tooltip-desc">${coupon.description}</div>
                    <div class="tooltip-uses">Uses: ${coupon.uses}</div>
                </div>
                
                <img src="assets/images/ticket.png" class="coupon-bg-img" alt="Gift voucher ticket">
                
                <div class="coupon-title-text">${coupon.title}</div>
            `;

            const toggleCoupon = (e) => {
                e.stopPropagation();

                document.querySelectorAll('.coupon-card').forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });

                const isNowActive = card.classList.toggle('active');

                if (isNowActive) {
                    sound.playTone(783.99, 'sine', 0.25, 0.1);
                    const rect = card.getBoundingClientRect();
                    particleEngine.burst(rect.left + rect.width / 2, rect.top + 20, 15, 'sparkle');
                }

                if (!clickedCouponIndices.has(index)) {
                    clickedCouponIndices.add(index);
                    if (clickedCouponIndices.size === couponData.length && nextBtn) {
                        nextBtn.style.display = 'inline-block';
                        sound.playMagic();
                        particleEngine.burst(window.innerWidth / 2, window.innerHeight - 80, 40, 'mixed');
                    }
                }
            };

            card.onclick = toggleCoupon;
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCoupon(e);
                }
            };

            grid.appendChild(card);
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.coupon-card')) {
                document.querySelectorAll('.coupon-card').forEach(c => c.classList.remove('active'));
            }
        });
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
            // Multiple cascading bursts across screen
            const width = window.innerWidth;
            const height = window.innerHeight;
            particleEngine.burst(e.clientX, e.clientY, 35, 'heart');
            setTimeout(() => particleEngine.burst(width * 0.25, height * 0.4, 30, 'sparkle'), 120);
            setTimeout(() => particleEngine.burst(width * 0.75, height * 0.4, 30, 'mixed'), 240);
        });
    }

    // Attach mini-sparkles to GIFs & interactive elements
    document.querySelectorAll('.side-cat, #togepi-gif, #togepi-angry-gif, #yay-gif').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            sound.playTone(880, 'sine', 0.2, 0.08);
            particleEngine.burst(e.clientX, e.clientY, 18, 'sparkle');
        });
    });

    /* ==========================================================================
       11. APPLICATION INITIALIZATION
       ========================================================================== */
    document.addEventListener('DOMContentLoaded', () => {
        handleHashChange();
    });

})();