/**
 * Tatwa Electronics Real-Time Session Room - Durable Object (Pure JavaScript)
 *
 * WHAT THIS FILE DOES:
 * 1. Manages real-time state synchronization per user session (`sessionId`).
 * 2. Supports dual streaming protocols:
 *    - Server-Sent Events (SSE) via `/stream`: Subscribed by web clients to receive image & component updates.
 *    - WebSockets via `/ws`: Subscribed by interactive widgets using Cloudflare's WebSocket Hibernation API.
 * 3. Handles `/broadcast` (POST): Called when an Oration AI tool triggers an update.
 *    It caches the last product state in Durable Object storage and delivers the payload
 *    instantly to all active SSE writers and WebSocket connections.
 * 4. Automatic Replay: When a user connects or refreshes their browser, the most recent product
 *    payload is immediately replayed so their screen doesn't show a blank state.
 */

import { DurableObject } from 'cloudflare:workers';

export class SessionRoom extends DurableObject {
  /**
   * Initializes the SessionRoom Durable Object instance.
   * @param {Object} ctx - Cloudflare DurableObjectState (provides storage and WebSocket hibernation)
   * @param {Object} env - Environment bindings
   */
  constructor(ctx, env) {
    super(ctx, env);
    this.sseWriters = new Set();
  }

  /**
   * Main HTTP / WebSocket request router for this session.
   * @param {Request} request - Incoming fetch or WebSocket upgrade request
   * @returns {Promise<Response>} HTTP or WebSocket response
   */
  async fetch(request) {
    const url = new URL(request.url);

    // =========================================================================
    // 1. SSE Stream Endpoint (/stream)
    // Used by frontend visualizer via new EventSource('/api/stream/:sessionId')
    // =========================================================================
    if (url.pathname === '/stream' || url.pathname.startsWith('/stream')) {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      this.sseWriters.add(writer);

      const encoder = new TextEncoder();
      writer.write(encoder.encode(': keepalive\n\n'));

      // If a product payload was previously displayed, replay it marked as isReplay so reloads ignore it
      this.ctx.storage.get('lastPayload').then((lastPayload) => {
        if (lastPayload) {
          try {
            writer.write(encoder.encode(`data: ${JSON.stringify({ ...lastPayload, isReplay: true })}\n\n`));
          } catch (e) {
            console.warn('[SessionRoom] Failed to send cached payload to SSE client', e);
          }
        }
      });

      return new Response(readable, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // =========================================================================
    // 2. WebSocket Upgrade Endpoint (/ws)
    // Uses Cloudflare's zero-cost WebSocket Hibernation API
    // =========================================================================
    if (url.pathname === '/ws') {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
        return new Response('Expected WebSocket upgrade request', { status: 426 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      // Register server socket with hibernation API
      this.ctx.acceptWebSocket(server);

      server.send(
        JSON.stringify({
          type: 'CONNECTED',
          message: 'Connected to Tatwa Electronics Real-Time Session Room',
          timestamp: new Date().toISOString()
        })
      );

      // Replay last cached product display to the newly connected socket
      const lastPayload = await this.ctx.storage.get('lastPayload');
      if (lastPayload) {
        try {
          server.send(
            JSON.stringify({
              type: 'PRODUCT_UPDATE',
              ...lastPayload,
              isReplay: true
            })
          );
        } catch (_) {}
      }

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    // =========================================================================
    // 3. Broadcast Endpoint (/broadcast - POST)
    // Invoked by Worker fetch router when /api/tool receives product tool calls
    // =========================================================================
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      let payload;
      try {
        payload = await request.json();
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Persist latest state in Durable Object storage
      await this.ctx.storage.put('lastPayload', payload);

      // 3a. Deliver to active WebSockets
      const sockets = this.ctx.getWebSockets();
      let sentWs = 0;
      const wsMessage = JSON.stringify({
        type: 'PRODUCT_UPDATE',
        ...payload,
        timestamp: new Date().toISOString()
      });

      for (const ws of sockets) {
        try {
          ws.send(wsMessage);
          sentWs++;
        } catch (e) {
          try { ws.close(); } catch (_) {}
        }
      }

      // 3b. Deliver to active SSE subscribers
      const encoder = new TextEncoder();
      const sseData = encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
      const deadWriters = [];

      for (const writer of this.sseWriters) {
        try {
          writer.write(sseData).catch(() => {
            deadWriters.push(writer);
          });
        } catch (e) {
          deadWriters.push(writer);
        }
      }

      deadWriters.forEach((w) => this.sseWriters.delete(w));

      return new Response(
        JSON.stringify({
          status: 'broadcast_delivered',
          activeWebSockets: sentWs,
          activeSSE: this.sseWriters.size,
          deliveredAt: new Date().toISOString()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // =========================================================================
    // 4. Retrieve Last State Endpoint (/last-state - GET)
    // HTTP fallback allowing clients to query current display state
    // =========================================================================
    if (url.pathname === '/last-state' && request.method === 'GET') {
      const lastPayload = await this.ctx.storage.get('lastPayload');
      return new Response(
        JSON.stringify({
          status: 'success',
          payload: lastPayload ? { ...lastPayload, isReplay: true } : null
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    return new Response('Not found', { status: 404 });
  }

  /**
   * WebSocket Hibernation Message Handler.
   */
  async webSocketMessage(ws, message) {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (_) {}
  }

  /**
   * WebSocket Hibernation Close Handler.
   */
  async webSocketClose(ws, code, reason, wasClean) {
    try {
      ws.close(code, 'Durable Object closing socket');
    } catch (_) {}
  }

  /**
   * WebSocket Hibernation Error Handler.
   */
  async webSocketError(ws, error) {
    try {
      ws.close(1011, 'WebSocket error occurred');
    } catch (_) {}
  }
}
