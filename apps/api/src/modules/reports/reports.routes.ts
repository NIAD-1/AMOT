import { FastifyInstance } from 'fastify';
import { ReportsService } from './reports.service';
import { authenticate, requireRole } from '../../middleware/auth';

export default async function reportsRoutes(fastify: FastifyInstance) {
  fastify.get('/dashboard', { preHandler: [authenticate, requireRole('supervisor', 'admin')] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const filters = {
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      };
      const metrics = await ReportsService.getDashboardMetrics(filters);
      return reply.send(metrics);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  });

  fastify.get('/export/observations', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const query = request.query as any;
      const filters = {
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      };
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="observations_${new Date().toISOString().split('T')[0]}.csv"`);
      await ReportsService.streamObservationsCsv(filters, reply.raw);
    } catch (err: any) {
      // Stream error handling
    }
  });

  fastify.get('/export/findings', { preHandler: [authenticate, requireRole('supervisor', 'admin')] }, async (request, reply) => {
    try {
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="findings_${new Date().toISOString().split('T')[0]}.csv"`);
      await ReportsService.streamFindingsCsv(request.query, reply.raw);
    } catch (err: any) {}
  });

  fastify.get('/export/schedules', { preHandler: [authenticate, requireRole('advert_team', 'supervisor', 'admin')] }, async (request, reply) => {
    try {
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="schedules_${new Date().toISOString().split('T')[0]}.csv"`);
      await ReportsService.streamSchedulesCsv(request.query, reply.raw);
    } catch (err: any) {}
  });

  fastify.get('/export/audit-logs', { preHandler: [authenticate, requireRole('admin')] }, async (request, reply) => {
    try {
      reply.header('Content-Type', 'text/csv');
      reply.header('Content-Disposition', `attachment; filename="audit-logs_${new Date().toISOString().split('T')[0]}.csv"`);
      await ReportsService.streamAuditLogsCsv(request.query, reply.raw);
    } catch (err: any) {}
  });
}
