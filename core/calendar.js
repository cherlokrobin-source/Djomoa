function printCalendarPure(year) {
    const months = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];
    
    // عدد الأيام في كل شهر (مع مراعاة سنة كبيسة بسيطة إذا كانت تقبل القسمة على 4)
    const daysInMonths = [31, (year % 4 === 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    const daysOfWeek = ["الجمعة", "السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

    console.log(`--- رزنامة سنة ${year} (مرجعية: الجمعة هي البداية المطلقة) ---`);

    let dayCounter = 0; // الجمعة هو نقطة الصفر

    for (let month = 0; month < 12; month++) {
        console.log(`\nشهر: ${months[month]}`);
        
        for (let day = 1; day <= daysInMonths[month]; day++) {
            console.log(`${day} ${months[month]} (${daysOfWeek[dayCounter % 7]})`);
            dayCounter++;
        }
    }
}

// تنفيذ المحرك للسنة 1
printCalendarPure(1);

