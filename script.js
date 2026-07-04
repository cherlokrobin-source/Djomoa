/* ================================================================
   الأسطرلاب الزمني | Astrolabe Chronos Pro
   ملف الجافا سكريبت الرئيسي - محرك المحاكاة المتقدم
   ================================================================ */

// ================================================================
//  CLASS: AstrolabeEngine
// ================================================================

class AstrolabeEngine {
    constructor() {
        // === الثوابت ===
        this.TOTAL_DAYS = 18250000; // 50,000 سنة
        this.MONTHS_SOLAR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        this.MONTHS_LUNAR = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى',
            'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
            'ذو القعدة', 'ذو الحجة'
        ];
        this.DAY_NAMES = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        this.MILESTONES = [1000, 5000, 10000, 50000, 100000, 500000, 
                          1000000, 5000000, 10000000, 15000000, 18000000];

        // === الحالة ===
        this.currentDay = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.speed = 50;
        this.nextMilestoneIndex = 0;
        this.speedHistory = [];
        this.startTime = null;
        this.isSoundEnabled = true;
        this.lastTickValue = 0;

        // === مراجع DOM ===
        this.elements = {
            counter: document.getElementById('counterNumber'),
            progress: document.getElementById('progressFill'),
            progressPercent: document.getElementById('progressPercent'),
            elapsedTime: document.getElementById('elapsedTime'),
            currentSpeed: document.getElementById('currentSpeed'),
            remainingDays: document.getElementById('remainingDays'),
            progressInfo: document.getElementById('progressInfo'),
            solarDayNum: document.getElementById('solarDayNum'),
            solarMonth: document.getElementById('solarMonth'),
            solarYear: document.getElementById('solarYear'),
            solarDayName: document.getElementById('solarDayName'),
            lunarDayNum: document.getElementById('lunarDayNum'),
            lunarMonth: document.getElementById('lunarMonth'),
            lunarYear: document.getElementById('lunarYear'),
            lunarDayName: document.getElementById('lunarDayName'),
            statusIndicator: document.getElementById('statusIndicator'),
            statusText: document.getElementById('statusText'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            subHours: document.getElementById('subHours'),
            subMinutes: document.getElementById('subMinutes'),
            subSeconds: document.getElementById('subSeconds'),
            subWeeks: document.getElementById('subWeeks'),
            counterDisplay: document.querySelector('.counter-display'),
            notification: document.getElementById('notification'),
            notifMessage: document.getElementById('notifMessage'),
        };

        // === تهيئة ===
        this.loadState();
        this.init();
    }

