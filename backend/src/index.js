/**
 * Tatwa Electronics Product Visualizer - Cloudflare Worker Entrypoint (Pure JavaScript)
 *
 * WHAT THIS FILE DOES:
 * 1. Exports the `SessionRoom` Durable Object class for stateful WebSocket/SSE handling.
 * 2. Implements the Worker `fetch()` router handling all HTTP & WebSocket endpoints.
 * 3. Enforces full Cross-Origin Resource Sharing (CORS) so that independent frontends
 *    (running locally on any port or deployed anywhere) can interact with this API.
 * 4. Provides endpoints:
 *    - `GET  /api/config`            : Returns Oration public keys & agent ID from environment.
 *    - `GET  /api/products`          : Returns all 20 Tatwa demo appliances.
 *    - `GET  /api/stream/:sessionId` : Subscribes browser to Server-Sent Events (SSE).
 *    - `GET  /api/ws`                : Upgrades browser to high-performance WebSocket.
 *    - `POST /api/tool`              : Receives Oration custom tool triggers and broadcasts image links.
 *    - `GET  /api/health`            : Basic health check endpoint.
 */

import { SessionRoom } from './sessionRoom.js';
import { resolveToolRequest, getAllProducts } from './catalog.js';

// Export Durable Object class to Cloudflare runtime
export { SessionRoom };

/**
 * Builds CORS response headers allowing frontend requests across different ports/domains.
 */
