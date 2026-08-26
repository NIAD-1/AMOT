import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { EvidenceService } from './evidence.service';
import { authenticate } from '../../middleware/auth';

const uploadSchema = z.object({
  fileName: z.string(),
  mimeType: z.string(),
});

const commitSchema = z.object({
  observationId: z.number(),
  storageKey: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  fileSizeBytes: z.number(),
  sha256Hash: z.string().optional(),
  metadata: z.any().optional(),
});

export default async function evidenceRoutes(fastify: FastifyInstance) {
  fastify.post('/upload-url', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const data = uploadSchema.parse(request.body);
      const result = await EvidenceService.generateUploadUrl(data);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/commit', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const data = commitSchema.parse(request.body);
      const evidence = await EvidenceService.commitEvidence(data);
      return reply.status(201).send(evidence);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/observation/:observationId', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const observationId = parseInt((request.params as any).observationId);
      const evidence = await EvidenceService.listByObservation(observationId);
      return reply.send(evidence);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const evidence = await EvidenceService.getById(id);
      return reply.send(evidence);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
