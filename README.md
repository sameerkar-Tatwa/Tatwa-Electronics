# Tatwa Electronics Smart Appliance Visualizer - Backend & Real-Time Sync Service

Standalone **Real-Time Visualizer & Tool Backend Service** for **Tatwa Electronics** Voice & Chat Smart Home Assistant.

It serves as the webhook tool endpoint that receives Oration AI tool triggers, normalizes appliance selections to the 20 verified Tatwa demo products across 4 categories, and streams them in real-time via Server-Sent Events (SSE) or WebSockets to the synchronized side HTML visualizer widget.

---

## 📁 Repository Structure

```
tatwa-electronics/
├── src/
│   ├── index.js                # Cloudflare Worker API & Real-time router
│   ├── catalog.js              # 20 Tatwa appliances, specs, & fuzzy alias resolver
│   └── sessionRoom.js          # Cloudflare Durable Object (WebSocket Hibernation & SSE streaming)
├── public/
│   ├── index.html              # Redirects cleanly to /visualizer/
│   └── visualizer/
│       ├── index.html          # Dual-pane luxury visualizer with category tabs & controls drawer
│       ├── app.js              # Real-time WebSocket/SSE client, dynamic renderers & simulator
│       ├── styles.css          # Cyber-electric dark luxury styling, glassmorphism & responsive layout
│       └── images/             # High-resolution local studio photography, diagrams & SVGs
├── server.js                   # Node.js Express & WebSocket server for local development
├── test-suite.js               # 15 automated input test cases (100% passing)
├── package.json                # Dependencies, type module, & deployment scripts
├── wrangler.jsonc              # Cloudflare Worker & Durable Objects configuration
└── .dev.vars.example           # Example local environment secrets
```

---

## 🧪 Local Testing & Verification

### 1. Run Node.js Server Locally
```bash
npm install
npm run dev
# Or: node server.js
```
The server starts locally at `http://localhost:3000`.
- Visualizer Interface: `http://localhost:3000/visualizer/`
- SSE Stream: `http://localhost:3000/api/stream/default`
- WebSocket: `ws://localhost:3000/api/ws?sessionId=default`
- Tool Endpoint: `http://localhost:3000/api/tool`
- Catalog (20 Models): `http://localhost:3000/api/products`

### 2. Run Comprehensive Automated Test Suite
```bash
npm test
# Or: node test-suite.js
```
Validates all 15 test cases (single strings, arrays, comma-delimited strings, stringified JSON arrays, natural language Hindi & English queries, price filters, comparisons, and guides).

---

## 🚢 Cloudflare Workers Deployment Guide

### Step 1: Deploy Directly with Wrangler
```bash
# 1. Login to your Cloudflare account
npx wrangler login

# 2. Test locally with Wrangler dev server
npm run dev:cf
# Or: npx wrangler dev --port 8787

# 3. Deploy to Cloudflare Workers with Durable Objects
npm run deploy
# Or: npx wrangler deploy
```

Your Worker will be live at:
`https://tatwa-electronics-visualizer.YOUR_SUBDOMAIN.workers.dev`

---

## 📡 API Endpoints Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/tool` | `POST` / `GET` | Main tool endpoint called by Oration Agent when an appliance is discussed. |
| `/api/oration/product-tool`| `POST` | Alternative tool endpoint alias for Oration webhook integration. |
| `/api/stream/:sessionId` | `GET` | SSE stream subscribed to by the frontend `app.js` to receive real-time updates. |
| `/api/ws?sessionId=...` | `GET` (Upgrade) | Real-time WebSocket connection to the session Durable Object. |
| `/api/config` | `GET` | Returns `publicKey`, `agentId`, and brand metadata for `<oration-widget>`. |
| `/api/products` | `GET` | Returns all 20 authorized demo Tatwa appliances across 4 categories. |
| `/api/health` | `GET` | Health check endpoint returning status, categories and timestamp. |
| `/api/last-state` | `GET` | Polling fallback returning the most recent payload for a given session. |

---

## 🛡️ Authorized Demo Appliances Catalog (20 Models)

