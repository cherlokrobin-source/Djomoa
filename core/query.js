import fs from 'fs/promises';
import path from 'path';

/**
 * دالة جلب البيانات من ملف JSON
 * @param {string|number} totalTicks - القيمة المراد البحث عنها
 */
export async function getTimelineData(totalTicks) {
    try {
        // 1. تحديد مسار الملف بدقة داخل مجلد core/data
        const dataPath = path.join(process.cwd(), 'core', 'data', 'epoch_1.json');
        
        // 2. قراءة الملف من القرص
        const rawData = await fs.readFile(dataPath, 'utf8');
        
        // 3. تحويل النص إلى كائن جافاسكريبت
        const data = JSON.parse(rawData);
        
        // 4. البحث عن السجل المطابق
        // ملاحظة: تأكد أن القيمة في الملف هي رقم (Number)
        const targetTick = Number(totalTicks);
        const result = data.find(item => item.p === targetTick);
        
        if (result) {
            return result;
        } else {
            return { error: "لم يتم العثور على بيانات تطابق القيمة المدخلة" };
        }

    } catch (error) {
        // في حال حدوث أي خطأ (ملف مفقود، خطأ في JSON)
        return { error: "حدث خطأ في قراءة ملف البيانات: " + error.message };
    }
}

