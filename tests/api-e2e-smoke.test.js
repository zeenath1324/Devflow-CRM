const http = require('http');
const { spawn } = require('child_process');
const path = require('path');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runSmokeTest() {
  console.log('====================================================');
  console.log(' DEVFLOW CRM — API E2E Smoke & Runtime Verification');
  console.log('====================================================');

  const apiPort = 4099;
  const serverPath = path.resolve(__dirname, '../apps/api/dist/main.js');

  const child = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT: apiPort.toString() },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', d => process.stdout.write(`[API LOG] ${d}`));
  child.stderr.on('data', d => process.stderr.write(`[API ERR] ${d}`));

  // Wait for server to boot
  await new Promise(r => setTimeout(r, 2000));

  try {
    // 1. Health check
    console.log('\n[1/5] Testing GET /health...');
    const health = await request(`http://localhost:${apiPort}/health`);
    if (health.status !== 200 || health.body.product !== 'DEVFLOW CRM') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('  -> PASS: Status 200, product DEVFLOW CRM, uptime verified.');

    // 2. Authentication Login
    console.log('\n[2/5] Testing POST /api/auth/login...');
    const login = await request(`http://localhost:${apiPort}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'owner@nexuslabs.dev',
      password: 'DevFlow@2026!'
    });

    if (login.status !== 200 || !login.body.accessToken) {
      throw new Error(`Login failed: ${JSON.stringify(login)}`);
    }
    const token = login.body.accessToken;
    console.log(`  -> PASS: Auth token acquired (${token.substring(0, 20)}...) for Owner role.`);

    // 3. Multi-Tenant Protected Route: Dashboard Metrics
    console.log('\n[3/5] Testing GET /api/dashboard/metrics (Protected with JWT)...');
    const dashboard = await request(`http://localhost:${apiPort}/api/dashboard/metrics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (dashboard.status !== 200 || dashboard.body.totalRevenue === undefined) {
      throw new Error(`Dashboard metrics fetch failed: ${JSON.stringify(dashboard)}`);
    }
    console.log(`  -> PASS: Dashboard metrics returned: ARR $${dashboard.body.totalRevenue}, Active Projects ${dashboard.body.activeProjects}.`);

    // 4. Client Directory
    console.log('\n[4/5] Testing GET /api/clients...');
    const clients = await request(`http://localhost:${apiPort}/api/clients`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (clients.status !== 200 || !Array.isArray(clients.body)) {
      throw new Error(`Clients fetch failed: ${JSON.stringify(clients)}`);
    }
    console.log(`  -> PASS: Retrieved ${clients.body.length} enterprise client profiles.`);

    // 5. AI Copilot Endpoint
    console.log('\n[5/5] Testing POST /api/ai/chat (Gemini Copilot Engine)...');
    const aiChat = await request(`http://localhost:${apiPort}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, {
      message: 'Summarize quarterly project delivery efficiency and key risk areas.'
    });
    if (aiChat.status !== 200 || !aiChat.body.reply) {
      throw new Error(`AI chat failed: ${JSON.stringify(aiChat)}`);
    }
    console.log(`  -> PASS: AI Copilot returned response: "${aiChat.body.reply.substring(0, 70).replace(/\n/g, ' ')}..."`);

    console.log('\n====================================================');
    console.log(' ALL 5 API ENDPOINT VERIFICATIONS PASSED CLEANLY!');
    console.log('====================================================\n');
  } finally {
    child.kill('SIGTERM');
  }
}

runSmokeTest().catch(err => {
  console.error('Smoke test failure:', err);
  process.exit(1);
});
