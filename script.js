<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Djomoa - محرك المزامنة الزمنية المطلق</title>
    <style>
        /* ===== المتغيرات ===== */
        :root {
            --gold: #d4af37;
            --gold-light: #e9c468;
            --gold-dark: #b57c1c;
            --bg-primary: #0a0f1e;
            --bg-secondary: #0c1222;
            --text-primary: #e8edf5;
            --text-secondary: #b9c7d9;
        }

        /* ===== إعادة تعيين ===== */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* ===== الجسم ===== */
        body {
            background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
            font-family: 'Segoe UI', 'Tahoma', 'Amiri', 'Times New Roman', serif;
            color: var(--text-primary);
            line-height: 1.7;
            padding: 2rem;
            min-height: 100vh;
        }

        /* ===== الحاوية ===== */
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: rgba(18, 25, 45, 0.8);
            backdrop-filter: blur(8px);
            border-radius: 2rem;
            padding: 2.5rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(212, 175, 55, 0.2);
        }

        /* ===== البسملة ===== */
        .basmala {
            font-size: 2.5rem;
            font-family: 'Amiri', 'Times New Roman', serif;
            text-align: center;
            color: var(--gold);
            text-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
            margin-bottom: 0.5rem;
            letter-spacing: 4px;
        }

        /* ===== الآية ===== */
        .subtitle {
            text-align: center;
            font-size: 1.2rem;
            color: var(--text-secondary);
            font-style: italic;
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
            padding-bottom: 0.75rem;
            margin-bottom: 1.5rem;
        }

        /* ===== الوصف الرئيسي ===== */
        .hero-desc {
            text-align: center;
            font-size: 1.4rem;
            font-weight: 600;
            color: #ffdf8c;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.8rem 1.5rem;
            border-radius: 60px;
            width: 100%;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(212, 175, 55, 0.15);
        }

        /* ===== عنوان المشروع ===== */
        .project-title {
            font-size: 1.8rem;
            font-weight: 700;
            text-align: center;
            color: var(--gold);
            margin: 1.5rem 0;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid var(--gold);
            width: 100%;
        }

        /* ===== العداد ===== */
        .counter-container {
            background: linear-gradient(135deg, #1a1f2e, #0f1422);
            border-radius: 1.5rem;
            padding: 2.5rem 2rem;
            margin: 1.5rem 0 2.5rem;
            text-align: center;
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }

        /* تأثير الخلفية المتوهجة */
        .counter-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%);
            animation: rotateGlow 30s linear infinite;
            pointer-events: none;
        }

        @keyframes rotateGlow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* نبض ذهبي للعداد */
        @keyframes goldPulse {
            0%, 100% {
                text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            }
            50% {
                text-shadow: 0 0 40px rgba(212, 175, 55, 0.7), 0 0 80px rgba(212, 175, 55, 0.2);
            }
        }

        .counter {
            font-size: 4.5rem;
            font-weight: 900;
            font-family: 'Courier New', monospace;
            color: var(--gold);
            background: rgba(0, 0, 0, 0.5);
            display: inline-block;
            padding: 0.5rem 2rem;
            border-radius: 1rem;
            letter-spacing: 6px;
            min-width: 300px;
            border: 1px solid rgba(212, 175, 55, 0.2);
            animation: goldPulse 2.5s ease-in-out infinite;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            position: relative;
            z-index: 1;
        }

        .counter:hover {
            transform: scale(1.05);
            box-shadow: 0 0 40px rgba(212, 175, 55, 0.2);
        }

        .counter-label {
            font-size: 1.2rem;
            color: #e6d5a8;
            margin-top: 1rem;
            position: relative;
            z-index: 1;
        }

        .counter-sub {
            display: block;
            color: #7a8aa8;
            font-size: 0.85rem;
            margin-top: 0.5rem;
            position: relative;
            z-index: 1;
            letter-spacing: 1px;
        }

        .counter-badge {
            display: inline-block;
            background: rgba(212, 175, 55, 0.12);
            padding: 0.2rem 1.2rem;
            border-radius: 20px;
            font-size: 0.7rem;
            color: var(--gold-light);
            border: 1px solid rgba(212, 175, 55, 0.15);
            margin-top: 0.8rem;
            position: relative;
            z-index: 1;
            letter-spacing: 2px;
        }

        /* ===== الأقسام ===== */
        .section {
            background: rgba(10, 15, 30, 0.6);
            border-radius: 1.2rem;
            padding: 1.5rem 2rem;
            margin-bottom: 1.5rem;
            border-right: 4px solid var(--gold);
            transition: all 0.3s ease;
        }

        .section:hover {
            background: rgba(20, 28, 48, 0.8);
            border-right-width: 6px;
            transform: translateX(-4px);
        }

        .section h2 {
            font-size: 1.4rem;
            color: #e6c87a;
            margin-bottom: 0.8rem;
        }

        .section h2::before {
            content: "◆";
            color: var(--gold);
            margin-left: 10px;
        }

        .section p {
            color: #cfdfed;
            font-size: 1rem;
        }

        .section ul {
            list-style: none;
            padding-right: 1.5rem;
            margin-top: 0.5rem;
        }

        .section li {
            color: #cfdfed;
            margin: 0.4rem 0;
            position: relative;
            padding-right: 1.2rem;
        }

        .section li::before {
            content: "▹";
            color: var(--gold);
            position: absolute;
            right: 0;
        }

        strong {
            color: #ffdf8c;
        }

        /* ===== حالة المحرك ===== */
        .engine-status {
            background: rgba(0, 0, 0, 0.3);
            padding: 0.8rem 1.5rem;
            border-radius: 0.8rem;
            margin: 1rem 0 1.5rem;
            text-align: center;
            color: #7a9ab5;
            font-size: 0.9rem;
            border: 1px solid rgba(212, 175, 55, 0.08);
            transition: all 0.4s ease;
        }

        .engine-status.success {
            color: #7ddf9a;
            border-color: rgba(125, 223, 154, 0.2);
        }

        .engine-status.error {
            color: #ff6b6b;
            border-color: rgba(255, 107, 107, 0.2);
        }

        /* ===== التذييل ===== */
        .footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            text-align: center;
            border-top: 1px solid rgba(212, 175, 55, 0.15);
        }

        .copyright {
            font-size: 0.85rem;
            color: #8a9ab5;
            letter-spacing: 0.5px;
        }

        .developed-by {
            font-size: 0.8rem;
            color: #c9b87a;
            margin-top: 0.3rem;
            font-family: monospace;
        }

        .developed-by a {
            color: var(--gold);
            text-decoration: none;
            transition: color 0.2s;
        }

        .developed-by a:hover {
            color: #ffdf8c;
            text-decoration: underline;
        }

        /* ===== شريط التمرير ===== */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #0f1420;
        }
        ::-webkit-scrollbar-thumb {
            background: var(--gold);
            border-radius: 10px;
        }

        /* ===== استجابة ===== */
        @media (max-width: 768px) {
            body { padding: 1rem; }
            .container { padding: 1.5rem; }
            .basmala { font-size: 1.8rem; }
            .hero-desc { font-size: 1.1rem; }
            .counter { 
                font-size: 2.8rem; 
                min-width: 200px;
                padding: 0.4rem 1rem;
                letter-spacing: 3px;
            }
            .section { padding: 1rem 1.2rem; }
            .section h2 { font-size: 1.2rem; }
            .project-title { font-size: 1.4rem; }
        }

        @media (max-width: 480px) {
            .counter { 
                font-size: 2rem; 
                min-width: 160px;
                padding: 0.3rem 0.8rem;
                letter-spacing: 2px;
            }
            .counter-container { padding: 1.5rem 1rem; }
            .basmala { font-size: 1.5rem; }
        }
    </style>
