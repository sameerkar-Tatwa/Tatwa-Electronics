# Tatwa Electronics Smart Living Ecosystem & Real-Time Voice Visualizer

Official real-time smart home visualizer and webhook tool platform for **Tatwa Electronics** Voice & Chat AI Assistant (powered by Oration AI / OmniAgent).

---

## 🏗️ Architecture & Decoupled File Structure

The project is structured with strict separation of concerns into:
1. **`backend/`**: Standalone Backend Tool API Microservice — deployable independently to Cloudflare Workers or Node.js hosting to serve as the voice webhook tool endpoint for Oration AI.
2. **`public/index.html`**: The Home Window / Landing Portal (`/`) — an authentic, responsive portal featuring live ecosystem stats, category exploration, voice architecture flow, 1-click endpoint copy, and direct visualizer launchers.
3. **`public/visualizer/`**: The AI Visualizer Studio (`/visualizer/`) — high-performance real-time visual canvas with deep blue scaled header (52px), splash loading animation, SSE/WebSocket live syncing, URL query routing, product comparisons, and technical interactive guides.

```
tatwa-electric/
├── backend/                             # ⚡ STANDALONE BACKEND TOOL MICROSERVICE
│   ├── src/
│   │   ├── catalog.js                   # 20 Tatwa appliances, specifications & fuzzy alias resolver
│   │   ├── index.js                     # Cloudflare Worker API & webhook tool router
│   │   └── sessionRoom.js               # Durable Object (WebSocket hibernation & SSE live streaming)
│   ├── server.js                        # Standalone Node.js Express & WebSocket server
│   ├── wrangler.jsonc                   # Cloudflare Worker & Durable Objects config
│   ├── package.json                     # Isolated backend dependencies & scripts
│   ├── test-suite.js                    # 18 automated webhook test cases (100% pass)
│   └── ORATION_TOOL_SETUP.md            # Complete Oration AI Webhook integration guide & schemas
│
├── public/
│   ├── index.html                       # 🏠 HOME WINDOW / LANDING PORTAL (served at /)
│   └── visualizer/                      # 🎨 AI VISUALIZER STUDIO (served at /visualizer/)
│       ├── index.html                   # Dual-pane UI, deep blue header, splash loader & controls
│       ├── app.js                       # Real-time SSE/WS sync client, URL params & interactive state
│       ├── styles.css                   # Deep blue header (52px), white showcase cards, light theme
│       └── images/                      # High-res photography, technical blueprints & icons
│
├── server.js                            # Monolithic dev server (serves Home Window + Visualizer + API)
├── test-suite.js                        # Root automated test suite (18 test cases)
├── package.json                         # Root project dependencies & NPM scripts
├── wrangler.jsonc                       # Root Cloudflare deployment config
└── README.md                            # Project overview & documentation
```

---

## 🚀 Quick Start (Local Development)

### 1. Run the Full Application (Home Window + Visualizer + Backend API)
```bash
npm install
npm run dev
# or: node server.js
```
The server will start at `http://localhost:3000`:
- **Home Window (Portal)**: [`http://localhost:3000/`](http://localhost:3000/)
- **AI Visualizer Studio**: [`http://localhost:3000/visualizer/`](http://localhost:3000/visualizer/)
- **Category Deep Links**:
  - Chimneys: [`http://localhost:3000/visualizer/?category=chimney`](http://localhost:3000/visualizer/?category=chimney)
  - Dishwashers: [`http://localhost:3000/visualizer/?category=dishwasher`](http://localhost:3000/visualizer/?category=dishwasher)
  - Washers: [`http://localhost:3000/visualizer/?category=washer`](http://localhost:3000/visualizer/?category=washer)
  - Smart TVs: [`http://localhost:3000/visualizer/?category=tv`](http://localhost:3000/visualizer/?category=tv)
- **Webhook Tool Endpoint**: `http://localhost:3000/api/tool`
- **Catalog API (20 Models)**: `http://localhost:3000/api/products`
- **SSE Stream**: `http://localhost:3000/api/stream/:sessionId`

### 2. Run the Standalone Backend Tool API Separately
If you want to run or deploy the webhook backend independently:
```bash
cd backend
npm install
npm run dev
# or: node server.js
```
Backend starts on port `8787` (or `PORT` env var).

### 3. Run Automated Test Suite (18/18 Passing)
```bash
npm test
# or in backend directory:
cd backend && npm test
```

---

## 🎙️ Oration AI Webhook Tool Configuration

Configure your Oration AI voice assistant with the custom tool definition below:

### Tool Definition
- **Tool Name**: `display_tatwa_products`
- **Method**: `POST`
- **Webhook URL**:
  - *Local Development (with ngrok)*: `https://<YOUR-NGROK-SUBDOMAIN>.ngrok-free.app/api/tool`
  - *Production Worker*: `https://tatwa-electronics-visualizer.<SUBDOMAIN>.workers.dev/api/tool`
- **Description**:
  > Call this tool whenever the user asks to see, view, compare, filter, or troubleshoot Tatwa appliances (Auto-Clean BLDC chimneys, PureWash dishwashers, AI Inverter washing machines, and Ultra HD 4K TVs). Provide appliance model names or numbers, actions, guides, or category filters.

### JSON Schema (Tool Parameters)
```json
{
  "type": "object",
  "properties": {
    "product_enums": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Appliance model identifiers or numbers (e.g., ['TE-CH-601-BLDC'], ['TE-DW-141-INT', 'TE-DW-143-FS'], ['chimney 1', 'tv 2'])."
    },
    "action": {
      "type": "string",
      "enum": [
        "show_category",
        "showcase_spec",
        "installation_guide",
        "cleaning_guide",
        "washing_guide",
        "tv_calibration",
        "salt_care",
        "load_guide",
        "offers",
        "video",
        "welcome"
      ],
      "description": "Interactive action or technical guide to project onto the visualizer canvas."
    },
    "category": {
      "type": "string",
      "enum": ["chimney", "dishwasher", "washer", "tv"],
      "description": "Category to filter and display."
    },
    "max_price": {
      "type": "number",
      "description": "Optional budget ceiling in INR (e.g., 30000)."
    },
    "display_mode": {
      "type": "string",
      "enum": ["single", "comparison", "sequence"],
      "description": "How products should be laid out on the screen."
    },
    "sessionId": {
      "type": "string",
      "description": "Dynamic session identifier linking the caller to their visualizer window (e.g. {{session.id}} or {{user.sessionId}})."
    }
  }
}
```

Detailed payloads, cURL examples, and field mappings are documented in [`backend/ORATION_TOOL_SETUP.md`](file:///d:/Tatwa%20projects/tatwa%20electric/backend/ORATION_TOOL_SETUP.md).

---

## 🚢 Production Deployment

### Option A: Deploy Standalone Backend API (Cloudflare Workers)
```bash
cd backend
npx wrangler login
npx wrangler deploy
```
The webhook endpoint will be available at:
`https://tatwa-backend-tool.<YOUR-SUBDOMAIN>.workers.dev/api/tool`

### Option B: Deploy Full Monolithic Worker (Backend + Static Assets)
```bash
npx wrangler login
npx wrangler deploy
```

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
