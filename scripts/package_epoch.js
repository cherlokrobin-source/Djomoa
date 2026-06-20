import fs from 'fs/promises';
import path from 'path';

async function packageEpoch() {
    const directory = './'; // المجلد الحالي الذي يحتوي على ملفات data_y...
    const files = await fs.readdir(directory);
    
    // فلترة الملفات الخاصة بالحقبة الأولى فقط
    const epochFiles = files.filter(f => f.startsWith('data_y') && f.endsWith('.json'));
    
    console.log(`جاري تجميع ${epochFiles.length} ملفاً في سجل واحد...`);
    
    let fullArchive = [];

    for (const file of epochFiles) {
        const content = await fs.readFile(path.join(directory, file), 'utf8');
        const data = JSON.parse(content);
        fullArchive = fullArchive.concat(data);
    }

    // كتابة الملف النهائي الموحد
    await fs.writeFile('full_epoch_1_archive.json', JSON.stringify(fullArchive));
    console.log("تم تجميع السجل الزمني الكامل في ملف: full_epoch_1_archive.json");
}

packageEpoch();

