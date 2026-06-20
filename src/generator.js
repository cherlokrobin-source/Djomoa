import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import path from 'path';

// دالة توليد التوقيع الرقمي (الختم الذهبي)
function signEpoch(data, previousSignature) {
    const hash = createHash('sha256');
    hash.update(JSON.stringify(data) + previousSignature);
    return hash.digest('hex');
}

// دالة توليد العصر مع التوقيع
export async function generateEpoch(dataPayload) {
    const calendarDir = './Golden_Calendar';
    
    // 1. جلب التوقيع السابق لضمان سلسلة الحماية
    let previousSignature = "INITIAL_SEED_2026_DJOMOA"; // البذرة الأولى
    try {
        const files = (await fs.readdir(calendarDir)).sort();
        if (files.length > 0) {
            const lastFile = await fs.readFile(path.join(calendarDir, files[files.length - 1]), 'utf-8');
            const lastEpoch = JSON.parse(lastFile);
            previousSignature = lastEpoch.signature;
        }
    } catch (e) {
        console.log("[INFO] لا توجد عصور سابقة، بدء سلسلة جديدة.");
    }

    // 2. هيكل العصر الذهبي
    const epoch = {
        timestamp: new Date().toISOString(),
        data: dataPayload,
        previousSignature: previousSignature
    };

    // 3. التوقيع الرقمي للعصر الحالي
    epoch.signature = signEpoch(epoch, previousSignature);

    return epoch;
}

