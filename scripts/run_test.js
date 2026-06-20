import { getEngineSystem } from './epoch_engine.js';

async function verifySystem() {
    try {
        const engine1 = await getEngineSystem(1);
        const drift = engine1.calculateDrift(1);
        console.log(`الحقبة 1 | معامل التصحيح المحسوب: ${drift.toFixed(6)}`);
        console.log("النظام جاهز للتوسع إلى الحقبة 24.");
    } catch (error) {
        console.error("خطأ في نظام التوفيق:", error.message);
    }
}

verifySystem();

