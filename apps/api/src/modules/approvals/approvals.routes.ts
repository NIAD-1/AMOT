import { FastifyInstance } from 'fastify';
import { ApprovalsService } from './approvals.service';
import { authenticate } from '../../middleware/auth';

export default async function approvalsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await ApprovalsService.list(page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/search', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const q = query.q || '';
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await ApprovalsService.search(q, page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const approval = await ApprovalsService.getById(id);
      return reply.send(approval);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  fastify.get('/:id/artworks', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const artworks = await ApprovalsService.getArtworks(id);
      return reply.send(artworks);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
