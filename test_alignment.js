import { loadEpoch } from './epoch_engine.js';

// تجربة تحميل المحرك الأول للتأكد من استقامة المسار
async function test() {
    try {
        console.log("جاري اختبار استقامة المحرك A...");
        // نفترض وجود ملف epoch_1.json في مجلد data
        const epoch1 = await loadEpoch(1);
        console.log("تمت العملية بنجاح. معامل التزامن الحالي:", epoch1.meta.alignment_drift);
    } catch (e) {
        console.log("خطأ في الاختبار (تحقق من وجود ملفات البيانات):", e.message);
    }
}

test();

