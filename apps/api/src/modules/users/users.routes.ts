import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UsersService } from './users.service';
import { authenticate, requireRole } from '../../middleware/auth';

const listSchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
  search: z.string().optional(),
});

const updateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['admin', 'supervisor', 'advert_team', 'field_officer']).optional(),
  isActive: z.boolean().optional(),
});

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get('/', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const { page, limit, search } = listSchema.parse(request.query);
      const result = await UsersService.list(page, limit, search);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const user = await UsersService.getById(id);
      return reply.send(user);
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });

  fastify.patch('/:id', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const data = updateSchema.parse(request.body);
      const user = await UsersService.update(id, data, request.user!.id);
      return reply.send(user);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.delete('/:id', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      await UsersService.delete(id, request.user!.id);
      return reply.send({ success: true });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
