import { promises as fs } from 'fs';
import { generateEpoch } from './generator.js';

async function runAutoArchive() {
    try {
        console.log(`[*] بدء جلسة الأرشفة الموقعة: ${new Date().toISOString()}`);
        
        const data = { status: "Daily Pulse", memory: "Digital Archive" };
        const newEpoch = await generateEpoch(data);
        
        const fileName = `./Golden_Calendar/epoch_${Date.now()}.json`;
        await fs.writeFile(fileName, JSON.stringify(newEpoch, null, 2));
        
        console.log(`[SUCCESS] تم توقيع وأرشفة العصر الجديد: ${newEpoch.signature.substring(0, 16)}...`);
    } catch (err) {
        console.error("[ERROR] فشل في عملية الأرشفة الموقعة:", err);
    }
}

runAutoArchive();

