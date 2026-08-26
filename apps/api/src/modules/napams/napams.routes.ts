import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { NapamsService } from './napams.service';
import { authenticate, requireRole } from '../../middleware/auth';

const syncSchema = z.object({
  type: z.string(),
});

export default async function napamsRoutes(fastify: FastifyInstance) {
  fastify.get('/status', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const status = await NapamsService.getStatus();
      return reply.send(status);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/sync-history', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await NapamsService.getSyncHistory(page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/sync', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const data = syncSchema.parse(request.body);
      const job = await NapamsService.triggerSync(data.type, request.user!.id, request.user!.role);
      return reply.status(202).send(job);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/verify/:approvalNumber', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const approvalNumber = (request.params as any).approvalNumber;
      const result = await NapamsService.verifySingleRecord(approvalNumber, request.user!.id, request.user!.role);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