function getCorsHeaders(env, request) {
  const origin = request.headers.get('Origin') || '*';
  const allowed = env.ALLOWED_ORIGIN || '*';
  const resolvedOrigin = allowed === '*' ? '*' : allowed.includes(origin) ? origin : allowed;

  return {
    'Access-Control-Allow-Origin': resolvedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  /**
   * Main Cloudflare Worker request handler.
   */
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);
    const corsHeaders = getCorsHeaders(env, request);
    const rawPath = url.pathname.replace(/\/+$/, '') || '/';

    // =========================================================================
    // 1. CORS Preflight (OPTIONS)
    // =========================================================================
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // =========================================================================
    // 2. Client Configuration Endpoint (/api/config, /config)
    // =========================================================================
    if ((rawPath === '/api/config' || rawPath === '/config') && request.method === 'GET') {
      const rawPk = env.ORATION_PUBLIC_KEY || '';
      const rawAg = env.ORATION_AGENT_ID || '';
      const pk = (!rawPk || rawPk.startsWith('pk_your_')) ? '70588826-0a19-4c4f-abdf-6de6c720d793' : rawPk;
      const ag = (!rawAg || rawAg.startsWith('ag_your_')) ? '128f59b2-7f37-4e1f-badd-f18c7a2a2287' : rawAg;

      return new Response(
        JSON.stringify({
          publicKey: pk,
          agentId: ag,
          brand: 'Tatwa Electronics',
          webhookSecretConfigured: Boolean(env.TOOL_WEBHOOK_SECRET),
          defaultSessionId: 'default'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // =========================================================================
    // 3. Full 20 Appliance Catalog (/api/catalog, /api/products, /products)
    // =========================================================================
    if ((rawPath === '/api/catalog' || rawPath === '/catalog' || rawPath === '/api/products' || rawPath === '/products') && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          status: 'success',
          brand: 'Tatwa Electronics',
          totalCount: 20,
          categories: ['chimney', 'dishwasher', 'washing_machine', 'tv'],
          products: getAllProducts()
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // =========================================================================
    // 4. Health Check (/api/health, /health)
    // =========================================================================
    if ((rawPath === '/api/health' || rawPath === '/health') && request.method === 'GET') {
      return new Response(
        JSON.stringify({
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
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    // =========================================================================
    // 5. WebSocket Upgrade Endpoint (/api/ws, /ws)
    // =========================================================================
    if (rawPath === '/api/ws' || rawPath === '/ws') {
      const sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id') || 'default';
      const id = env.SESSION_ROOM.idFromName(sessionId);
      const stub = env.SESSION_ROOM.get(id);

      const targetUrl = new URL(request.url);
      targetUrl.pathname = '/ws';
      return stub.fetch(new Request(targetUrl.toString(), request));
    }

    // =========================================================================
    // 6. SSE Stream Endpoint (/api/stream/:sessionId, /api/stream)
    // =========================================================================
    if (rawPath === '/api/stream' || rawPath.startsWith('/api/stream/')) {
      let sessionId = 'default';
      const parts = rawPath.split('/').filter(Boolean);
      if (parts.length >= 3 && parts[1] === 'stream') {
        sessionId = parts[2];
      } else {
        sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id') || 'default';
      }

      const id = env.SESSION_ROOM.idFromName(sessionId);
      const stub = env.SESSION_ROOM.get(id);

      const targetUrl = new URL(request.url);
      targetUrl.pathname = '/stream';
      return stub.fetch(new Request(targetUrl.toString(), request));
    }

    // =========================================================================
    // 7. Last State Polling Endpoint (/api/last-state)
    // =========================================================================
    if (rawPath === '/api/last-state') {
      const sessionId = url.searchParams.get('sessionId') || url.searchParams.get('session_id') || 'default';
      const id = env.SESSION_ROOM.idFromName(sessionId);
      const stub = env.SESSION_ROOM.get(id);

      const targetUrl = new URL(request.url);
      targetUrl.pathname = '/last-state';
      return stub.fetch(new Request(targetUrl.toString(), request));
    }

    // =========================================================================
    // 8. Oration AI Custom Tool Webhook Handler (/api/tool, /api/oration/product-tool)
    // =========================================================================
    if (
      (rawPath === '/api/tool' ||
       rawPath === '/tool' ||
       rawPath === '/api/oration/product-tool' ||
       rawPath === '/api/product-tool') &&
      (request.method === 'POST' || request.method === 'GET')
    ) {
      let bodyParams = {};

      if (request.method === 'POST') {
        try {
          bodyParams = await request.json();
        } catch (_) {
          bodyParams = {};
        }
      }

      // Merge query string params with POST body
      const queryParams = {};
      for (const [key, val] of url.searchParams.entries()) {
        queryParams[key] = val;
      }

      const mergedPayload = { ...queryParams, ...bodyParams };
      const sessionId = mergedPayload.sessionId || mergedPayload.session_id || 'default';

      try {
        // Resolve payload using Tatwa Electronics resolution engine
        const resolved = resolveToolRequest(mergedPayload);

        // Broadcast to SessionRoom Durable Object
        const doId = env.SESSION_ROOM.idFromName(sessionId);
        const stub = env.SESSION_ROOM.get(doId);

        const broadcastReq = new Request('https://dummy/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resolved)
        });

        // Fire broadcast
        await stub.fetch(broadcastReq);

        return new Response(
          JSON.stringify({
            status: 'success',
            componentType: resolved.componentType,
            title: resolved.title,
            subtitle: resolved.subtitle,
            displayedImages: resolved.images || [],
            productsCount: (resolved.products || []).length,
            displayedProducts: resolved.products || [],
            bundles: resolved.bundles,
            serviceData: resolved.serviceData,
            guideData: resolved.guideData,
            manualData: resolved.manualData,
            brand: 'Tatwa Electronics',
            sessionId: sessionId,
            broadcastDelivered: true,
            timestamp: new Date().toISOString()
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      } catch (err) {
        console.error('[ToolWebhook] Error handling product tool request:', err);
        return new Response(
          JSON.stringify({
            error: 'Failed to process product tool payload',
            message: err instanceof Error ? err.message : String(err)
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
    }

    // =========================================================================
    // 9. Visualizer Frontend & Static Assets Route (/visualizer, /)
    // =========================================================================
    if (url.pathname === '/visualizer') {
      return Response.redirect(`${url.origin}/visualizer/`, 301);
    }

    if (env.ASSETS && (url.pathname.startsWith('/visualizer') || url.pathname === '/' || url.pathname.includes('.'))) {
      return env.ASSETS.fetch(request);
    }

    // Fallback 404
    return new Response(
      JSON.stringify({
        status: 'error',
        message: 'Endpoint not found',
        brand: 'Tatwa Electronics',
        endpoints: ['/api/tool', '/api/stream/:sessionId', '/api/ws', '/api/config', '/api/products', '/api/health']
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
};
