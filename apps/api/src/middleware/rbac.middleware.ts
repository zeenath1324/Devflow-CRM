import { Response, NextFunction } from 'express';
import { UserRole } from '@devflow/shared-types';
import { AuthenticatedRequest } from './auth.middleware';

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required' });
    }

    if (req.user.role === UserRole.SAAS_SUPER_ADMIN || req.user.role === UserRole.COMPANY_OWNER) {
      return next();
    }

    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      error: `Forbidden: Role '${req.user.role}' lacks permission for this resource. Required: ${allowedRoles.join(', ')}`,
    });
  };
}
