/**
 * ============================================================================
 * TATWA ELECTRONICS - STANDALONE ORATION AI WEBHOOK TOOL API SERVER
 * ============================================================================
 *
 * Microservice providing:
 * 1. Webhook Tool Endpoints (`/api/tool` & `/api/oration/product-tool`):
 *    - Receives tool calls triggered by Oration AI voice/chat agent.
 *    - Resolves and normalizes input to the 20 Tatwa Electronics appliances.
 *    - Pushes payloads immediately to connected browser sessions via SSE and WebSocket.
 * 2. Real-Time Streaming Channels:
 *    - SSE (`/api/stream/:sessionId`)
 *    - WebSocket (`/api/ws?sessionId=...`)
 * 3. Catalog & Health Endpoints:
 *    - Catalog list (`/api/products`)
 *    - Configuration (`/api/config`)
 *    - Health check (`/api/health`)
 */

import express from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { getAllProducts, resolveToolRequest } from './src/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .dev.vars if present
function loadEnv() {
  const envFiles = [
    path.join(__dirname, '.dev.vars'),
    path.join(__dirname, '..', '.dev.vars')
  ];

  for (const filePath of envFiles) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key, ...rest] = trimmed.split('=');
            let val = rest.join('=').trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (val && !val.startsWith('pk_your_') && !val.startsWith('ag_your_')) {
              process.env[key] = val;
            } else if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch (e) {
        console.warn(`[Config] Could not read ${filePath}:`, e);
      }
    }
  }
}
loadEnv();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------------------
// 2. IN-MEMORY SESSION ROOM STATE
// ----------------------------------------------------------------------------
const sessions = new Map();

function getSessionRoom(sessionId = 'default') {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sseClients: new Set(),
      wsClients: new Set(),
      lastPayload: null
    });
  }
  return sessions.get(sessionId);
}

function broadcastToSession(sessionId, payload) {
  const room = getSessionRoom(sessionId);
  if (!payload.timestamp) {
    payload.timestamp = new Date().toISOString();
  }
  room.lastPayload = payload;

  const dataStr = JSON.stringify(payload);
  const sseMessage = `data: ${dataStr}\n\n`;

  // Deliver to SSE
  for (const res of room.sseClients) {
    try {
      res.write(sseMessage);
    } catch (_) {
      room.sseClients.delete(res);
    }
  }

  // Deliver to WebSockets
  const wsMessage = JSON.stringify({
    type: 'PRODUCT_UPDATE',
    ...payload,
    timestamp: new Date().toISOString()
  });

  for (const ws of room.wsClients) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(wsMessage);
      }
    } catch (_) {
      room.wsClients.delete(ws);
    }
  }
}

// ----------------------------------------------------------------------------
// 3. API ROUTES
// ----------------------------------------------------------------------------

// 3a. Root API Index & Info
app.get('/', (req, res) => {
  res.json({
    name: 'Tatwa Electronics Oration AI Webhook Tool API',
    status: 'online',
    brand: 'Tatwa Electronics',
    webhookToolEndpoint: '/api/tool',
    toolName: 'display_tatwa_products',
    catalogSize: 20,
    categories: ['chimney', 'dishwasher', 'washing_machine', 'tv'],
    endpoints: {
      toolWebhook: '/api/tool',
      productCatalog: '/api/products',
      streamSSE: '/api/stream/:sessionId',
      websocket: '/api/ws?sessionId=:sessionId',
      health: '/api/health',
      config: '/api/config'
    },
    documentation: 'Refer to ORATION_TOOL_SETUP.md for voice connection instructions'
  });
});

// 3b. Client Configuration
app.get(['/api/config', '/config'], (req, res) => {
  const rawPk = process.env.ORATION_PUBLIC_KEY || '';
  const rawAg = process.env.ORATION_AGENT_ID || '';
  const pk = (!rawPk || rawPk.startsWith('pk_your_')) ? '70588826-0a19-4c4f-abdf-6de6c720d793' : rawPk;
  const ag = (!rawAg || rawAg.startsWith('ag_your_')) ? '128f59b2-7f37-4e1f-badd-f18c7a2a2287' : rawAg;

  res.json({
    publicKey: pk,
    agentId: ag,
    brand: 'Tatwa Electronics',
    webhookSecretConfigured: Boolean(process.env.TOOL_WEBHOOK_SECRET),
    defaultSessionId: 'default'
  });
});

