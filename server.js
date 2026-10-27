/**
 * ============================================================================
 * TATWA ELECTRONICS PRODUCT VISUALIZER - NODE.JS EXPRESS & WEBSOCKET SERVER
 * ============================================================================
 *
 * Local development and testing server replicating Cloudflare Worker behavior:
 * 1. Webhook Tool Handler (`/api/tool` & `/api/oration/product-tool`):
 *    - Receives tool calls triggered by Oration AI voice/chat agent.
 *    - Resolves and normalizes input to the 20 Tatwa Electronics appliances.
 *    - Pushes payloads immediately to connected browser clients via SSE and WebSocket.
 *
 * 2. Real-Time Streaming Channel (`/api/stream/:sessionId`):
 *    - SSE channel for lightweight HTTP push updates with keepalive.
 *
 * 3. WebSocket Channel (`/api/ws`):
 *    - Full bi-directional WebSocket syncing per session.
 *
 * 4. Environment & Key Management (`/api/config`):
 *    - Reads `ORATION_PUBLIC_KEY` and `ORATION_AGENT_ID` from environment or .dev.vars.
 *
 * 5. Catalog Endpoint (`/api/products`):
 *    - Serves all 20 Tatwa appliances across 4 categories (Chimneys, Dishwashers, Washing Machines, Smart TVs).
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { resolveToolRequest, getAllProducts } from './src/catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------------------------------------------
// 1. ENVIRONMENT LOADER
// ----------------------------------------------------------------------------
function loadEnv() {
  const possiblePaths = [
    path.join(__dirname, '.dev.vars'),
    path.join(__dirname, '.env')
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const lines = fs.readFileSync(filePath, 'utf8').split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;

          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.substring(0, eqIdx).trim();
            let val = trimmed.substring(eqIdx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.substring(1, val.length - 1);
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

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root redirects directly to Visualizer Screen
app.get('/', (req, res) => {
  res.redirect('/visualizer/');
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/visualizer', express.static(path.join(__dirname, 'public', 'visualizer')));

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

// 3a. Client Configuration
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

// 3b. Product Catalog
app.get(['/api/products', '/api/catalog', '/products', '/catalog'], (req, res) => {
  res.json({
    status: 'success',
    brand: 'Tatwa Electronics',
    totalCount: 20,
    categories: ['chimney', 'dishwasher', 'washing_machine', 'tv'],
    products: getAllProducts()
  });
});

// 3c. Health Check
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'ok',
    service: 'tatwa-electronics-visualizer',
    brand: 'Tatwa Electronics',
    message: 'Tatwa Electronics Smart Appliance Visualizer Backend is online',
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

// 3d. SSE Stream Channel
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

// 3e. Polling Fallback (Last State)
app.get('/api/last-state', (req, res) => {
  const sessionId = req.query.sessionId || req.query.session_id || 'default';
  const room = getSessionRoom(sessionId);
  res.json({
    status: 'success',
    payload: room.lastPayload || null
  });
});

// 3f. Tool Webhook Endpoint
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

// Root route serves Tatwa Electronics Home Screen / Home Window
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start listening
server.listen(PORT, () => {
  console.log(`\n==========================================================`);
  console.log(`⚡ TATWA ELECTRONICS APPLIANCE VISUALIZER & WEBHOOK HUB`);
  console.log(`==========================================================`);
  console.log(`🏠 Home Window Portal:        http://localhost:${PORT}/`);
  console.log(`✨ AI Visualizer Studio:       http://localhost:${PORT}/visualizer/`);
  console.log(`🛠️ Oration AI Tool Webhook:   http://localhost:${PORT}/api/tool`);
  console.log(`📡 SSE Stream:                http://localhost:${PORT}/api/stream/:sessionId`);
  console.log(`⚡ WebSocket Stream:          ws://localhost:${PORT}/api/ws?sessionId=default`);
  console.log(`🏷️ Catalog (20 Appliances):    http://localhost:${PORT}/api/products`);
  console.log(`==========================================================\n`);
});
