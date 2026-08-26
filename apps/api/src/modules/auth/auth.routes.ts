import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { authenticate, requireRole } from '../../middleware/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['admin', 'supervisor', 'advert_team', 'field_officer']),
});

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    try {
      const data = loginSchema.parse(request.body);
      const { user, token } = await AuthService.login(data.email, data.password);
      
      reply.setCookie('token', token, {
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      
      return reply.send({ user, token });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/register', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      const data = registerSchema.parse(request.body);
      const user = await AuthService.register(data);
      return reply.status(201).send({ user });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return reply.send({ success: true });
  });

  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const userId = request.user!.id;
      const user = await AuthService.getMe(userId);
      return reply.send({ user });
    } catch (err: any) {
      return reply.status(404).send({ error: err.message });
    }
  });
}