    // ---------- التهيئة ----------
    init() {
        this.updateDisplay();

        // ربط سرعة المحاكاة
        this.elements.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.elements.speedValue.textContent = this.speed + 'x';
            if (this.isRunning) {
                this.pause();
                this.start();
            }
        });

        // حفظ الحالة تلقائياً كل 5 ثوانٍ
        setInterval(() => this.saveState(), 5000);

        // إغلاق الإشعار بالنقر
        this.elements.notification.addEventListener('click', () => {
            this.elements.notification.classList.remove('show');
        });

        // تحديث شريط التقدم في معلومات إضافية
        this.updateProgressInfo();

        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Space') {
                e.preventDefault();
                this.isRunning ? this.pause() : this.start();
            }
            if (e.key === 'r' || e.key === 'R') resetEngine();
            if (e.key === 'f' || e.key === 'F') toggleFullscreen();
            if (e.key === 'd' || e.key === 'D') addDays(10000);
            if (e.key === 't' || e.key === 'T') toggleTheme();
            if (e.key === 's' || e.key === 'S') toggleSound();
        });

        console.log('🚀 الأسطرلاب الزمني Pro v3.5');
        console.log('📅 الهدف: ' + this.TOTAL_DAYS.toLocaleString() + ' يوم');
        console.log('⌨️  اختصارات: [Space] تشغيل/إيقاف  [R] إعادة ضبط  [F] ملء شاشة  [D] +10k  [T] تبديل الوضع  [S] صوت');
    }

    // ---------- دوال التقويم ----------
    daysToSolar(d) {
        const base = new Date(2000, 0, 1);
        const dt = new Date(base.getTime() + d * 86400000);
        return {
            year: dt.getFullYear(),
            month: this.MONTHS_SOLAR[dt.getMonth()],
            day: dt.getDate(),
            dayName: this.DAY_NAMES[dt.getDay()]
        };
    }

    daysToLunar(d) {
        const baseLunar = new Date(1999, 3, 17);
        const dt = new Date(baseLunar.getTime() + d * 86400000);
        const lunarYear = 1420 + Math.floor(d / 354.367);
        const dayInYear = d % 354.367;
        const monthIndex = Math.floor(dayInYear / 29.53);
        const dayOfMonth = Math.floor(dayInYear % 29.53) + 1;
        return {
            year: lunarYear,
            month: this.MONTHS_LUNAR[monthIndex % 12] || 'محرم',
            day: dayOfMonth,
            dayName: this.DAY_NAMES[dt.getDay()]
        };
    }

    // ---------- عرض الإشعار ----------
    showNotification(message, icon = '🎯') {
        this.elements.notifMessage.textContent = message;
        document.querySelector('.notif-icon').textContent = icon;
        this.elements.notification.classList.add('show');
        clearTimeout(this.elements.notification._timer);
        this.elements.notification._timer = setTimeout(() => {
            this.elements.notification.classList.remove('show');
        }, 4000);
    }

    // ---------- تحديث واجهة المستخدم ----------
    updateDisplay() {
        const d = this.currentDay;

        // العداد الرئيسي مع تأثير
        const newValue = d.toLocaleString();
        if (this.elements.counter.textContent !== newValue) {
            this.elements.counter.textContent = newValue;
            this.elements.counter.classList.remove('bump');
            void this.elements.counter.offsetWidth;
            this.elements.counter.classList.add('bump');
        }

        // شريط التقدم
        const progress = Math.min((d / this.TOTAL_DAYS) * 100, 100);
        this.elements.progress.style.width = progress + '%';
        this.elements.progressPercent.textContent = progress.toFixed(2) + '%';
        this.elements.elapsedTime.textContent = d.toLocaleString();

        // الأيام المتبقية
        const remaining = Math.max(0, this.TOTAL_DAYS - d);
        this.elements.remainingDays.textContent = remaining.toLocaleString();

        // العداد الفرعي (ساعات، دقائق، ثواني، أسابيع)
        const totalSeconds = Math.floor(d * 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = totalSeconds % 60;
        const weeks = Math.floor(d / 7);

        this.elements.subHours.textContent = String(hours).padStart(2, '0');
        this.elements.subMinutes.textContent = String(minutes).padStart(2, '0');
        this.elements.subSeconds.textContent = String(seconds).padStart(2, '0');
        this.elements.subWeeks.textContent = weeks.toLocaleString();

        // تحديث التقويم الشمسي
        const solar = this.daysToSolar(d);
        this.elements.solarDayNum.textContent = solar.year;
        this.elements.solarMonth.textContent = solar.month;
        this.elements.solarYear.textContent = solar.day;
        this.elements.solarDayName.textContent = solar.dayName;

        // تحديث التقويم القمري
        const lunar = this.daysToLunar(d);
        this.elements.lunarDayNum.textContent = lunar.year;
        this.elements.lunarMonth.textContent = lunar.month;
        this.elements.lunarYear.textContent = lunar.day;
        this.elements.lunarDayName.textContent = lunar.dayName;

        // تحديث معلومات التقدم
        this.updateProgressInfo();

        // توهج متناغم مع القيمة
        const counterDisplay = this.elements.counterDisplay;
        counterDisplay.className = 'counter-display';
        if (d > 5000000) {
            counterDisplay.classList.add('glow-gold');
        } else if (d > 1000000) {
            counterDisplay.classList.add('glow-blue');
        } else if (d > 100000) {
            counterDisplay.classList.add('glow-purple');
        }

        // تحديث حالة المحرك
        if (this.isRunning) {
            this.elements.statusIndicator.className = 'status-indicator running';
            this.elements.statusText.textContent = 'يعمل';
        } else {
            this.elements.statusIndicator.className = 'status-indicator paused';
            this.elements.statusText.textContent = 'متوقف';
        }

        // التحقق من النقاط المرجعية
        if (this.nextMilestoneIndex < this.MILESTONES.length &&
            d >= this.MILESTONES[this.nextMilestoneIndex]) {
            const milestone = this.MILESTONES[this.nextMilestoneIndex];
            this.showNotification(
                `🏆 تم الوصول إلى ${milestone.toLocaleString()} يوم!`,
                '🏆'
            );
            this.nextMilestoneIndex++;
            
            // صوت عند تحقيق الهدف (إذا كان الصوت مفعل)
            if (this.isSoundEnabled) {
                this.playBeep(800, 200);
            }
        }

        // تحديث عنوان الصفحة
        document.title = `الأسطرلاب الزمني | ${d.toLocaleString()} يوم`;
    }

    updateProgressInfo() {
        const progress = Math.min((this.currentDay / this.TOTAL_DAYS) * 100, 100);
        document.getElementById('progressInfo').textContent = progress.toFixed(2) + '%';
    }

    // ---------- تأثير التموج ----------
    createRipple() {
        const container = this.elements.counterDisplay;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        document.body.appendChild(ripple);

        setTimeout(() => ripple.remove(), 2400);
    }

    // ---------- الصوت ----------
    playBeep(frequency = 600, duration = 150) {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            gainNode.gain.value = 0.08;
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
                audioCtx.close();
            }, duration);
        } catch (e) { /* تجاهل إذا لم يدعم المتصفح */ }
    }

    // ---------- محرك المحاكاة ----------
    tick() {
        if (!this.isRunning) return;

        const now = Date.now();
        const delta = (now - this.startTime) / 1000;
        this.startTime = now;

        // حساب الخطوة حسب السرعة
        const step = Math.max(1, Math.floor(this.speed / 2));
        this.currentDay += step;

        // حساب السرعة الفعلية
        const speedVal = Math.round(step / (delta || 0.1));
        this.speedHistory.push(speedVal);
        if (this.speedHistory.length > 10) this.speedHistory.shift();
        const avgSpeed = Math.round(this.speedHistory.reduce((a, b) => a + b, 0) / this.speedHistory.length);
        this.elements.currentSpeed.textContent = avgSpeed;

        // تأثير تموج كل 500 يوم
        if (this.currentDay % 500 === 0 && this.currentDay > 0) {
            this.createRipple();
        }

        if (this.currentDay > this.TOTAL_DAYS) {
            this.currentDay = this.TOTAL_DAYS;
            this.updateDisplay();
            this.pause();
            this.showNotification('🌟 تم تحقيق الهدف النهائي! 18,250,000 يوم', '🌟');
            if (this.isSoundEnabled) {
                this.playBeep(1000, 400);
                setTimeout(() => this.playBeep(1200, 400), 200);
            }
            return;
        }

        this.updateDisplay();
    }

    // ---------- وظائف التحكم ----------
    start() {
        if (this.isRunning) return;
        if (this.currentDay >= this.TOTAL_DAYS) {
            this.currentDay = 0;
            this.nextMilestoneIndex = 0;
            this.updateDisplay();
        }
        this.isRunning = true;
        this.startTime = Date.now();
        const intervalMs = Math.max(20, 120 - this.speed * 0.4);
        this.intervalId = setInterval(() => this.tick(), intervalMs);
        this.updateDisplay();
        this.showNotification('🚀 تم تشغيل المحرك الزمني', '🚀');
        if (this.isSoundEnabled) {
            this.playBeep(500, 100);
        }
    }

    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.updateDisplay();
        if (this.isSoundEnabled) {
            this.playBeep(400, 80);
        }
    }

    reset() {
        this.pause();
        this.currentDay = 0;
        this.nextMilestoneIndex = 0;
        this.speedHistory = [];
        this.elements.currentSpeed.textContent = '0';
        this.updateDisplay();
        this.showNotification('🔄 تم إعادة ضبط العدادات', '🔄');
        if (this.isSoundEnabled) {
            this.playBeep(300, 150);
        }
    }

    addDays(days) {
        this.currentDay += days;
        if (this.currentDay > this.TOTAL_DAYS) this.currentDay = this.TOTAL_DAYS;
        this.updateDisplay();
        this.showNotification(`➕ تمت إضافة ${days.toLocaleString()} يوم`, '📈');
        if (this.isSoundEnabled) {
            this.playBeep(700, 100);
        }
    }

    // ---------- حفظ واستعادة الحالة ----------
    saveState() {
        try {
            const state = {
                currentDay: this.currentDay,
                nextMilestoneIndex: this.nextMilestoneIndex,
                speed: this.speed,
                timestamp: Date.now()
            };
            localStorage.setItem('astrolabe_state', JSON.stringify(state));
        } catch (e) { /* تجاهل */ }
    }

    loadState() {
        try {
            const raw = localStorage.getItem('astrolabe_state');
            if (!raw) return;
            const state = JSON.parse(raw);
            this.currentDay = state.currentDay || 0;
            this.nextMilestoneIndex = state.nextMilestoneIndex || 0;
            this.speed = state.speed || 50;
            if (this.elements.speedSlider) {
                this.elements.speedSlider.value = this.speed;
                this.elements.speedValue.textContent = this.speed + 'x';
            }
        } catch (e) { /* تجاهل */ }
    }
}