// 3c. Product Catalog
app.get(['/api/products', '/api/catalog', '/products', '/catalog'], (req, res) => {
  res.json({
    status: 'success',
    brand: 'Tatwa Electronics',
    totalCount: 20,
    categories: ['chimney', 'dishwasher', 'washing_machine', 'tv'],
    products: getAllProducts()
  });
});

// 3d. Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'tatwa-oration-tool-backend',
    brand: 'Tatwa Electronics',
    message: 'Tatwa Electronics Oration AI Voice Webhook Tool API is online',
    productCount: 20,
    categories: ['chimney', 'dishwasher', 'washing_machine', 'tv'],
    endpoints: {
      tool: '/api/tool',
      stream: '/api/stream/default',
      config: '/api/config',
      products: '/api/products',
      health: '/api/health'
    },
    timestamp: new Date().toISOString()
  });
});

// 3e. SSE Stream Channel
app.get(['/api/stream/:sessionId', '/api/stream'], (req, res) => {
  const sessionId = req.params.sessionId || req.query.sessionId || req.query.session_id || 'default';
  const room = getSessionRoom(sessionId);

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  res.write(': keepalive\n\n');
  room.sseClients.add(res);

  // Replay last cached payload
  if (room.lastPayload) {
    try {
      res.write(`data: ${JSON.stringify(room.lastPayload)}\n\n`);
    } catch (_) {}
  }

  // Keep-alive heartbeat every 15s
  const heartbeat = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (_) {
      clearInterval(heartbeat);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    room.sseClients.delete(res);
  });
});

// 3f. Polling Fallback (Last State)
app.get('/api/last-state', (req, res) => {
  const sessionId = req.query.sessionId || req.query.session_id || 'default';
  const room = getSessionRoom(sessionId);
  res.json({
    status: 'success',
    payload: room.lastPayload || null
  });
});

// 3g. Tool Webhook Endpoint (For Oration AI Voice Agent Connection)
app.all(['/api/tool', '/tool', '/api/oration/product-tool', '/api/product-tool'], (req, res) => {
  try {
    const merged = { ...req.query, ...req.body };
    const sessionId = merged.sessionId || merged.session_id || 'default';

    const resolved = resolveToolRequest(merged);

    // Broadcast update across active SSE and WS connections
    broadcastToSession(sessionId, resolved);

    res.json({
      status: 'success',
      componentType: resolved.componentType,
      title: resolved.title,
      displayedImages: resolved.images || [],
      productsCount: (resolved.products || []).length,
      displayedProducts: resolved.products || [],
      brand: 'Tatwa Electronics',
      sessionId: sessionId,
      broadcastDelivered: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[ToolWebhook] Error handling tool request:', err);
    res.status(400).json({
      error: 'Failed to process product tool payload',
      message: err.message
    });
  }
});

// ----------------------------------------------------------------------------
// 4. WEBSOCKET UPGRADE HANDLER
// ----------------------------------------------------------------------------
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname === '/api/ws' || url.pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id') || 'default';
  const room = getSessionRoom(sessionId);

  room.wsClients.add(ws);

  ws.send(JSON.stringify({
    type: 'CONNECTED',
    message: 'Connected to Tatwa Electronics Real-Time Session Room',
    sessionId: sessionId,
    timestamp: new Date().toISOString()
  }));

  // Replay last cached product display
  if (room.lastPayload) {
    try {
      ws.send(JSON.stringify({
        type: 'PRODUCT_UPDATE',
        ...room.lastPayload,
        isReplay: true
      }));
    } catch (_) {}
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (_) {}
  });

  ws.on('close', () => {
    room.wsClients.delete(ws);
  });
});

// Start listening if run directly
server.listen(PORT, () => {
  console.log(`\n==========================================================`);
  console.log(`⚡ TATWA ELECTRONICS ORATION AI TOOL BACKEND`);
  console.log(`==========================================================`);
  console.log(`🌐 API Server running at:      http://localhost:${PORT}`);
  console.log(`🛠️ Webhook Tool Endpoint:      http://localhost:${PORT}/api/tool`);
  console.log(`📡 SSE Stream:                http://localhost:${PORT}/api/stream/:sessionId`);
  console.log(`⚡ WebSocket Stream:          ws://localhost:${PORT}/api/ws?sessionId=default`);
  console.log(`🏷️ Catalog (20 Appliances):    http://localhost:${PORT}/api/products`);
  console.log(`==========================================================\n`);
});

export default server;
