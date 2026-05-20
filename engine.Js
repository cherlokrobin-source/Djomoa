// engine.js
// محرك بسيط: بحث + نظام حساب قابل للتطوير (قمري/شمسي لاحقًا)

const Engine = {
    
    // 🔍 محرك البحث البسيط داخل الموقع
    search(query, data) {
        if (!query) return [];

        query = query.toLowerCase();

        return data.filter(item => {
            return item.title.toLowerCase().includes(query) ||
                   item.description.toLowerCase().includes(query);
        });
    },

    // 📅 تحويل تاريخ بسيط (قابل للتطوير لاحقًا إلى قمري/شمسي)
    convertDate(dateString) {
        const date = new Date(dateString);

        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            iso: date.toISOString()
        };
    },

    // 🧠 مثال: نظام حساب تراكمي (يمكن ربطه بفكرتك)
    cumulativeDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const diff = end - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    },

    // ⚙️ نقطة توسعة لاحقة (للقمر/الشمس)
    lunarSolarEngine(year) {
        // هنا سنضيف خوارزمية الرزنامة التي تعمل عليها
        return {
            lunar: "قيد التطوير",
            solar: "قيد التطوير",
            inputYear: year
        };
    }
};

export default Engine;