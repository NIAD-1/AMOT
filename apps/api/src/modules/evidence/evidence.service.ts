import { db } from '../../db';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { env } from '../../config';

const s3Client = new S3Client({
  region: env.S3_REGION || 'us-east-1',
  endpoint: env.S3_ENDPOINT,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY || '',
    secretAccessKey: env.S3_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

export class EvidenceService {
  static async generateUploadUrl(data: { fileName: string; mimeType: string }) {
    const ext = data.fileName.split('.').pop() || 'tmp';
    const date = new Date();
    const key = `evidence/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      ContentType: data.mimeType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { url, key };
  }

  static async commitEvidence(data: any) {
    const [evidence] = await db.insert(schema.evidenceFiles).values({
      observationId: data.observationId,
      storageKey: data.storageKey,
      originalFilename: data.originalFilename,
      mimeType: data.mimeType,
      fileSizeBytes: data.fileSizeBytes,
      sha256Hash: data.sha256Hash,
      isOriginal: true,
      metadata: data.metadata || {},
    }).returning();
    
    return evidence;
  }

  static async listByObservation(observationId: number) {
    return await db.select().from(schema.evidenceFiles).where(eq(schema.evidenceFiles.observationId, observationId));
  }

  static async getById(id: number) {
    const [evidence] = await db.select().from(schema.evidenceFiles).where(eq(schema.evidenceFiles.id, id)).limit(1);
    if (!evidence) throw new Error('Evidence not found');

    const command = new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: evidence.storageKey,
    });
    
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { ...evidence, downloadUrl };
  }
}
