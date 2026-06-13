import fs from 'fs/promises';
import { getEngineSystem } from './epoch_engine.js';

async function generateSingleEpoch(epochNumber) {
    const engine = await getEngineSystem(epochNumber);
    const totalYears = epochNumber * 2083.333;
    const drift = engine.calculateDrift(totalYears);
    
    const epochData = {
        epoch: epochNumber,
        endYear: totalYears.toFixed(3),
        cumulativeDrift: drift.toFixed(6),
        status: "Aligned",
        generatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(`epoch_${epochNumber}.json`, JSON.stringify(epochData, null, 4));
    console.log(`تم تدوين الحقبة ${epochNumber} بنجاح في epoch_${epochNumber}.json`);
}

// يمكنك تغيير الرقم هنا يدوياً لتوليد الحقبة المطلوبة
const targetEpoch = 1; 
generateSingleEpoch(targetEpoch);

