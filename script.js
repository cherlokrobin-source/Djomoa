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

// 1. قاعدة كبس السنة الشمسية المعيارية (الاحتباس الحسابي)
function isSolarLeap(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 2. قاعدة كبس السنة القمرية (مسطرة التوفيقات الاصطلاحية لضبط شهر ذو الحجة)
function isLunarLeap(year) {
    const leapYearsCycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
    return leapYearsCycle.includes(year % 30);
}

// 3. المحرك النهائي المعدل لدعم الأفق المنفصل (Dual Horizon)
function runParallelSimulation(targetLimit, solarEndYear) {
    // إعدادات نقطة الصفر المشتركة (1 يناير سنة 1 = 1 محرم سنة 1)
    let sDay = 1, sMonth = 0, sYear = 1; 
    let lDay = 1, lMonth = 0, lYear = 1; 
    
    let totalDaysElapsed = 0; 
    
    let lunarFreezeSnapshot = null; // لتخزين لحظة تجمد القمري
    let finalSolarSnapshot = null;  // لتخزين لحظة إغلاق الشمسي

    // المرحلة الأولى: التقويمان يركضان معاً حتى يتجمد القمري عند نهاية ذو الحجة للسنة القمرية المختارة
    while (true) {
        totalDaysElapsed++;

        // وتيرة الشهور القمرية (فردي 30 وزوجي 29)
        let currentLunarMonthDays = (lMonth % 2 === 0) ? 30 : 29;
        if (lMonth === 11) { // ذو الحجة
            currentLunarMonthDays = isLunarLeap(lYear) ? 30 : 29;
        }

        // فحص شرط تجمد القمري بناءً على المدخل الحقيقي المستهدف (مثال: 49999)
        if (lYear === targetLimit && lMonth === 11 && lDay === currentLunarMonthDays) {
            let dayOfWeekIndex = (totalDaysElapsed - 1) % 7;
            lunarFreezeSnapshot = {
                lunarDate: `${lDay} ${LUNAR_MONTH_NAMES[lMonth]} ${lYear} هـ`,
                solarDateMated: `${sDay} ${SOLAR_MONTH_NAMES[sMonth]} ${sYear} م`,
                dayName: WEEK_DAYS[dayOfWeekIndex],
                daysAtFreeze: totalDaysElapsed
            };
            break; // تثبيت العداد القمري للأبد عند هذه النقطة والانتقال للمرحلة الشمسيّة المنفردة!
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

    // المرحلة الثانية: العداد الشمسي يستمر بالركض وحيداً حتى يغلق 31 ديسمبر لسنة الإغلاق المحددة (49444)
    while (true) {
        // فحص شرط إغلاق الشمسي النهائي للمشروع عند تاريخ 31 ديسمبر لسنة النهاية المطلقة
        if (sYear === solarEndYear && sMonth === 11 && sDay === 31) {
            let finalDayIndex = (totalDaysElapsed - 1) % 7; // استخراج اسم يوم الإغلاق الشمسي الدقيق
            finalSolarSnapshot = {
                solarDateFinal: `${sDay} ${SOLAR_MONTH_NAMES[sMonth]} ${sYear} م`,
                finalDayName: WEEK_DAYS[finalDayIndex],
                daysAtFinal: totalDaysElapsed
            };
            break; // إغلاق المحرك بالكامل!
        }

        totalDaysElapsed++;

        // تحريك اليوم الشمسي فقط (القمري متجمد وثابت تماماً)
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
    const targetYearInput = document.getElementById("targetYear"); // حقل إدخال السنة القمرية المستهدفة للتجميد

    if (!calcBtn || !container) return;

    calcBtn.textContent = "🚀 تشغيل المحاكاة الحية";

    calcBtn.addEventListener("click", () => {
        let chosenYear = targetYearInput ? parseInt(targetYearInput.value) : 49999;

        // حماية ميكانيكية للمحرك لمنع الانهيار بسبب مدخلات خاطئة
        if (isNaN(chosenYear) || chosenYear < 1 || chosenYear > 49999) {
            alert("الرجاء إدخال سنة صحيحة بين 1 و 49999");
            return;
        }

        // تحديد سقف الإغلاق الشمسي النهائي الثابت للمشروع بناءً على طلبك الأخير
        const ABSOLUTE_SOLAR_END = 49444; 

        // تشغيل المحاكاة الصارمة بالأفق المزدوج
        const result = runParallelSimulation(chosenYear, ABSOLUTE_SOLAR_END);

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
            <h3 style="color: #ffd54f; margin-bottom: 15px; font-size: 18px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">🏁 نتائج محاكاة الأفق المنفصل (Djomoa Engine)</h3>
            
            <div style="background: rgba(255, 179, 0, 0.08); border-radius: 8px; padding: 12px; margin-top: 10px; border-right: 4px solid #ffb300;">
                <p style="margin: 0; font-size: 14px; color: #ffb300; font-weight: bold;">🛑 محطة تجمد العداد القمري الأول:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff; line-height: 1.5;">
                    تجمد عند نهاية السنة الهجرية المحددة: <span style="color: #ffd54f; font-weight: bold;">${result.freeze.lunarDate}</span><br>
                    وكان اسم اليوم هو: <span style="color: #a7ffeb; font-weight: bold;">يوم [ ${result.freeze.dayName} ]</span><br>
                    والتاريخ الشمسي المقابل له في تلك اللحظة: <span style="color: #9ecbff; font-weight: bold;">${result.freeze.solarDateMated}</span><br>
                    إجمالي الأيام المقطوعة حتى التجميد: <span style="color: #fff; font-weight: bold;">${result.freeze.daysAtFreeze.toLocaleString()} يوماً</span>
                </p>
            </div>

            <div style="background: rgba(167, 255, 235, 0.08); border-radius: 8px; padding: 12px; margin-top: 12px; border-right: 4px solid #a7ffeb;">
                <p style="margin: 0; font-size: 14px; color: #a7ffeb; font-weight: bold;">📅 محطة إغلاق العداد الشمسي المستقل:</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff; line-height: 1.5;">
                    استمر الحساب الشمسي في مسيرته العادية وحيداً حتى أغلق عند سقف المشروع: <span style="color: #ffd54f; font-weight: bold;">${result.final.solarDateFinal}</span><br>
                    اسم يوم الإغلاق النهائي للمشروع الشمسي: <span style="color: #a7ffeb; font-weight: bold;">يوم [ ${result.final.finalDayName} ]</span><br>
                    إجمالي الأيام الكلي للمحرك عند الإغلاق التام: <span style="color: #fff; font-weight: bold;">${result.final.daysAtFinal.toLocaleString()} يوماً</span>
                </p>
            </div>

            <div style="background: rgba(255, 79, 79, 0.08); border-radius: 8px; padding: 12px; margin-top: 12px; border-right: 4px solid #ff4f4f;">
                <p style="margin: 0; font-size: 14px; color: #ff4f4f; font-weight: bold;">📊 مسافة الفارق الصافي الكلي بالأيام (الركض المنفرد):</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #fff;">
                    قطع العداد الشمسي بمفرده بعد تجمد القمري مسافة: <span style="color: #9ecbff; font-weight: bold;">${result.waitingDays.toLocaleString()} يوماً كاملة</span> لكي يقفل الدورة الشاملة للمشروع عند سنة <span style="color: #ffd54f">${ABSOLUTE_SOLAR_END} م</span>.
                </p>
            </div>
        `;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initDjomoaEngine();
});
