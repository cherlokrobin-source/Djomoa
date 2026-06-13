import DjomoaEngine from './generator.js';
// نفترض أن القواميس موجودة في نفس الملف أو مستوردة
import { SOLAR_MONTHS, LUNAR_MONTHS, DAYS_OF_WEEK } from './constants.js';

export async function getTimelineData(totalTicks) {
    try {
        // 1. استخراج البيانات المزدوجة (الشمسي والقمري) من المحرك المحدث
        const result = DjomoaEngine.getAdjustedDate(BigInt(totalTicks));
        const { absoluteIndex, solarSync, lunarSync, driftCorrection } = result;
        
        // 2. تحديد الحقبة (للوصول لبيانات الـ JSON)
        // يتم استنتاج الحقبة من الـ absoluteIndex
        const period = Math.floor(Number(absoluteIndex) / 2083333) + 1;
        
        const rawData = await fs.readFile(`./data/epoch_${period}.json`, 'utf8');
        const data = JSON.parse(rawData);
        
        // 3. البحث باستخدام المرجع المطلق (Absolute Index)
        const entry = data.find(item => item.p === absoluteIndex); 
        
        if (!entry) {
            return { error: "التاريخ خارج النطاق التاريخي الموثق" };
        }

        // 4. بناء الرد الموحد (الذي يعرض التقويمين معاً)
        return {
            absoluteIndex: absoluteIndex,
            dayName: DAYS_OF_WEEK[Number(BigInt(absoluteIndex) % 7n)],
            driftCorrection: driftCorrection.toFixed(4), // دقة التوفيق الإلهامي
            solar: {
                month: SOLAR_MONTHS[entry.solarMonthIndex],
                day: entry.solarDay,
                calculatedDayOfYear: solarSync.dayOfYear.toFixed(2)
            },
            lunar: {
                month: LUNAR_MONTHS[entry.lunarMonthIndex],
                day: entry.lunarDay,
                calculatedDayOfYear: lunarSync.dayOfYear.toFixed(2)
            }
        };

    } catch (error) {
        return { error: "فشل في معالجة المزامنة العالمية: " + error.message };
    }
}

