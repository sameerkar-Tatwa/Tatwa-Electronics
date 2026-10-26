# Tatwa Electronics - Oration AI Voice Webhook Tool Setup Guide

This guide details how to configure the **Tatwa Electronics Smart Appliance Tool** inside the [Oration AI Agent Dashboard](https://oration.ai) so the voice/chat agent can trigger real-time visual updates.

---

## 1. Webhook Tool Endpoint

| Environment | Webhook URL | Method |
| :--- | :--- | :--- |
| **Local Development** | `http://localhost:3000/api/tool` | `POST` |
| **Cloudflare Worker** | `https://<your-worker-subdomain>.workers.dev/api/tool` | `POST` |
| **Custom Production Domain** | `https://api.tatwaelectronics.com/api/tool` | `POST` |

> [!NOTE]
> The backend also supports `GET` requests with query parameters (e.g. `/api/tool?query=dishwasher&maxPrice=30000`).

---

## 2. Oration AI Tool Definition

Paste the following JSON schema into your **Oration AI Agent Dashboard -> Tools -> Add Custom Webhook Tool**:

### Tool Configuration
- **Name**: `display_tatwa_products`
- **Description**: `Displays Tatwa Electronics smart appliances (Chimneys, Dishwashers, Washing Machines, Smart TVs), comparisons, pricing deals, installation blueprints, and troubleshooting guides on the caller's visualizer screen.`
- **Endpoint URL**: `https://<your-deployed-domain>/api/tool`
- **Method**: `POST`

### Tool Parameter Schema (JSON Schema)
```json
{
  "type": "object",
  "properties": {
    "product_enums": {
      "type": "array",
      "items": { "type": "string" },
      "description": "List of exact or partial Tatwa appliance names to display or compare (e.g., ['Tatwa Aero BLDC 60 cm', 'Tatwa PureWash 14S Built-in'])."
    },
    "display_mode": {
      "type": "string",
      "enum": ["carousel", "sequence", "grid", "comparison"],
      "description": "Layout mode for rendering. Use 'comparison' when the caller wants to compare 2 or more products side-by-side."
    },
    "category": {
      "type": "string",
      "enum": ["chimney", "dishwasher", "washing_machine", "tv"],
      "description": "Appliance category filter."
    },
    "maxPrice": {
      "type": "number",
      "description": "Maximum budget ceiling in INR (e.g., 30000 for products under ₹30,000)."
    },
    "action": {
      "type": "string",
      "enum": [
        "show_products",
        "show_all",
        "welcome",
        "installation",
        "chimney_cleaning",
        "dishwasher_cleaning",
        "dishwasher_usp",
        "bldc_motor",
        "chimney_controls",
        "dishwasher_loading",
        "washing_machine_guide",
        "tv_display_guide",
        "show_manual"
      ],
      "description": "Special visual action or guide to open on the user screen."
    },
    "query": {
      "type": "string",
      "description": "Raw natural language request from user in Hindi or English (e.g., '30000 ke andar dishwasher aur chimney dikhao')."
    },
    "sessionId": {
      "type": "string",
      "description": "The active session ID passed in dynamic variables to route updates to the specific caller screen."
    }
  }
}
```

---

## 3. Dynamic Variables in Oration AI

To route tool visual updates to the exact caller's browser screen, map the `sessionId` variable in Oration AI's agent configuration:
```json
{
  "dynamicVariables": {
    "sessionId": "{{sessionId}}"
  }
}
```

When `<oration-widget>` is mounted in the frontend, it automatically injects `dynamic-variables='{"sessionId":"sess_..."}'`.

---

## 4. Test Payloads (cURL Examples)

### A. Display Specific Appliance by Name
```bash
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -d '{
    "product": "Tatwa EcoWash Pro 8 kg Front Load Inverter",
    "sessionId": "default"
  }'
```

### B. Side-by-Side Comparison of Smart TVs
```bash
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -d '{
    "display_mode": "comparison",
    "product_enums": [
      "Tatwa Vision Pro 55 inch 4K QLED",
      "Tatwa CrystalView 65 inch OLED Cinema"
    ],
    "sessionId": "default"
  }'
```

### C. Natural Language Hindi Budget Query
```bash
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -d '{
    "query": "30,000 के अंदर डिशवॉशर दिखाओ",
    "sessionId": "default"
  }'
```

### D. Chimney Installation Blueprint Guide
```bash
curl -X POST http://localhost:3000/api/tool \
  -H "Content-Type: application/json" \
  -d '{
    "action": "installation",
    "sessionId": "default"
  }'
```

---

## 5. Deployment Options

### Option 1: Deploy to Cloudflare Workers (Instant Global CDN)
From the `backend/` directory:
```bash
cd backend
npx wrangler deploy
```
Wrangler will output your live URL: `https://tatwa-oration-tool-backend.<subdomain>.workers.dev`.
Your Oration tool webhook URL will be:
`https://tatwa-oration-tool-backend.<subdomain>.workers.dev/api/tool`

### Option 2: Deploy to Node.js / Docker / VPS
```bash
cd backend
npm install
npm start
```
Starts on `PORT=3001` (or your configured `process.env.PORT`).
