import fs from 'fs/promises';

async function extractAllData() {
    // قراءة "الصفر المطلق"
    const data = await fs.readFile('master_origin.json', 'utf8');
    const masterData = JSON.parse(data);
    
    console.log("--- جاري تدوين الأيام والشهور في سجلات مجزأة ---");

    // نجمع البيانات حسب الشهر والسنة لسهولة التصفح
    let currentFile = null;
    let buffer = [];

    for (const day of masterData) {
        // ننشئ اسم ملف يعبر عن السنة والشهر
        const fileName = `data_y${day.year}_${day.s_m}.json`;
        
        buffer.push(day);

        // عندما نصل لنهاية الشهر (حوالي 30-31 يوماً)، نكتب الملف ونفرغ الذاكرة
        if (day.s_d === 30 || day.s_d === 31 || day.d === masterData.length) {
            await fs.writeFile(fileName, JSON.stringify(buffer));
            buffer = [];
        }
    }
    
    console.log("تم استخراج السجل الكامل وتوزيعه بنجاح.");
}

extractAllData();

