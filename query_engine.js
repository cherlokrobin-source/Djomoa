import fs from 'fs/promises';

async function queryMaster(dayIndex) {
    const data = await fs.readFile('master_origin.json', 'utf8');
    const masterData = JSON.parse(data);
    
    // البحث عن اليوم المطلوب
    const result = masterData.find(d => d.d === dayIndex);
    
    if (result) {
        console.log("--- استعلام عن اليوم التراكمي ---");
        console.log(result);
    } else {
        console.log("اليوم غير موجود في المخطط.");
    }
}

// استعلم عن اليوم 1 (الصفر المطلق)
queryMaster(1);

