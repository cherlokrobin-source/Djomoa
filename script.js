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

// تحويل تاريخ شمسي إلى أيام منذ البداية (تقريبي ومنظم)
function solarToDays(y, m, d) {
  let days = 0;

  for (let i = 1; i < y; i++) {
    days += isSolarLeap(i) ? 366 : 365;
  }

  for (let i = 0; i < m; i++) {
    if (i === 1 && isSolarLeap(y)) days += 29;
    else days += SOLAR_MONTH_DAYS[i];
  }

  return days + d;
}

// تحويل تاريخ قمري إلى أيام (نموذج مبسط ثابت)
function lunarToDays(y, m, d) {
  let days = 0;

  for (let i = 1; i < y; i++) {
    days += 354;
  }

  for (let i = 0; i < m; i++) {
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

  while (days >= SOLAR_MONTH_DAYS[m]) {
    days -= SOLAR_MONTH_DAYS[m];
    m++;
  }

  return { year: y, month: m, day: days + 1 };
}

// ================== ENGINE CORE ==================
function runDjomoaEngine(lunarTargetYear, solarEndYear = SOLAR_END_YEAR) {

  // 1. نقطة التجميد القمري
  const freezeDays = lunarToDays(lunarTargetYear, 11, 29);

  const freezeSolar = daysToSolar(freezeDays);

  // 2. نهاية المشروع الشمسي
  const solarEndDays = solarToDays(solarEndYear, 11, 31);

  // 3. الفرق
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

// ================== UI HOOK ==================
function initDjomoaEngine() {
  const btn = document.getElementById("calcBtn");
  const input = document.getElementById("targetYear");

  if (!btn) return;

  btn.addEventListener("click", () => {

    const year = input ? parseInt(input.value) : 49999;

    if (isNaN(year) || year < 1 || year > 49999) {
      alert("أدخل سنة بين 1 و 49999");
      return;
    }

    const result = runDjomoaEngine(year);

    let box = document.getElementById("engineResult");

    if (!box) {
      box = document.createElement("div");
      box.id = "engineResult";
      document.body.appendChild(box);
    }

    box.style.cssText = `
      margin-top:20px;
      padding:15px;
      background:#111;
      color:#fff;
      border-radius:10px;
      font-family:Arial;
      direction:rtl;
    `;

    box.innerHTML = `
      <h3>نتائج المحرك الزمني</h3>

      <p><b>تجميد قمري:</b> سنة ${result.freeze.lunarYear} - ${result.freeze.lunarMonth}</p>
      <p><b>اليوم الشمسي عند التجميد:</b> ${result.freeze.solarAtFreeze.year} / ${result.freeze.solarAtFreeze.month + 1} / ${result.freeze.solarAtFreeze.day}</p>

      <hr>

      <p><b>نهاية المشروع الشمسي:</b> ${result.final.solarYear} / 12 / 31</p>

      <p><b>الفارق بالأيام:</b> ${result.waitingDays.toLocaleString()}</p>
    `;
  });
}

// ================== START ==================
document.addEventListener("DOMContentLoaded", initDjomoaEngine);