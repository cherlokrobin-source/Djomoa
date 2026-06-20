import fs from 'fs/promises';

async function generateCalibratedMaster() {
    const totalDays = 761000;
    const solarMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const lunarMonths = ["محرم", "صفر", "ربيع الأول", "ربيع الثاني", "جمادى الأول", "جمادى الثاني", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];

    let masterData = [];
    let yearCount = 1;
    let currentDayOfYear = 0;

    for (let i = 0; i < totalDays; i++) {
        // معادلة الكبس المتقدمة
        let isLeap = (yearCount % 4 === 0 && (yearCount % 100 !== 0 || yearCount % 400 === 0));
        let daysInYear = isLeap ? 366 : 365;

        // دقة حساب الشهر الشمسي
        let monthIndex = Math.floor(currentDayOfYear / 30.44); 
        if (monthIndex > 11) monthIndex = 11;

        // دقة حساب الشهر القمري
        let lunarMonthIndex = Math.floor((i % 354.367) / 29.53);

        masterData.push({
            d: i + 1,
            s_m: solarMonths[monthIndex],
            l_m: lunarMonths[lunarMonthIndex],
            year: yearCount,
            status: isLeap ? "سنة كبيسة" : "سنة بسيطة"
        });

        currentDayOfYear++;
        if (currentDayOfYear >= daysInYear) {
            currentDayOfYear = 0;
            yearCount++;
        }
    }

    await fs.writeFile('master_origin.json', JSON.stringify(masterData));
    console.log("تم تدوين المرجع المعاير في master_origin.json.");
}

generateCalibratedMaster();