// ================================================================
//  تهيئة المحرك
// ================================================================

const engine = new AstrolabeEngine();

// ================================================================
//  وظائف التحكم العامة (متاحة من HTML)
// ================================================================

function startEngine() { engine.start(); }
function pauseEngine() { engine.pause(); }
function resetEngine() { engine.reset(); }
function addDays(d) { engine.addDays(d); }

function updateSpeed(val) {
    engine.speed = parseInt(val);
    document.getElementById('speedValue').textContent = engine.speed + 'x';
    if (engine.isRunning) {
        engine.pause();
        engine.start();
    }
}

// ================================================================
//  تبديل الوضع (ليلي/نهاري)
// ================================================================

let isDayMode = false;

function toggleTheme() {
    isDayMode = !isDayMode;
    document.body.classList.toggle('day-mode', isDayMode);
    const icon = document.querySelector('#themeToggle i');
    icon.className = isDayMode ? 'fas fa-sun' : 'fas fa-moon';
    engine.showNotification(isDayMode ? '☀️ الوضع النهاري' : '🌙 الوضع الليلي', '🎨');
}

// ================================================================
//  ملء الشاشة
// ================================================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

// ================================================================
//  تشغيل/إيقاف الصوت
// ================================================================

function toggleSound() {
    engine.isSoundEnabled = !engine.isSoundEnabled;
    const icon = document.querySelector('.sound-toggle i');
    icon.className = engine.isSoundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    engine.showNotification(
        engine.isSoundEnabled ? '🔊 تم تشغيل الصوت' : '🔇 تم إيقاف الصوت',
        '🔊'
    );
}

// ================================================================
//  تهيئة أولية
// ================================================================

// تحديث واجهة المستخدم
engine.updateDisplay();

// طباعة اختصارات لوحة المفاتيح
console.log('⌨️  اختصارات: [Space] تشغيل/إيقاف  [R] إعادة ضبط  [F] ملء شاشة  [D] +10k  [T] تبديل الوضع  [S] صوت');