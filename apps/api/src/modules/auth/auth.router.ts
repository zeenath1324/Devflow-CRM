import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, SubscriptionTier } from '@devflow/shared-types';
import { registerSchema, loginSchema } from '@devflow/validation';
import { dataStore } from '../../store/data-service';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth.middleware';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'devflow_jwt_access_super_secret_key_32chars_min_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'devflow_jwt_refresh_super_secret_key_32chars_min_2026';

// Register a new organization and owner
authRouter.post('/register', (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const { email, password, firstName, lastName, companyName } = parseResult.data;

  const existingUser = dataStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'A user with this email address already exists' });
  }

  const orgId = `org-${Date.now()}`;
  const orgSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  
  const newOrg = {
    id: orgId,
    name: companyName,
    slug: orgSlug,
    plan: SubscriptionTier.PROFESSIONAL,
    currency: 'USD',
  };
  dataStore.orgs.push(newOrg);

  const userId = `usr-${Date.now()}`;
  const newUser = {
    id: userId,
    organizationId: orgId,
    email: email.toLowerCase(),
    passwordHash: 'dummy_hash',
    firstName,
    lastName,
    role: UserRole.COMPANY_OWNER,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  dataStore.users.push(newUser);

  const tokenPayload = {
    sub: newUser.id,
    id: newUser.id,
    email: newUser.email,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    role: newUser.role,
    organizationId: orgId,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sub: newUser.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return res.status(201).json({
    accessToken,
    refreshToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      organization: {
        id: newOrg.id,
        name: newOrg.name,
        slug: newOrg.slug,
        plan: newOrg.plan,
      },
    },
  });
});

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid login payload', details: parseResult.error.format() });
  }

  const { email, password } = parseResult.data;
  const user = dataStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const org = dataStore.orgs.find((o) => o.id === user.organizationId) || {
    id: user.organizationId,
    name: 'DevFlow Workspace',
    slug: 'devflow-workspace',
    plan: SubscriptionTier.ENTERPRISE,
  };

  const tokenPayload = {
    sub: user.id,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    organizationId: user.organizationId,
  };

  const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        plan: org.plan,
      },
    },
  });
});

// Get current profile
authRouter.get('/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const user = dataStore.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const org = dataStore.orgs.find((o) => o.id === (req.organizationId || user.organizationId));

  return res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    organization: org,
  });
});
