import fs from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'master_origin.json');
let cachedData = null;
let isUpdating = false; // لمنع التحديث المتداخل

/**
 * دالة تحميل البيانات مع حماية ضد القراءة المتزامنة
 */
function loadData() {
    if (isUpdating) return;
    isUpdating = true;
    
    try {
        if (!fs.existsSync(DATA_PATH)) {
            throw new Error("ملف البيانات غير موجود في المسار المحدد.");
        }
        const raw = fs.readFileSync(DATA_PATH, 'utf8');
        cachedData = JSON.parse(raw);
        console.log("✅ [System] تم تحميل/تحديث البيانات في الذاكرة.");
    } catch (err) {
        console.error("❌ [System] فشل تحميل البيانات:", err.message);
    } finally {
        isUpdating = false;
    }
}

/**
 * إعداد مراقب الملفات مع Debounce بسيط لتجنب التحديثات المتكررة
 */
let debounceTimer;
try {
    fs.watch(DATA_PATH, (eventType) => {
        if (eventType === 'change') {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(loadData, 500); // تحديث بعد نصف ثانية من آخر تعديل
        }
    });
} catch (err) {
    console.warn("⚠️ [System] تعذر تفعيل مراقب الملفات.");
}

// التحميل الأولي
loadData();

/**
 * دالة الاستعلام المطورة: تدعم البحث المتقدم والتعامل مع الأخطاء
 */
export function queryMaster(dayIndex) {
    if (!cachedData) return { error: "البيانات غير متاحة حالياً" };

    const result = cachedData.find(d => d.day === parseInt(dayIndex));

    if (result) {
        return { success: true, data: result };
    }
    
    return { success: false, message: `اليوم ${dayIndex} لا يملك 'بيان' مسجل.` };
}

/**
 * دالة مساعدة للحصول على إجمالي البيانات (مفيد لواجهة المستخدم)
 */
export function getStats() {
    return {
        totalDays: cachedData ? cachedData.length : 0,
        status: cachedData ? "Active" : "Empty"
    };
}