</head>
<body>

<div class="container">
    <!-- ===== البسملة ===== -->
    <div class="basmala">﷽</div>

    <!-- ===== الآية ===== -->
    <p class="subtitle">﴿ لِتَعْلَمُوا عَدَدَ السِّنِينَ وَالْحِسَابَ ﴾</p>

    <!-- ===== الوصف ===== -->
    <p class="hero-desc">مشروع Djomoa للمزامنة الزمنية المطلقة</p>

    <!-- ===== العنوان ===== -->
    <div class="project-title">⚙️ محرك المزامنة الزمنية المطلق</div>

    <!-- ===== العداد ===== -->
    <div class="counter-container">
        <div class="counter" id="syncCounter">0</div>
        <p class="counter-label">مليون يوم من التزامن المطلق</p>
        <span class="counter-sub">قدرة تشغيلية: 50,000 سنة زمنية متصلة</span>
        <span class="counter-badge">⚡ ZERO DRIFT</span>
    </div>

    <!-- ===== الأقسام ===== -->
    <div class="section">
        <h2>الملخص التنفيذي</h2>
        <p>مشروع Djomoa هو محرك حسابي متطور يعتمد على الثوابت الفلكية القطعية لتقديم تزامن زمني لحظي ودقيق بين التقاويم الشمسية والقمرية. النظام مصمم ليكون "العمود الفقري" لأي منصة رقمية تتطلب دقة تاريخية لا تقبل الخطأ.</p>
    </div>

    <div class="section">
        <h2>الهندسة المعمارية</h2>
        <p><strong>المحرك:</strong> مبني على خوارزمية Fixed-Cycle Synchronization التي تضمن عدم حدوث أي انزياح تراكمي.</p>
        <p><strong>المرجعية:</strong> يستخدم ملف master_origin.json كقاعدة بيانات تحتوي على الثوابت الفلكية.</p>
        <p><strong>الاستقلالية:</strong> نظام مغلق يعمل محلياً بكفاءة تامة.</p>
    </div>

    <div class="section">
        <h2>القدرة الاستيعابية</h2>
        <p>قادر على معالجة 50,000 سنة من البيانات الزمنية المتصلة، أي أكثر من 18,250,000 يوم من المزامنة الدقيقة.</p>
        <ul>
            <li><strong>الاستقرار:</strong> تزامن كامل دون انزياح واحد (Zero Drift).</li>
            <li><strong>الكفاءة:</strong> استخراج أي تاريخ في جزء من الثانية.</li>
        </ul>
    </div>

    <div class="section">
        <h2>القيمة التقنية</h2>
        <ul>
            <li><strong>الموثوقية:</strong> دقة مطلقة لأي حدث تاريخي أو مستقبلي.</li>
            <li><strong>الأداء:</strong> استجابة لحظية (Zero-Latency).</li>
            <li><strong>التوافق:</strong> قابل للدمج مع أي منصة (API-Ready).</li>
        </ul>
    </div>

    <div class="section">
        <h2>التميز والفرادة</h2>
        <p>إنجاز تقني غير مسبوق عالمياً. لم يسبق لأي نظام أن حقق هذا المستوى من التزامن المزدوج الدقيق على مدى 50,000 سنة في نطاق برمجي موحد ومستقل.</p>
    </div>

    <div class="section">
        <h2>الهدف الاستراتيجي</h2>
        <p>تقديم "وحدة معالجة زمنية" يمكن للشركات الكبرى اعتمادها كمعيار تقني لتوحيد وتوثيق الزمن في التطبيقات العالمية.</p>
    </div>

    <!-- ===== حالة المحرك ===== -->
    <div class="engine-status" id="engineStatus">⏳ جاري تهيئة المحرك...</div>

    <!-- ===== التذييل ===== -->
    <div class="footer">
        <div class="copyright">© 2026 Djomoa Project</div>
        <div class="developed-by">
            developed by <a href="#">@nemimeche benaissa</a>
        </div>
    </div>
