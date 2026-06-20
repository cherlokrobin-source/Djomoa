<<<<<<< HEAD
import { ... } from './Golden_Calendar/epoch_engine.js';


async function runSimulation() {
    console.log("--- بدء محاكاة الرزمانة الذهبية ---");
    
    // استدعاء المحرك للحقة رقم 1
    const engine = await getEngineSystem(1);
    
    // محاكاة مرور 500 سنة (كتجربة)
    const elapsedYears = 500;
    const status = engine.getSystemStatus(elapsedYears);
    
    console.log(`السنوات المنقضية: ${elapsedYears}`);
    console.log(`الانحراف المحسوب (Drift): ${status.drift}`);
    console.log(`حالة النظام: ${status.status}`);
    
    if (parseFloat(status.drift) > 0) {
        console.log("النتيجة: النظام يعمل بدقة ويقوم بتصحيح الانحراف الزمني.");
    }
}

runSimulation().catch(err => console.error("خطأ في المحاكاة:", err));
=======
import DjomoaEngine from './generator.js';

// المحرك الآن يعمل ككيان مستقل تماماً
function monitorTime() {
    // حساب الزمن الحالي بناءً على اللحظة الآن (في 2026)
    const now = BigInt(Math.floor(Date.now() / 86400000)); 
    const report = DjomoaEngine.getAdjustedDate(now);

    console.clear();
    console.log("=== نبض الآلة العالمية ===");
    console.log("المرجع المطلق:", report.absoluteIndex);
    console.log("معامل التصحيح (Drift):", report.driftCorrection.toFixed(6));
    console.log("الموقع الشمسي:", report.solarSync.dayOfYear.toFixed(2));
    console.log("الموقع القمري:", report.lunarSync.dayOfYear.toFixed(2));
    console.log("=========================");
}

// تشغيل المراقب كل ثانية (دون لمس الواجهة)
setInterval(monitorTime, 1000);
>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d

