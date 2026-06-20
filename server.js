import express from 'express';
import { queryMaster, getStats } from './query_engine.js'; // تأكد من صحة مسار الاستيراد

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد Middleware لتبادل البيانات بصيغة JSON
app.use(express.json());

// سجل (Logger) بسيط لمراقبة حركة الطلبات في السيرفر
app.use((req, res, next) => {
    console.log(`📡 [Request] ${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
});

/**
 * API: الاستعلام عن حقبة (Bayan) محددة
 * مثال: GET /api/bayan/2026
 */
app.get('/api/bayan/:dayIndex', (req, res) => {
    const { dayIndex } = req.params;
    
    // استدعاء محرك الاستعلام
    const result = queryMaster(dayIndex);
    
    if (result.success) {
        res.status(200).json({
            status: "success",
            timestamp: new Date(),
            data: result.data
        });
    } else {
        res.status(404).json({
            status: "error",
            message: result.message || "البيان غير موجود في هذه الحقبة."
        });
    }
});

/**
 * API: عرض حالة النظام (Health Check)
 */
app.get('/api/status', (req, res) => {
    res.json({
        service: "Djomoa_Engine_API",
        status: "online",
        stats: getStats()
    });
});

// التعامل مع المسارات غير الموجودة (404)
app.use((req, res) => {
    res.status(404).json({ error: "المسار المطلوب غير موجود في هيكل الرزمانة." });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 [Server] الرزمانة الذهبية تعمل بكامل طاقتها على المنفذ: ${PORT}`);
});