</div>

<!-- ===== JavaScript ===== -->
<script type="module">
    // ==========================================
    // 1. استيراد المحرك الرئيسي
    // ==========================================
    import { MasterEngine } from './Master_Engine.js';

    // ==========================================
    // 2. عناصر الصفحة
    // ==========================================
    const counterEl = document.getElementById('syncCounter');
    const statusEl = document.getElementById('engineStatus');

    // ==========================================
    // 3. دالة تهيئة المحرك
    // ==========================================
    async function initializeEngine() {
        try {
            const engine = new MasterEngine();
            const result = engine.calc(50000);
            console.log('✅ المحرك يعمل:', result);

            if (statusEl) {
                statusEl.textContent = '✅ المحرك الرئيسي نشط وجاهز للعمل';
                statusEl.className = 'engine-status success';
            }
            return { success: true, engine, result };
        } catch (error) {
            console.error('❌ خطأ في المحرك:', error);
            if (statusEl) {
                statusEl.textContent = `❌ ${error.message}`;
                statusEl.className = 'engine-status error';
            }
            return { success: false, error };
        }
    }

    // ==========================================
    // 4. دالة تشغيل العداد
    // ==========================================
    function startCounter(element, target = 18250000, duration = 2500) {
        if (!element) return null;

        let start = null;
        let id = null;

        const update = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min(1, (timestamp - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);

            if (current >= target) {
                element.textContent = target.toLocaleString();
                return;
            }

            element.textContent = current.toLocaleString();
            id = requestAnimationFrame(update);
        };

        const startCounterFn = () => {
            if (id) cancelAnimationFrame(id);
            start = null;
            id = requestAnimationFrame(update);
        };

        // بدء العداد
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startCounterFn);
        } else {
            startCounterFn();
        }

        // إرجاع دالة لإيقاف العداد
        return () => {
            if (id) {
                cancelAnimationFrame(id);
                id = null;
            }
        };
    }

    // ==========================================
    // 5. دالة رئيسية لتشغيل كل شيء
    // ==========================================
    async function main() {
        // تهيئة المحرك
        await initializeEngine();

        // تشغيل العداد
        if (counterEl) {
            startCounter(counterEl);
        }
    }

    // ==========================================
    // 6. تشغيل التطبيق
    // ==========================================
    main();

    // ==========================================
    // 7. دالة إضافية: إعادة تشغيل العداد عند الطلب
    // ==========================================
    window.restartCounter = function() {
        if (counterEl) {
            // إعادة تعيين العداد إلى 0
            counterEl.textContent = '0';
            // إعادة تشغيل العداد
            startCounter(counterEl);
        }
    };

    // ==========================================
    // 8. دالة إضافية: عرض معلومات المحرك في console
    // ==========================================
    window.showEngineInfo = async function() {
        const result = await initializeEngine();
        console.log('معلومات المحرك:', result);
        return result;
    };

    console.log('✅ Djomoa جاهز!');
    console.log('📌 استخدم window.restartCounter() لإعادة تشغيل العداد');
    console.log('📌 استخدم window.showEngineInfo() لعرض معلومات المحرك');
</script>

</body>
</html>