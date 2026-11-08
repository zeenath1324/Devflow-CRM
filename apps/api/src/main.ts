import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { authRouter } from './modules/auth/auth.router';
import { dashboardRouter } from './modules/dashboard/dashboard.router';
import { clientsRouter } from './modules/clients/clients.router';
import { leadsRouter } from './modules/leads/leads.router';
import { dealsRouter } from './modules/deals/deals.router';
import { projectsRouter } from './modules/projects/projects.router';
import { tasksRouter } from './modules/tasks/tasks.router';
import { teamsRouter } from './modules/teams/teams.router';
import { timeRouter } from './modules/time/time.router';
import { portalRouter } from './modules/portal/portal.router';
import { financeRouter } from './modules/finance/finance.router';
import { supportRouter } from './modules/support/support.router';
import { communicationRouter } from './modules/communication/communication.router';
import { aiRouter } from './modules/ai/ai.router';
import { automationRouter } from './modules/automation/automation.router';
import { analyticsRouter } from './modules/analytics/analytics.router';
import { adminRouter } from './modules/admin/admin.router';

dotenv.config();

const app = express();
const server = http.createServer(app);

// WebSockets for real-time CRM & Task events
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log(`[WebSocket] Client connected: ${socket.id}`);

  socket.on('join_tenant', (tenantId: string) => {
    socket.join(`tenant_${tenantId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Client disconnected: ${socket.id}`);
  });
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    product: 'DEVFLOW CRM',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// Mount All 16 Business Modules
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/time', timeRouter);
app.use('/api/portal', portalRouter);
app.use('/api/finance', financeRouter);
app.use('/api/support', supportRouter);
app.use('/api/communication', communicationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/automation', automationRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Application Exception:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` DEVFLOW CRM API Server`);
  console.log(` The Intelligent Operating System for Software Companies`);
  console.log(` Listening on port: ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});

export { app, server, io };
