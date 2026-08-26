import { FastifyInstance } from 'fastify';
import { NotificationsService } from './notifications.service';
import { authenticate } from '../../middleware/auth';

export default async function notificationsRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await NotificationsService.listForUser(request.user!.id, page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/unread-count', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const count = await NotificationsService.getUnreadCount(request.user!.id);
      return reply.send({ count });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.patch('/:id/read', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const notification = await NotificationsService.markRead(id, request.user!.id);
      return reply.send(notification);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/read-all', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      await NotificationsService.markAllRead(request.user!.id);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
