import { startDjomoaProcess } from './engine/engine_albab.js';
import events from './mustawda/events_db.json' assert { type: 'json' };

// البدء بضخ البيانات في المحرك
startDjomoaProcess(events);

