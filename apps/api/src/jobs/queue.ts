import { Queue, Worker } from 'bullmq';
import { env } from '../config';

export const syncQueue = new Queue('napams-sync', {
  connection: { url: env.REDIS_URL }
});

export const syncWorker = new Worker('napams-sync', async job => {
  console.log(`Processing job ${job.id} of type ${job.name}`);
}, { connection: { url: env.REDIS_URL } });
