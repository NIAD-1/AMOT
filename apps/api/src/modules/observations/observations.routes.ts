import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ObservationsService } from './observations.service';
import { authenticate } from '../../middleware/auth';

const createSchema = z.object({
  source: z.enum(['ROUTINE_MONITORING', 'ALERT_RESPONSE', 'PUBLIC_COMPLAINT', 'AD_HOC']),
  scheduleId: z.number().optional(),
  alertId: z.number().optional(),
  capturedAt: z.string().datetime(),
  medium: z.string(),
  gpsCoordinates: z.any().optional(),
  digitalUrl: z.string().optional(),
  observedProductName: z.string(),
  observedManufacturer: z.string().optional(),
  officerNotes: z.string().optional(),
  clientIdempotencyKey: z.string(),
});

const updateSchema = z.object({
  observedProductName: z.string().optional(),
  observedManufacturer: z.string().optional(),
  officerNotes: z.string().optional(),
});

export default async function observationsRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const data = createSchema.parse(request.body);
      const observation = await ObservationsService.create(data, request.user!.id, request.user!.role);
      return reply.status(201).send(observation);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const filters = {
        source: query.source,
        medium: query.medium,
        capturedBy: query.capturedBy ? parseInt(query.capturedBy) : undefined,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      };
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      
      const result = await ObservationsService.list(filters, page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const observation = await ObservationsService.getById(id);
      return reply.send(observation);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  fastify.patch('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const data = updateSchema.parse(request.body);
      const observation = await ObservationsService.update(id, data, request.user!.id, request.user!.role);
      return reply.send(observation);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
