const DjomoaEngine = (() => {
    // الثوابت الكونية للآلة
    const SOLAR_YEAR = 365.24219;
    const LUNAR_YEAR = 354.36707;
    const MAX_INDEX = 18262109n;

    return {
        // 1. الدالة الأساسية للمحرك (التوقيت والتوافق)
        getAdjustedDate: (index) => {
            const absIndex = BigInt(index);
            const driftFactor = (absIndex === 0n) ? 0 : 
                                (Number(absIndex) % SOLAR_YEAR - Number(absIndex) % LUNAR_YEAR);
            
            const isClosingPhase = absIndex >= (MAX_INDEX - 355n);
            
            return {
                absoluteIndex: Number(absIndex),
                driftCorrection: driftFactor,
                status: isClosingPhase ? "FINAL_ALIGNMENT" : "STABLE_FLOW"
            };
        },

        // 2. حارس الإغلاق (قانون التجميد)
        getClosingStatus: (absIndex) => {
            const index = BigInt(absIndex);
            const lunarDayOfYear = Number(index % BigInt(Math.floor(LUNAR_YEAR)));
            const isEndOfLunarCycle = index >= (MAX_INDEX - 11n) && lunarDayOfYear >= 354.0;
            
            return {
                isLocked: isEndOfLunarCycle,
                status: isEndOfLunarCycle ? "LOCKED_AT_30_DHUL_HIJJAH" : "STABLE_FLOW"
            };
        }
    };
})();

export default DjomoaEngine;

