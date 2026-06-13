import fs from 'fs/promises';

async function generateCompressedMaster() {
    // إجمالي الأيام للحقبة الأولى (2083.333 سنة)
    const totalDays = Math.floor(2083.333 * 365.25);
    const dayNames = ["الجمعة", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
    
    // أسماء الشهور لضمان الدقة
    const solarMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const lunarMonths = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأول", "جمادى الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];
    
    let masterData = [];
    let currentDayOfYear = 0;
    let yearCount = 1;

    for (let i = 0; i < totalDays; i++) {
        // قاعدة الكبس والحبس: السنة الرابعة دائماً كبيسة (حبس اليوم الإضافي)
        let isLeap = (yearCount % 4 === 0);
        let daysInYear = isLeap ? 366 : 365;

        let sDay = currentDayOfYear + 1;
        
        masterData.push({
            d: i + 1,
            n: dayNames[i % 7],
            s_d: sDay,
            s_m: solarMonths[Math.floor(sDay / 30.5)],
            l_d: (i % 29.53) + 1,
            l_m: lunarMonths[Math.floor((i % 29.53) / 2.46)],
            year: yearCount,
            status: isLeap ? "حبس" : "كبس"
        });

        currentDayOfYear++;
        if (currentDayOfYear >= daysInYear) {
            currentDayOfYear = 0;
            yearCount++;
        }
    }

    await fs.writeFile('master_origin.json', JSON.stringify(masterData));
    console.log("تم تدوين نقطة الصفر وتطبيق دورة الكبس والحبس في master_origin.json.");
}

generateCompressedMaster();

