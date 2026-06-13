import express from 'express';
import cors from 'cors';
<<<<<<< HEAD
import { getTimelineData } from './core/query.js';
const app = express();
app.use(cors());
app.use(express.static('./public'));
app.get('/api/search', async (req, res) => {
    const result = await getTimelineData(req.query.ticks);
    res.json(result);
});
app.listen(3000, () => console.log('السيرفر يعمل على http://localhost:3000'));
=======
import { getTimelineData } from './query.js';

const app = express();
app.use(cors());

app.get('/api/search', async (req, res) => {
    try {
        const result = await getTimelineData(req.query.ticks);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: "خطأ في المعالجة" });
    }
});

app.listen(3000, () => console.log('الرزنامة الذهبية جاهزة على http://localhost:3000'));

>>>>>>> 5f9e08e94bd628f6fca5dfd7174648938da9334d
