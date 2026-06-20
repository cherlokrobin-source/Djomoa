import DjomoaEngine from './generator.js';

let currentTick = 0n;
const SPEED = 50000n;
const FINAL_DAY = 18262109n;
<<<<<<< HEAD
=======
const ERA_ENDS = Array.from({length: 24}, (_, i) => BigInt((i + 1) * 761755));
>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d

const monthsSolar = ["كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول"];
const daysOfWeek = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const colors = {
    reset: "\x1b[0m", cyan: "\x1b[36m", yellow: "\x1b[33m",
<<<<<<< HEAD
    green: "\x1b[32m", red: "\x1b[31m", magenta: "\x1b[35m"
=======
    green: "\x1b[32m", red: "\x1b[31m", magenta: "\x1b[35m",
    blink: "\x1b[5m", invert: "\x1b[7m"
>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d
};

function runMonitor() {
    if (currentTick >= FINAL_DAY) {
<<<<<<< HEAD
=======
        process.stdout.write("\u0007");
        console.clear();
        console.log(`${colors.red}${colors.invert} !!! END OF TIME: 31 DECEMBER 49999 !!! ${colors.reset}`);
>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d
        process.exit(0);
    }

    currentTick += SPEED;
    const dateData = DjomoaEngine.getAdjustedDate(currentTick);
    const lockStatus = DjomoaEngine.getClosingStatus(currentTick);
    
    const totalDays = Number(currentTick);
    const years = Math.floor(totalDays / 365.24219);
    const monthIndex = Math.floor((totalDays % 365.24219) / 30.44);
    const dayOfWeekIndex = totalDays % 7;

    console.clear();
<<<<<<< HEAD
    console.log(`${colors.cyan}=== [ DJOMOA CHRONOLOGY ENGINE ] ===${colors.reset}`);
    console.log(`${colors.yellow}التاريخ:${colors.reset} ${daysOfWeek[dayOfWeekIndex]}, ${monthsSolar[monthIndex]}، السنة ${years}`);
    console.log(`${colors.magenta}النبضة (Tick):${colors.reset} ${dateData.absoluteIndex}`);
    console.log(`حالة المحرك: ${lockStatus.isLocked ? colors.red + "LOCKED" : colors.green + "STABLE"}${colors.reset}`);
    console.log(`${colors.cyan}===================================${colors.reset}`);
}

setInterval(runMonitor, 100);

=======
    console.log(`${colors.cyan}=== [ DJOMOA CHRONOLOGY ENGINE: V1.0 ] ===${colors.reset}`);
    console.log(`${colors.yellow}التاريخ:${colors.reset} ${daysOfWeek[dayOfWeekIndex]}, ${monthsSolar[monthIndex]}، السنة ${years}`);
    console.log(`${colors.magenta}النبضة (Tick):${colors.reset} ${dateData.absoluteIndex}`);

    const eraIndex = ERA_ENDS.findIndex(end => currentTick >= end && currentTick <= end + SPEED);
    if (eraIndex !== -1) {
        console.log(`${colors.yellow}${colors.blink}>>> تنبيه: نهاية الحقبة ${eraIndex + 1} <<<${colors.reset}`);
    }

    console.log(`حالة المحرك: ${lockStatus.isLocked ? colors.red + "LOCKED" : colors.green + "STABLE"}${colors.reset}`);
    console.log(`${colors.cyan}===========================================${colors.reset}`);
}

setInterval(runMonitor, 100);
>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d
