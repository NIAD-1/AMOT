import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AlertsService } from './alerts.service';
import { authenticate, requireRole } from '../../middleware/auth';

const createSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  targetChannels: z.any().optional(),
  targetLocations: z.any().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

export default async function alertsRoutes(fastify: FastifyInstance) {
  fastify.post('/', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const data = createSchema.parse(request.body);
      const alert = await AlertsService.create(data, request.user!.id, request.user!.role);
      return reply.status(201).send(alert);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const activeOnly = query.activeOnly === 'true';
      const result = await AlertsService.list(page, limit, activeOnly);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const alert = await AlertsService.getById(id);
      return reply.send(alert);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  fastify.post('/:id/acknowledge', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const ack = await AlertsService.acknowledge(id, request.user!.id);
      return reply.send(ack);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
