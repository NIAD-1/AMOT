import { FastifyInstance } from 'fastify';
import { ExcelImportService } from './excel-import.service';
import { authenticate, requireRole } from '../../middleware/auth';
import multipart from '@fastify/multipart';

export default async function excelImportRoutes(fastify: FastifyInstance) {
  fastify.register(multipart, { attachFieldsToBody: true });

  fastify.post('/upload', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const data = await request.file();
      if (!data) return reply.status(400).send({ error: 'File is required' });
      
      const buffer = await data.toBuffer();
      const result = await ExcelImportService.upload(buffer, data.filename, request.user!.id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id/preview', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const result = await ExcelImportService.getPreview(id);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.post('/:id/confirm', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const validData = (request.body as any).validData;
      const result = await ExcelImportService.confirm(id, request.user!.id, validData);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;
      const result = await ExcelImportService.getHistory(page, limit);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/:id/errors', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      const id = parseInt((request.params as any).id);
      const errors = await ExcelImportService.getErrors(id);
      return reply.send(errors);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });
}
