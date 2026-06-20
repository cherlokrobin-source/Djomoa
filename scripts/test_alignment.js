/** * محرك الرزمانة الذهبية - ملف الاختبار المحمي
 * تم التعديل لضمان استقامة الربط مع المحرك الرئيسي (engine.js)
 */

import { loadEpoch } from './engine.js';

async function test() {
    console.log("[---] بدء فحص استقامة الرزمانة الذهبية [---]");
    
    try {
        // نختبر مسار العصر الأول في الخزانة الذهبية
        const path = './Golden_Calendar/epoch_1.json';
        console.log(`[*] جاري محاولة الوصول إلى: ${path}`);
        
        const epoch = await loadEpoch(path);
        
        console.log("[SUCCESS] تم العثور على العصر بنجاح!");
        console.log("[DATA] اسم العصر:", epoch.name);
        console.log("[STATUS] المحرك في حالة استقامة كاملة.");
        
    } catch (e) {
        console.error("[FAILED] فشل في استقامة المحرك.");
        console.error("[ERROR DETAILS]:", e.message);
        console.log("[TIP] تأكد أن الملف موجود في مسار Golden_Calendar/epoch_1.json");
    }
}

test();

