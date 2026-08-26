import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { env } from '../config';

export interface JwtPayload {
  id: number;
  role: string;
  email: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    let token = request.headers.authorization?.replace('Bearer ', '');
    if (!token && request.cookies && request.cookies.token) {
      token = request.cookies.token;
    }

    if (!token) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
};

export const requireRole = (...roles: string[]) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
    if (!roles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Forbidden' });
    }
  };
};