### Category 1: Auto-Clean BLDC Chimneys (3 Models)
1. **Tatwa Aero BLDC 60 cm** (`TE-CH-601-BLDC`): Curved glass, 1500 m³/hr airflow, 150W BLDC motor, 44–46 dB sound level, heat auto-clean, wave gesture controls, 12-yr motor warranty.
2. **Tatwa Aero BLDC 75 cm** (`TE-CH-751-BLDC`): Mid-size 75 cm curved glass hood, 1500 m³/hr suction, 150W BLDC inverter motor, 44–46 dB quiet operation.
3. **Tatwa Aero BLDC 90 cm** (`TE-CH-901-BLDC`): Wide 90 cm canopy hood covering 3–5 burner cooktops with maximum smoke capture.

### Category 2: PureWash Dishwashers (10 Models)
4. **Tatwa PureWash FBID 14S Integrated** (`TE-DW-141-INT`): Luxury fully built-in dishwasher concealed in cabinetry, 14 place settings, Dual Zone Wash.
5. **Tatwa PureWash FSID 14S Semi-Integrated** (`TE-DW-142-SEMI`): Semi-integrated dishwasher fitted inside cabinetry with front-facing LED digital display.
6. **Tatwa PureWash FFSD 14S Inox** (`TE-DW-143-FS`): Freestanding stainless steel dishwasher with 14 place capacity, 8 wash programs.
7. **Tatwa PureWash FFSD 14S Obsidian Black** (`TE-DW-144-BK`): Black freestanding dishwasher with Dual Zone Wash and child lock.
8. **Tatwa PureWash FFSD 7PR 14S Eco Black** (`TE-DW-145-ECO`): Best value 14-place black dishwasher with Half Load mode (34% Off).
9. **Tatwa PureWash FFSD 6PR 14S Black Digital** (`TE-DW-146-DIG`): Digital screen freestanding dishwasher with 14 place capacity.
10. **Tatwa PureWash FFSD 6PR 12S Neo Inox** (`TE-DW-121-INOX`): 12-place setting dishwasher in brushed Inox.
11. **Tatwa PureWash FFSD 6PR 12S Neo Black** (`TE-DW-122-BK`): Great value 12-place dishwasher in Neo Black under ₹30,000 (₹29,999).
12. **Tatwa PureWash FFSD 6PR 8S Ace Inox** (`TE-DW-081-CPT`): Tabletop compact 8-place dishwasher in Inox for countertops.
13. **Tatwa PureWash FFSD 6PR 8S Ace Black** (`TE-DW-082-CPT`): Compact 8-place black dishwasher with modern countertop fit.

### Category 3: Smart Washing Machines (4 Models)
14. **Tatwa EcoWash Pro 8 kg Front Load Inverter** (`TE-WM-FL801-INV`): AI Direct Drive sensor, 1400 RPM spin speed, built-in steam heater for 99.9% allergen removal, 5-Star BEE efficiency.
15. **Tatwa HydroPulse 7.5 kg Top Load Smart Washer** (`TE-WM-TL751-SMT`): TurboDrum 3D wash flow, smart inverter motor, soft-close tempered glass lid, 5-Star energy rating.
16. **Tatwa AeroCare 10 kg AI Washer-Dryer Combo** (`TE-WM-WD101-COMBO`): 10 kg wash + 7 kg 100% condenser dry in 1 machine, 1400 RPM direct motion motor, wash & wear 59m cycle.
17. **Tatwa AquaSpin 6.5 kg Semi-Automatic Twin Tub** (`TE-WM-SA651-TT`): 1350 RPM high-speed spin air dryer, 100% rust-free polymer body, heavy duty roller jet pulsator under ₹10,000 (₹9,990).

### Category 4: Ultra HD Smart TVs (3 Models)
18. **Tatwa Vision Pro 55" 4K QLED Google TV** (`TE-TV-551-QLED`): 55" Quantum Dot 4K QLED with 1 Billion colors, 120Hz MEMC motion smoothing, Dolby Vision IQ & Atmos 40W sound, far-field voice.
19. **Tatwa CrystalView 65" OLED Cinema Smart TV** (`TE-TV-651-OLED`): Flagship 65" OLED with 8.3 million self-lit pixels, infinite contrast, 144Hz VRR gaming, 60W soundbar with integrated subwoofer, razor-thin 3.8mm blade styling.
20. **Tatwa Nova 43" 4K Ultra HD Frameless Smart TV** (`TE-TV-431-UHD`): 43" frameless 4K HDR Smart Google TV with 30W Dolby Audio, Chromecast built-in, bezel-less design under ₹22,000 (₹21,990).
