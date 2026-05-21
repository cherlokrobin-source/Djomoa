// ====================================================
// Djomoa Engine - Clean Dual Calendar Core
// ====================================================

// ================== CONSTANTS ==================
const WEEK_DAYS = ["الجمعة", "السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس"];

const SOLAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const SOLAR_MONTH_NAMES = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

const LUNAR_MONTH_NAMES = [
  "محرم","صفر","ربيع الأول","ربيع الآخر","جمادى الأولى","جمادى الآخرة",
  "رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة"
];

const SOLAR_END_YEAR = 49444;

// ================== LEAP RULES ==================
function isSolarLeap(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function isLunarLeap(year) {
  const cycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  return cycle.includes(year % 30);
}

// ================== CORE CALCULATOR ==================

// تحويل تاريخ شمسي إلى أيام منذ البداية (منظم)
function solarToDays(y, m, d) {
  let days = 0;

  for (let i = 1; i < y; i++) {
    days += isSolarLeap(i) ? 366 : 365;
  }

  // مراجعة الأشهر السابقة للشهر الحالي
  for (let i = 0; i < m - 1; i++) {
    if (i === 1 && isSolarLeap(y)) days += 29;
    else days += SOLAR_MONTH_DAYS[i];
  }

  return days + d;
}

// تحويل تاريخ قمري إلى أيام (نموذج منتظم متناوب)
function lunarToDays(y, m, d) {
  let days = 0;

  for (let i = 1; i < y; i++) {
    days += isLunarLeap(i) ? 355 : 354;
  }

  for (let i = 0; i < m - 1; i++) {
    if (i === 11) days += isLunarLeap(y) ? 30 : 29;
    else days += (i % 2 === 0) ? 30 : 29;
  }

  return days + d;
}

// ================== CONVERTER ==================
function daysToSolar(days) {
  let y = 1;

  while (days >= (isSolarLeap(y) ? 366 : 365)) {
    days -= isSolarLeap(y) ? 366 : 365;
    y++;
  }

  let m = 0;
  // مصفوفة أيام السنة الحالية للأشهر
  let currentYearMonths = [...SOLAR_MONTH_DAYS];
  if (isSolarLeap(y)) currentYearMonths[1] = 29;

  while (days >= currentYearMonths[m]) {
    days -= currentYearMonths[m];
    m++;
  }

  return { year: y, month: m, day: days + 1 };
}

// ================== ENGINE CORE ==================
function runDjomoaEngine(lunarTargetYear, solarEndYear = SOLAR_END_YEAR) {

  // 1. نقطة التجميد القمري (29 ذو الحجة هو الشهر 12)
  const freezeDays = lunarToDays(lunarTargetYear, 12, 29);

  const freezeSolar = daysToSolar(freezeDays);

  // 2. نهاية المشروع الشمسي
  const solarEndDays = solarToDays(solarEndYear, 12, 31);

  // 3. الفرق التراكمي للانتظار
  const waitingDays = solarEndDays - freezeDays;

  return {
    freeze: {
      lunarYear: lunarTargetYear,
      lunarMonth: "ذو الحجة",
      lunarDay: 29,
      solarAtFreeze: freezeSolar,
      freezeDays
    },
    final: {
      solarYear: solarEndYear,
      solarMonth: "ديسمبر",
      solarDay: 31,
      solarEndDays
    },
    waitingDays
  };
}

// ================== SEARCH & UI HOOK MIGRATION ==================
function initDjomoaEngine() {
  
  // ربط محرك البحث المتقدم بالدالة العالمية لزر صفحة البحث
  window.performSearch = function() {
    const input = document.getElementById('searchInput');
    const resultDiv = document.getElementById('searchResultArea');
    
    if (!input) return;
    const yearValue = input.value.trim();
    
    if (!yearValue) {
        alert('الرجاء إدخال رقم السنة الشمسية.');
        return;
    }
    const year = parseInt(yearValue);
    if (isNaN(year) || year < 1 || year > 49999) {
        alert('الرجاء إدخال سنة صحيحة بين 1 و 49999');
        return;
    }

    // تشغيل الحسابات الرياضية للمحرك عند السنة المدخلة
    const engineData = runDjomoaEngine(year);
    
    // إخراج النتائج وتحديثها في قالب الواجهة الفاخرة
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `
        <h3 style="color:#ffd54f; margin-bottom:15px; font-size:1.1rem; text-align:right;">📅 نتائج التحليل الفلكي الفوري للسنة: ${year}</h3>
        <div class="result-item" style="text-align:right; direction:rtl; line-height:1.7;">
            <strong>📖 نقطة المحاذاة والالتقاء:</strong><br>
            السنة القمرية المستهدفة تتطابق مع اليوم الشمسي: 
            <span style="color:#ffd54f;">${engineData.freeze.solarAtFreeze.day} / ${SOLAR_MONTH_NAMES[engineData.freeze.solarAtFreeze.month]} / ${engineData.freeze.solarAtFreeze.year}</span>
            <br>
            <strong>⏳ الأيام المتبقية لنهاية الدورة الكبرى:</strong><br>
            الفارق التراكمي الزمني حتى نهاية الحساب هو: <span style="color:#ffd54f;">${engineData.waitingDays.toLocaleString()} يوم</span>.
        </div>
    `;

    // تحديث تفاعلي فوري لبيانات الـ 3D Timeline لتعكس السنة التي يبحث عنها المستخدم!
    update3DTimeline(engineData);
  };
}

// ================== 3D TIMELINE DYNAMIC UPDATE ==================
function update3DTimeline(data) {
    const syncPointer = document.querySelector('.pointer-sync');
    const endPointer = document.querySelector('.pointer-end');
    
    if (syncPointer) {
        // تحديث كرات التزامن العلوية والسفلية بناءً على المدخلات الحية للمحرك
        const solarDateStr = `${data.freeze.solarAtFreeze.day} ${SOLAR_MONTH_NAMES[data.freeze.solarAtFreeze.month]} ${data.freeze.solarAtFreeze.year}`;
        const lunarDateStr = `${data.freeze.lunarDay} ${data.freeze.lunarMonth} ${data.freeze.lunarYear}`;
        
        syncPointer.setAttribute('data-top', `تزامن شمسي: ${solarDateStr}`);
        syncPointer.setAttribute('data-bottom', `مقابل قمري: ${lunarDateStr}`);
    }
    
    if (endPointer) {
        endPointer.setAttribute('data-bottom', `الفارق الكلي: ${data.waitingDays.toLocaleString()} يوم`);
    }
}

// ================== CLOCK SIMULATION ==================
function updateDateTime() {
    const solarTimeEl = document.getElementById('solar-time');
    const lunarTimeEl = document.getElementById('lunar-time');
    const currentDateEl = document.getElementById('current-date');

    if (!solarTimeEl || !lunarTimeEl || !currentDateEl) return;

    const now = new Date();
    const solarHours = now.getHours().toString().padStart(2, '0');
    const solarMinutes = now.getMinutes().toString().padStart(2, '0');
    solarTimeEl.innerText = `${solarHours}:${solarMinutes}`;
    
    // حساب الساعة القمرية التقديرية بدقة دورية متناسبة
    const lunarHour = (now.getHours() + 6) % 24;
    lunarTimeEl.innerText = `${lunarHour.toString().padStart(2, '0')}:${solarMinutes}`;
    
    // التاريخ الفعلي الحالي
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const yearNum = now.getFullYear();
    currentDateEl.innerText = `${day} / ${month} / ${yearNum}`;
}

// ================== INITIALIZATION ==================
document.addEventListener("DOMContentLoaded", () => {
    initDjomoaEngine();
    updateDateTime();
    setInterval(updateDateTime, 1000);
});
