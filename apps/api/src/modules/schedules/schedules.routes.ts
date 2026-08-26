import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { SchedulesService } from './schedules.service';
import { authenticate } from '../../middleware/auth';

const updateStatusSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
});

export default async function schedulesRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const filters = {
        assignedOfficerId: query.assignedOfficerId ? parseInt(query.assignedOfficerId) : undefined,
        status: query.status,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      };
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await SchedulesService.list(page, limit, filters);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/my-assignments', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const result = await SchedulesService.getMyAssignments(request.user!.id, query.dateFrom, query.dateTo);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const schedule = await SchedulesService.getById(id);
      if (!schedule) return reply.status(404).send({ error: 'Not found' });
      return reply.send(schedule);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.patch('/:id/status', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const data = updateStatusSchema.parse(request.body);
      const schedule = await SchedulesService.updateStatus(id, data.status, request.user!.id, request.user!.role);
      return reply.send(schedule);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
