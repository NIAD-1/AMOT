import fastify from 'fastify';
import cors from '@fastify/cors';
import cookie from '@fastify/cookie';
import { env } from './config';

import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import observationsRoutes from './modules/observations/observations.routes';
import findingsRoutes from './modules/findings/findings.routes';
import evidenceRoutes from './modules/evidence/evidence.routes';
import alertsRoutes from './modules/alerts/alerts.routes';
import schedulesRoutes from './modules/schedules/schedules.routes';
import excelImportRoutes from './modules/excel-import/excel-import.routes';
import approvalsRoutes from './modules/approvals/approvals.routes';
import napamsRoutes from './modules/napams/napams.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import reportsRoutes from './modules/reports/reports.routes';

const app = fastify({ logger: true });

app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

app.register(cookie);

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });
app.register(usersRoutes, { prefix: '/api/users' });
app.register(observationsRoutes, { prefix: '/api/observations' });
app.register(findingsRoutes, { prefix: '/api/findings' });
app.register(evidenceRoutes, { prefix: '/api/evidence' });
app.register(alertsRoutes, { prefix: '/api/alerts' });
app.register(schedulesRoutes, { prefix: '/api/schedules' });
app.register(excelImportRoutes, { prefix: '/api/excel-imports' });
app.register(approvalsRoutes, { prefix: '/api/approvals' });
app.register(napamsRoutes, { prefix: '/api/napams' });
app.register(notificationsRoutes, { prefix: '/api/notifications' });
app.register(reportsRoutes, { prefix: '/api/reports' });

app.get('/health', async () => {
  return { status: 'ok' };
});

export default app;
