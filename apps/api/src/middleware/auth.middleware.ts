import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@devflow/shared-types';
import { dataStore } from '../store/data-service';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizationId: string;
  };
  organizationId?: string;
}

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'devflow_jwt_access_super_secret_key_32chars_min_2026';

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: payload.sub || payload.id,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role as UserRole,
      organizationId: payload.organizationId,
    };

    // Tenant context from verified session
    const customTenantHeader = req.headers['x-tenant-id'] as string;
    req.organizationId = customTenantHeader || req.user.organizationId;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Expired or invalid token' });
  }
}
