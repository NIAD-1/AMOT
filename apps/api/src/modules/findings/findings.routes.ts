import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { FindingsService } from './findings.service';
import { authenticate, requireRole } from '../../middleware/auth';

const createUpdateSchema = z.object({
  matchedNapamsId: z.number().optional(),
  systemMatchStatus: z.enum(['EXACT_MATCH', 'PARTIAL_MATCH', 'NO_MATCH', 'PENDING_VERIFICATION']).optional(),
  systemConfidence: z.number().optional(),
  detectedDiscrepancies: z.any().optional(),
  regulatoryDecision: z.enum(['COMPLIANT', 'MINOR_VIOLATION', 'MAJOR_VIOLATION', 'CRITICAL_VIOLATION', 'PENDING_REVIEW']).optional(),
  escalationStatus: z.enum(['NONE', 'PENDING_REVIEW', 'ESCALATED', 'RESOLVED']).optional(),
});

const escalateSchema = z.object({
  notes: z.string(),
});

export default async function findingsRoutes(fastify: FastifyInstance) {
  fastify.get('/observation/:observationId', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const observationId = parseInt((request.params as any).observationId);
      const finding = await FindingsService.getByObservation(observationId);
      return reply.send(finding);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  fastify.post('/observation/:observationId', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const observationId = parseInt((request.params as any).observationId);
      const data = createUpdateSchema.parse(request.body);
      const finding = await FindingsService.createOrUpdate(observationId, data, request.user!.id, request.user!.role);
      return reply.send(finding);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/:id/escalate', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const data = escalateSchema.parse(request.body);
      const finding = await FindingsService.escalate(id, request.user!.id, request.user!.role, data.notes);
      return reply.send(finding);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/pending', { preHandler: [authenticate, requireRole('supervisor', 'admin')] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await FindingsService.listPendingReview(page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/escalated', { preHandler: [authenticate, requireRole('supervisor', 'admin')] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await FindingsService.listEscalated(page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
