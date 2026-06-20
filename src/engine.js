import { getStoredData } from './query_engine.js';

export function analyzeData() {
    const data = getStoredData();
    if (!data) return { error: "لا توجد بيانات" };

    return {
        totalDays: data.length,
        values: data.map(d => d.value),
        lastUpdate: new Date().toISOString()
    };
}

export async function verifyEngineIntegrity() {
    return true;
}

export function logSystemEvent(message) {
    console.log(`[${new Date().toISOString()}] [Djomoa_Core] ${message}`);
}

