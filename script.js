// ====================================================
//    Djomoa Core Engine: Parallel Boundary Simulator
// ====================================================

// مصفوفة الأيام (نقطة الصفر الثابتة للمشروع: اليوم 1 هو الجمعة)
const WEEK_DAYS = ["الجمعة", "السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

// أطوال الشهور الشمسية المعيارية
const SOLAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// أسماء الشهور للعرض في الواجهة
const SOLAR_MONTH_NAMES = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const LUNAR_MONTH_NAMES = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"];

// 1. قاعدة كبس السنة الشمسية المعيارية
function isSolarLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 2. قاعدة كبس السنة القمرية (الدورة الاصطلاحية الثلاثينية لضبط شهر ذو الحجة)
function isLunarLeap(year) {
    const leapYearsCycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    return leapYearsCycle.includes(year % 30);
}

// 3. المحرك النهائي: تعديل الدالة لتستقبل السنة المطلوبة ديناميكياً
function runParallelSimulation(targetLimit) {
    // إعدادات نقطة الصفر المشتركة (1 يناير سنة 1 = 1 محرم سنة 1)
    let sDay = 1, sMonth = 0, sYear = 1; 
    let lDay = 1, lMonth = 0, lYear = 1; 
    
    let totalDaysElapsed = 0; 
    
    let lunarFreezeSnapshot = null; // لتخزين لحظة تجمد القمري
    let finalSolarSnapshot = null;  // لتخزين لحظة إغلاق الشمسي

    // المرحلة الأولى: التقويمان يركضان معاً حتى يتجمد القمري عند نهاية ذو الحجة للسنة المختارة
    while (true) {
        totalDaysElapsed++;

        // وتيرة الشهور القمرية (فردي 30 وزوجي 29)
        let currentLunarMonthDays = (lMonth % 2 === 0) ? 30 : 29;
        if (lMonth === 11) { // ذو الحجة
            currentLunarMonthDays = isLunarLeap(lYear) ? 30 : 29;
        }

        // فحص شرط تجمد القمري بناءً على المدخل الحقيقي المستهدف
        if (lYear === targetLimit && lMonth === 11 && lDay === currentLunarMonthDays) {
            let dayOfWeekIndex = (totalDaysElapsed - 1) % 7;
            lunarFreezeSnapshot = {
                lunarDate: `${lDay} ${LUNAR_MONTH_NAMES[lMonth]} ${lYear} هـ`,
                solarDateMated: `${sDay} ${SOLAR_MONTH_NAMES[sMonth]} ${sYear} م`,
                dayName: WEEK_DAYS[dayOfWeekIndex],
                daysAtFreeze: totalDaysElapsed
            };
            break; // كسر الحلقة الأولى وتثبيت العداد القمري للأبد عند هذه النقطة!
        }

        // تحريك اليوم القمري
        lDay++;
        if (lDay > currentLunarMonthDays) {
            lDay = 1;
            lMonth++;
            if (lMonth > 11) {
                lMonth = 0;
                lYear++;
            }
        }

        // تحريك اليوم الشمسي بالتوازي
        let currentSolarMonthDays = SOLAR_MONTH_DAYS[sMonth];
        if (sMonth === 1 && isSolarLeap(sYear)) { currentSolarMonthDays = 29; }

        sDay++;
        if (sDay > currentSolarMonthDays) {
            sDay = 1;
            sMonth++;
            if (sMonth > 11) {
                sMonth = 0;
                sYear++;
            }
        }
    }

    // المرحلة الثانية: العداد الشمسي يستمر بالركض وحيداً حتى يغلق 31 ديسمبر لنفس رقم السنة المحددة
    while (true) {
        // فحص شرط إغلاق الشمسي النهائي للمشروع بناءً على المدخل الديناميكي
        if (sYear === targetLimit && sMonth === 11 && sDay === 31) {
            let finalDayIndex = totalDaysElapsed % 7; // استخراج اسم يوم الإغلاق الشمسي
            finalSolarSnapshot = {
                solarDateFinal: `${sDay} ${SOLAR_MONTH_NAMES[sMonth]} ${sYear} م`,
                finalDayName: WEEK_DAYS[finalDayIndex],
                daysAtFinal: totalDaysElapsed
            };
            break; // إغلاق المحرك بالكامل!
        }

        totalDaysElapsed++;

        // تحريك اليوم الشمسي فقط
        let currentSolarMonthDays = SOLAR_MONTH_DAYS[sMonth];
        if (sMonth === 1 && isSolarLeap(sYear)) { currentSolarMonthDays = 29; }

        sDay++;
        if (sDay > currentSolarMonthDays) {
            sDay = 1;
            sMonth++;
            if (sMonth > 11) {
                sMonth = 0;
                sYear++;
            }
        }
    }

    // حساب صافي الفارق بالأيام التي قطعها الشمسي بمفرده بعد تجمد القمري
    let netWaitingDays = finalSolarSnapshot.daysAtFinal - lunarFreezeSnapshot.daysAtFreeze;

    return {
        freeze: lunarFreezeSnapshot,
        final: finalSolarSnapshot,
        waitingDays: netWaitingDays
    };
}

// 4. ربط المحرك بالواجهة الرسومية التفاعلية للموقع
function initDjomoaEngine() {
    const calcBtn = document.getElementById("calcBtn") || document.querySelector(".searchBox button");
    const container = document.querySelector(".searchBox");
    const targetYearInput = document.getElementById("targetYear"); // ربط الحقل النصي الرقمي

    if (!calcBtn || !container) return;

    calcBtn.textContent = "🚀 تشغيل المحاكاة الحية";

    calcBtn.addEventListener("click", () => {
        // قراءة قيمة الحقل البرمي وتحويلها لرقم، وفي حال عدم وجود حقل إدخال يتم الاعتماد على 49999 كقيمة افتراضية
        let chosenYear = targetYearInput ? parseInt(targetYearInput.value) : 49999;

        // حماية ميكانيكية للمحرك لمنع الانهيار بسبب مدخلات خاطئة
        if (isNaN(chosenYear) || chosenYear < 1 || chosenYear > 49999) {
            alert("الرجاء إدخال سنة صحيحة بين 1 و 49999");
            return;
        }

        // تشغيل المحاكاة الصارمة بالسنة المحددة
        const result = runParallelSimulation(chosenYear);

        let resultBox = document.getElementById("engineResult");
        if (!resultBox) {
            resultBox = document.createElement("div");
            resultBox.id = "engineResult";
            resultBox.style.marginTop = "25px";
            resultBox.style.padding = "20px";
            resultBox.style.background = "rgba(0, 0, 0, 0.85)";
            resultBox.style.borderRadius = "16px";
            resultBox.style.border = "2px solid #ffd54f";
            resultBox.style.textAlign = "right";
            container.appendChild(resultBox);
        }

        resultBox.innerHTML = `
            <h3 style="color: #ffd54f; margin-bottom: 15px; font-size: 18px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">🏁 نتائج محاكاة خط النهاية للسنة [ ${chosenYear} ]</h3>
            
            <div style="background: rgba(255, 179, 0, 0.08); border-radius: 8px; padding: 12px; margin-top: 10px; border-right: 4px solid #ffb300;">
                <p style="margin: 0; font-size: 14px; color: #ffb300; font-weight: bold;">🛑 محطة تجمد العداد القمري الأول:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff; line-height: 1.5;">
                    تجمد عند نهاية السنة الهجرية: <span style="color: #ffd54f; font-weight: bold;">${result.freeze.lunarDate}</span><br>
                    وكان اسم اليوم هو: <span style="color: #a7ffeb; font-weight: bold;">يوم [ ${result.freeze.dayName} ]</span><br>
                    والتاريخ الشمسي المقابل له في تلك اللحظة الكونية: <span style="color: #9ecbff; font-weight: bold;">${result.freeze.solarDateMated}</span>
                </p>
            </div>

            <div style="background: rgba(167, 255, 235, 0.08); border-radius: 8px; padding: 12px; margin-top: 12px; border-right: 4px solid #a7ffeb;">
                <p style="margin: 0; font-size: 14px; color: #a7ffeb; font-weight: bold;">📅 محطة إغلاق العداد الشمسي اللاحق:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff; line-height: 1.5;">
                    استمر وحيداً حتى أغلق نهاية السنة الميلادية: <span style="color: #ffd54f; font-weight: bold;">${result.final.solarDateFinal}</span><br>
                    اسم يوم الإغلاق النهائي للمشروع الشمسي: <span style="color: #a7ffeb; font-weight: bold;">يوم [ ${result.final.finalDayName} ]</span>
                </p>
            </div>

            <div style="background: rgba(255, 79, 79, 0.08); border-radius: 8px; padding: 12px; margin-top: 12px; border-right: 4px solid #ff4f4f;">
                <p style="margin: 0; font-size: 14px; color: #ff4f4f; font-weight: bold;">📊 مسافة الفارق الصافي الكلي بالأيام:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff;">
                    قطع العداد الشمسي بمفرده بعد تجمد القمري مسافة: <span style="color: #9ecbff; font-weight: bold;">${result.waitingDays.toLocaleString()} يوماً كاملة</span> لكي يلحق برقم السنة ويقفل الدورة الشاملة.
                </p>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDjomoaEngine();
});
