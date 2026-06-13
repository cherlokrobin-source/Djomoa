/** * DJOMOA ENGINE - DUAL-CALENDAR SYNCHRONIZATION
 * معالجة التقويمين الشمسي والقمري بالتوازي
 */
const DjomoaEngine = (() => {
    const ADAM_EPOCH_INDEX = 0n; 
    const SOLAR_YEAR = 365.24219;
    const LUNAR_YEAR = 354.36707;

    return {
        // حساب الرقم المسلسل (المرجع الموحد للتقويمين)
        getAbsoluteIndex: (totalTicks) => {
            return BigInt(totalTicks) + ADAM_EPOCH_INDEX;
        },

        // موازنة التقويمين (الجوهر الرياضي لـ "التوفيقات الإلهامية")
        syncCalendars: (absoluteIndex) => {
            const index = Number(absoluteIndex);
            
            // تحديد الموقع في الدورة الشمسية
            const solarDayOfYear = index % SOLAR_YEAR;
            
            // تحديد الموقع في الدورة القمرية
            const lunarDayOfYear = index % LUNAR_YEAR;
            
            // "معامل التوافق" هو الفارق التراكمي الذي يصحح به المحرك نفسه
            const driftFactor = solarDayOfYear - lunarDayOfYear;
            
            return {
                solar: { dayOfYear: solarDayOfYear },
                lunar: { dayOfYear: lunarDayOfYear },
                drift: driftFactor
            };
        },

        getAdjustedDate: (totalTicks) => {
            const absIndex = DjomoaEngine.getAbsoluteIndex(totalTicks);
            const sync = DjomoaEngine.syncCalendars(absIndex);
            
            return {
                absoluteIndex: Number(absIndex),
                solarSync: sync.solar,
                lunarSync: sync.lunar,
                driftCorrection: sync.drift // هذا هو التصحيح الذي سيجعل المحرك "عالمياً"
            };
        }
    };
})();

export default DjomoaEngine;

