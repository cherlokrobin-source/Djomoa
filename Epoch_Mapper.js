import { getEngineSystem } from './epoch_engine.js';

async function mapTimeline() {
    console.log("--- سلسلة نمو الانحراف التراكمي (التوفيق الإلهامي) ---");
    console.log("الحقبة | السنة المطلقة | الانحراف المتراكم");
    console.log("-----------------------------------------------");

    for (let i = 1; i <= 24; i++) {
        const engine = await getEngineSystem(i);
        // الزمن الكلي التراكمي حتى نهاية الحقبة i
        let totalYears = i * 2083.333;
        let cumulativeDrift = engine.calculateDrift(totalYears);
        
        console.log(`حقبة ${i.toString().padStart(2, ' ')} | ${totalYears.toFixed(3)} | ${cumulativeDrift.toFixed(6)}`);
    }
    console.log("-----------------------------------------------");
}

mapTimeline();

