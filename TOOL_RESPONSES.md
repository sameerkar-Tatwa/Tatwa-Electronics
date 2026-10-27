# TATWA ELECTRONICS - TOOL AUDIT, VOICE SAYINGS & RESPONSE SPECIFICATION (`TOOL_RESPONSES.md`)

This document provides the complete, authoritative mapping between **User Spoken Sayings (Voice / Text Queries)**, **Oration AI Webhook Tool Arguments**, **Visualizer Screens (`componentType`)**, and **Exact Output JSON Payloads**.

---

## 1. Executive Summary & Architecture Overview

The Tatwa Electronics Visualizer is driven by the webhook endpoint `/api/tool` and real-time streaming channels (`/api/stream/:sessionId` via Server-Sent Events and `/api/ws` via WebSocket).

When an agent or user speaks:
1. **Oration AI Speech Recognition** translates the voice utterance into tool parameters (`action`, `query`, `category`, `products`, `product_enums`, `display_mode`).
2. **`resolveToolRequest` (Engine in `src/catalog.js` & `backend/src/catalog.js`)** normalizes English, Hindi, Hinglish, product nicknames, budget expressions, and comparison requests into canonical payloads.
3. **The Visualizer (`public/visualizer/app.js`)** renders the matched view using GPU-accelerated CSS and responsive component viewports.

---

## 2. Complete Matrix: What is Said $\rightarrow$ Tool Call $\rightarrow$ Screen Represented $\rightarrow$ Output Payload

| # | Spoken Utterance / Sayings (English, Hindi, Hinglish) | Tool Call Arguments (`action`, `category`, `products`, `query`) | Screen Represented | `componentType` & Key Output Fields | Visual Layout & Content Shown |
|---|---|---|---|---|---|
| **1** | *"Show me the TVs"*, *"TV's"*, *"Smart TVs"*, *"What televisions do you have?"*, *"Tatwa ke TV dikhao"*, *"टीवी दिखाओ"* | `{"action": "view", "category": "tv"}` OR `{"query": "TV's"}` | **Smart TVs Showcase** | `componentType: "products"`<br>`title: "Tatwa Smart TVs Showcase"`<br>`products: 3 items` | 3 luxury cards showcasing Vision Pro 55" QLED, CrystalView 65" OLED, and Nova 43" UHD with specs, pricing, MRP strikethrough, and feature pills. |
| **2** | *"comparison between the TV's"*, *"Compare TVs"*, *"Compare the TVs"*, *"TV comparison"*, *"55 inch vs 65 inch vs 43 inch"*, *"टीवी कंपेयर करो"* | `{"action": "compare", "category": "tv"}` OR `{"query": "comparison between the TV's"}` | **TV Comparison Matrix** | `componentType: "comparison"`<br>`title: "Tatwa Smart TVs Comparison (3 Models)"`<br>`products: 3 items` | Side-by-side comparison matrix with Display & Screen, Refresh Rate (120Hz/144Hz/60Hz), HDR, Dolby Atmos Audio, Google TV OS, and 3-Year Warranty rows. |
| **3** | *"Compare TV 1 and TV 2"*, *"Compare 55 inch QLED and 65 inch OLED"*, *"Vision Pro aur CrystalView compare karo"* | `{"action": "compare", "category": "tv", "query": "Compare TV 1 and TV 2"}` | **Dual TV Comparison Matrix** | `componentType: "comparison"`<br>`title: "Tatwa Smart TVs Comparison (2 Models)"`<br>`products: [TV_55_QLED, TV_65_OLED]` | 2-column focused technical comparison between 55" QLED (₹36,990) and 65" OLED Cinema (₹99,990). |
| **4** | *"Tell me about TV 1"*, *"Vision Pro 55 inch"*, *"QLED 55 inch details"*, *"55 inch TV price"* | `{"product": "tv 1"}` OR `{"product_enums": ["TV_VISION_55_QLED"], "display_mode": "single"}` | **Single Product Spotlight** | `componentType: "products"`<br>`title: "Tatwa Vision Pro 55\" 4K QLED Google TV"`<br>`products: 1 item` | High-impact spotlight card with 1 Billion colors, 120Hz MEMC, Dolby Vision IQ, 40W sound, ₹36,990 price badge (Save ₹18,000). |
| **5** | *"Tell me about TV 2"*, *"CrystalView 65 inch OLED"*, *"65 inch OLED details"* | `{"product": "tv 2"}` OR `{"product_enums": ["TV_CRYSTALVIEW_65_OLED"], "display_mode": "single"}` | **Single Product Spotlight** | `componentType: "products"`<br>`title: "Tatwa CrystalView 65\" OLED Cinema Smart TV"`<br>`products: 1 item` | Flagship card with Self-lit OLED, 144Hz Native VRR, 60W Soundbar with subwoofer, razor-thin 3.8mm blade profile, ₹99,990 price. |
| **6** | *"Tell me about TV 3"*, *"Nova 43 inch TV"*, *"43 inch 4K frameless"* | `{"product": "tv 3"}` OR `{"product_enums": ["TV_NOVA_43_UHD"], "display_mode": "single"}` | **Single Product Spotlight** | `componentType: "products"`<br>`title: "Tatwa Nova 43\" 4K Ultra HD Frameless Smart TV"`<br>`products: 1 item` | High-value 4K card with frameless bezels, Google TV OS, 30W Dolby Audio, ₹21,990 price badge (Save ₹11,000). |
| **7** | *"TV display guide"*, *"QLED vs OLED"*, *"Picture calibration"*, *"Screen guide"*, *"Dolby Atmos audio tuning"* | `{"action": "tv_display_guide"}` OR `{"query": "qled vs oled"}` | **TV Cinema Calibration Guide** | `componentType: "tv-display-guide"`<br>`title: "Tatwa Cinema Display & Audio Calibration Guide"`<br>`guideData: TV_DISPLAY_GUIDE` | Interactive infographic contrasting Quantum Dot 1000 nits high-brightness for bright Indian living rooms vs Self-lit OLED true blacks, plus eARC audio setup. |
| **8** | *"Show me washing machines"*, *"Washing machines"*, *"What washers do you have?"*, *"वाशिंग मशीन बताओ"* | `{"action": "view", "category": "washing_machine"}` OR `{"query": "washing machines"}` | **Washing Machines Showcase** | `componentType: "products"`<br>`title: "Tatwa Washing Machines Showcase"`<br>`products: 4 items` | 4-model showcase: EcoWash Pro 8kg Front Load, HydroPulse 7.5kg Top Load, AeroCare 10kg Washer-Dryer, and AquaSpin 6.5kg Semi-Automatic. |
| **9** | *"comparison between the washing machines"*, *"Compare washing machines"*, *"Washers comparison"*, *"Front load vs top load"* | `{"action": "compare", "category": "washing_machine"}` OR `{"query": "comparison between the washing machines"}` | **Washing Machine Comparison** | `componentType: "comparison"`<br>`title: "Tatwa Washing Machines Comparison (3 Models)"`<br>`products: 3 items` | Side-by-side matrix comparing Capacity, Motor RPM (1400 vs 780), 5-Star BEE rating, AI Steam sanitization, and warranty terms. |
| **10** | *"Washing machine guide"*, *"Fabric care guide"*, *"How to use steam wash"*, *"Baby clothes washing"* | `{"action": "washing_machine_guide"}` OR `{"query": "fabric care"}` | **Fabric Care & Cycle Guide** | `componentType: "washing-machine-guide"`<br>`title: "Tatwa EcoWash Smart Fabric & Program Guide"`<br>`guideData: WASHING_MACHINE_FABRIC_GUIDE` | 3 interactive cards detailing AI Steam Allergy Care (60°C-90°C), Cotton & Heavy 1400 RPM extraction, and Delicates Quick 15m cycle. |
| **11** | *"Show me chimneys"*, *"Aero BLDC chimneys"*, *"Kitchen hoods"*, *"चिमनी दिखाओ"* | `{"action": "view", "category": "chimney"}` OR `{"query": "chimneys"}` | **Chimneys Showcase** | `componentType: "products"`<br>`title: "Tatwa Chimneys Showcase"`<br>`products: 3 items` | 3-model marquee presenting Aero BLDC 60 cm (₹21,330), Aero BLDC 75 cm (₹23,118), and Aero BLDC 90 cm (₹24,987). |
| **12** | *"comparison between the chimneys"*, *"Compare chimneys"*, *"60 cm vs 75 cm vs 90 cm chimney"* | `{"action": "compare", "category": "chimney"}` OR `{"query": "comparison between the chimneys"}` | **Chimney Comparison Matrix** | `componentType: "comparison"`<br>`title: "Tatwa Chimneys Comparison (3 Models)"`<br>`products: 3 items` | 3-column matrix showing Cooktop Match (2-4 vs 3-4 vs 3-5 burners), 1500 m³/hr suction, 150W BLDC motor, 44-46 dB quiet sound, and dimensions. |
| **13** | *"Chimney installation"*, *"How to install chimney"*, *"Installation steps"*, *"Duct size"* | `{"action": "chimney_installation"}` OR `{"query": "chimney installation"}` | **Chimney Installation Blueprint** | `componentType: "chimney-installation"`<br>`title: "Tatwa Chimney Installation Guide"`<br>`images: 1 blueprint` | 4-step installation manual: Step 1 Prepare Wall (65-75 cm clearance), Step 2 Fix Bracket, Step 3 Mount Chimney, Step 4 Connect 150mm Duct & Test. |
| **14** | *"Chimney cleaning"*, *"Heat auto clean"*, *"How to clean chimney"*, *"Oil collector maintenance"* | `{"action": "chimney_cleaning"}` OR `{"query": "heat auto clean"}` | **Heat Auto-Clean Visual** | `componentType: "chimney-cleaning"`<br>`title: "Chimney Cleaning & Maintenance Guide"`<br>`images: 1 guide` | 4-step cycle breakdown: Step 1 Surface Wipe, Step 2 9-Minute Thermal Heat Melting, Step 3 1-Minute Centrifugal Blower Flush, Step 4 Empty Stainless Oil Collector. |
| **15** | *"BLDC motor"*, *"What is BLDC motor"*, *"Inverter chimney motor"* | `{"action": "bldc_motor"}` OR `{"query": "bldc motor"}` | **BLDC Inverter Motor Tech Video** | `componentType: "bldc-motor"`<br>`title: "Tatwa Inverter BLDC Motor Technology"`<br>`videoUrl: "images/bldc_motor.mp4"` | Video player card detailing Brushless DC architecture, 150W low power draw, 44-46 dB quiet sound, and 12-year warranty. |
| **16** | *"Gesture control"*, *"Wave gesture"*, *"How wave controls work"* | `{"action": "chimney_controls"}` OR `{"query": "gesture control"}` | **Wave Gesture Controls Guide** | `componentType: "chimney-controls"`<br>`title: "Touch & Wave Gesture Control System"`<br>`images: 1 card` | Interactive diagram of dual optical motion sensors: Left-to-Right wave increments speed (1 to 9); Right-to-Left decrements and turns off. |
| **17** | *"Tell me about dishwashers"*, *"Show dishwashers"*, *"PureWash dishwashers"*, *"डिशवॉशर दिखाओ"* | `{"action": "view", "category": "dishwasher"}` OR `{"query": "dishwashers"}` | **Dishwashers Showcase** | `componentType: "products"`<br>`title: "Tatwa Dishwashers Showcase"`<br>`products: 10 items` | 10-model catalogue covering Built-in (FBID 14S), Semi-integrated (FSID 14S), Freestanding (Inox/Black), and Tabletop compact units. |
| **18** | *"comparison between the dishwashers"*, *"Compare dishwashers"*, *"Built-in vs freestanding dishwasher"* | `{"action": "compare", "category": "dishwasher"}` OR `{"query": "comparison between the dishwashers"}` | **Dishwasher Comparison Matrix** | `componentType: "comparison"`<br>`title: "Tatwa Dishwashers Comparison (3 Models)"`<br>`products: 3 items` | Side-by-side technical table comparing Place Settings (14S vs 12S vs 8S), Wash Zones, Natural Drying, and Energy Class. |
| **19** | *"How to load dishwasher"*, *"Kadai in dishwasher"*, *"Dishwasher loading"*, *"बर्तन कैसे लगाएं"* | `{"action": "dishwasher_loading"}` OR `{"query": "how to load dishwasher"}` | **Dishwasher Loading Guide** | `componentType: "dishwasher-loading"`<br>`title: "How to Load a Tatwa Dishwasher"`<br>`guideData: DISHWASHER_LOADING_GUIDE` | Indian utensil arrangement guide: Lower rack for Kadai/Patila at 45° angle, Upper rack for Katoris/Mugs, Cutlery basket, and Spray arm check. |
| **20** | *"Dishwasher salt"*, *"Rinse aid"*, *"Dishwasher maintenance"*, *"Hard water care"* | `{"action": "dishwasher_cleaning"}` OR `{"query": "dishwasher salt"}` | **Dishwasher Hygiene & Salt Guide** | `componentType: "dishwasher-cleaning"`<br>`title: "Dishwasher Hygiene & Salt Softener Guide"`<br>`products: 2 items` | Visual walkthrough for refilling water softening salt in bottom chamber, adding rinse aid for spotless drying, and rinsing mesh filters. |
| **21** | *"Dishwasher features"*, *"Why Tatwa dishwasher"*, *"3D spray wash"* | `{"action": "dishwasher_usp"}` OR `{"query": "dishwasher features"}` | **Dishwasher Innovations / USPs** | `componentType: "dishwasher-usp"`<br>`title: "Tatwa PureWash Dishwasher Innovations"`<br>`products: 3 items` | 4 core engineering USPs: 3D Triple Spray Arms, Dual Zone Wash, 70°C Intensive Hygiene Sterilization, and 14-Place Indian capacity. |
| **22** | *"Show offers"*, *"Best discounts"*, *"Deals"*, *"ऑफर क्या हैं"* | `{"action": "show_offers"}` OR `{"display_mode": "offers"}` | **Promotional Deals Showcase** | `componentType: "offers"`<br>`title: "Tatwa Electronics Promotional Deals"`<br>`products: 11 offer models` | Filtered cards sorted by highest promotional discount: Save up to ₹50,000 (34% off Aero 60, 34% off Eco Black Dishwasher, 33% off OLED 65"). |
| **23** | *"Washing machine under 30000"*, *"TV under 40000"*, *"Dishwasher under 30000"* | `{"query": "TV under 40000", "maxPrice": 40000}` | **Budget Filtered Showcase** | `componentType: "products"`<br>`title: "Tatwa Smart TVs Under ₹40,000"`<br>`products: filtered models` | Curated appliances matching strict budget constraints with total savings highlighted. |
| **24** | *"User manual"*, *"Maintenance guide"*, *"Troubleshooting FAQ"*, *"मैनुअल"* | `{"action": "show_manual"}` OR `{"display_mode": "manual"}` | **User Manual & Support Master** | `componentType: "manual"`<br>`title: "Tatwa User Manual & Maintenance Master Guide"`<br>`manualData: USER_MANUAL_GUIDE` | Multi-section maintenance hub: Chimney Auto-clean cycle, Gesture rules, Dishwasher care, and Troubleshooting FAQ. |
| **25** | *"Welcome"*, *"Home"*, *"Start"*, *"होम"* | `{"action": "welcome"}` OR `{"display_mode": "welcome"}` | **Flagship Studio Home** | `componentType: "welcome"`<br>`title: "Tatwa Electronics Studio"`<br>`products: 4 flagships` | Default landing page featuring Tatwa Voice Cat, 4 category cards, and Tap to Speak prompt. |
| **26** | *"Smart appliance bundles"*, *"Kitchen suite combo"*, *"Show bundles"*, *"Combo packages"*, *"बंडल"*, *"कॉम्बो"* | `{"action": "show_bundle"}` OR `{"query": "Show me smart appliance bundles"}` | **Smart Appliance Bundles & Combo Suites** | `componentType: "bundle"`<br>`title: "Tatwa Smart Appliance Bundles & Suites"`<br>`bundles: 3 suites` | 3 dual-appliance suites: 1. Kitchen Suite (Aero 60 + FBID 14S, Save ₹23,490); 2. Smart Home Duo (55" QLED + 8kg Front Load, Save ₹34,000); 3. Cinema Luxury (65" OLED + 10kg Washer-Dryer, Save ₹75,000) with VIP privileges. |
| **27** | *"Can you deliver and install in 560001?"*, *"Pincode 110001"*, *"Installation in Bangalore"*, *"पिनकोड डिलीवरी"* | `{"action": "serviceability", "pincode": "560001"}` OR `{"query": "pincode 560001"}` | **Pan-India Pin Code Serviceability & Installation Estimator** | `componentType: "serviceability"`<br>`title: "Tatwa Installation & Service Network"`<br>`serviceData: coverage object` | Pin code verification badge, 24-48 hr technician turnaround SLA, 4-step certified installation blueprint, 6 free standard inclusions, and toll-free helpline (1800-TATWA-CARE). |

---

## 3. Product Nicknames & Model Aliases Reference Table

Every product can be invoked via multiple verbal expressions, model codes, SKUs, or ordinal numbers:

| Category | Canonical Enum Key | Model Name & SKU | Verbal Nicknames & Speech Phrases | Price / MRP |
|---|---|---|---|---|
| **Chimney** | `CHIMNEY_AERO_BLDC_60` / `AERO_60` | TATWA AERO BLDC HC SC FL BK 60 (`TE-CH-601-BLDC`) | "Chimney 1", "Aero 60", "60 cm chimney", "small chimney", "c1", "600 mm hood", "60 सेमी चिमनी" | ₹21,330 (MRP ₹32,490) |
| **Chimney** | `CHIMNEY_AERO_BLDC_75` / `AERO_75` | TATWA AERO BLDC HC SC FL BK 75 (`TE-CH-751-BLDC`) | "Chimney 2", "Aero 75", "75 cm chimney", "medium chimney", "c2", "750 mm hood", "75 सेमी चिमनी" | ₹23,118 (MRP ₹33,990) |
| **Chimney** | `CHIMNEY_AERO_BLDC_90` / `AERO_90` | TATWA AERO BLDC HC SC FL BK 90 (`TE-CH-901-BLDC`) | "Chimney 3", "Aero 90", "90 cm chimney", "wide canopy", "c3", "900 mm hood", "90 सेमी चिमनी" | ₹24,987 (MRP ₹35,490) |
| **Dishwasher** | `DW_FBID_8PR_14S` / `FBID_8PR_14S` | TATWA FBID 8PR 14S INT (`TE-DW-141-INT`) | "Dishwasher 1", "Built-in dishwasher", "Integrated dishwasher", "Concealed controls dishwasher", "14 place built-in" | ₹63,901 (MRP ₹70,990) |
| **Dishwasher** | `DW_FSID_8PR_14S` / `FSID_8PR_14S` | TATWA FSID 8PR 14S SEMI (`TE-DW-142-SEMI`) | "Dishwasher 2", "Semi-integrated dishwasher", "Front panel dishwasher", "Visible controls dishwasher" | ₹58,617 (MRP ₹65,490) |
| **Dishwasher** | `DW_FFSD_8PR_14S_INOX` / `FFSD_8PR_14S` | TATWA FFSD 8PR 14S INOX (`TE-DW-143-FS`) | "Dishwasher 3", "Freestanding Inox", "Stainless steel dishwasher", "14 place Inox" | ₹52,170 (MRP ₹60,490) |
| **Dishwasher** | `DW_FFSD_8PR_14S_BK` / `FFSD_8PR_14S_BK` | TATWA FFSD 8PR 14S BK (`TE-DW-144-BK`) | "Dishwasher 4", "Freestanding black", "Obsidian black dishwasher", "Black 14 place" | ₹51,964 (MRP ₹57,990) |
| **Dishwasher** | `DW_FFSD_7PR_14S_BK` / `FFSD_7PR_14S_BK` | TATWA FFSD 7PR 14S BK (`TE-DW-145-ECO`) | "Dishwasher 5", "Eco black dishwasher", "7 program dishwasher", "Best value dishwasher" | ₹30,200 (MRP ₹45,990) |
| **Dishwasher** | `DW_FFSD_6PR_14S_BK_DIGITAL` | TATWA FFSD 6PR 14S BK DIGI (`TE-DW-146-DIG`) | "Dishwasher 6", "Black digital dishwasher", "Digital screen dishwasher" | ₹35,010 (MRP ₹48,990) |
| **Dishwasher** | `DW_FFSD_6PR_12S_NEO_INOX` | TATWA FFSD 6PR 12S NEO INOX (`TE-DW-121-INOX`) | "Dishwasher 7", "12 place Inox", "Neo Inox dishwasher", "Medium dishwasher inox" | ₹34,250 (MRP ₹40,990) |
| **Dishwasher** | `DW_FFSD_6PR_12S_NEO_BK` | TATWA FFSD 6PR 12S NEO BK (`TE-DW-122-BK`) | "Dishwasher 8", "12 place black", "Neo black dishwasher", "Dishwasher under 30000", "29999 dishwasher" | ₹29,999 (MRP ₹37,490) |
| **Dishwasher** | `DW_FFSD_6PR_8S_ACE_INOX` | TATWA FFSD 6PR 8S ACE INOX (`TE-DW-081-CPT`) | "Dishwasher 9", "Ace Inox compact", "8 place tabletop inox", "Tabletop dishwasher inox" | ₹28,150 (MRP ₹31,990) |
| **Dishwasher** | `DW_FFSD_6PR_8S_ACE_BLACK` | TATWA FFSD 6PR 8S ACE BK (`TE-DW-082-CPT`) | "Dishwasher 10", "Ace black compact", "8 place tabletop black", "Smallest dishwasher", "Cheapest dishwasher" | ₹26,750 (MRP ₹30,490) |
| **Washing Machine** | `WM_ECOWASH_FL8_INV` / `WM_FL8_INV` | TATWA ECOWASH FL8 INV AI (`TE-WM-FL801-INV`) | "Washing machine 1", "Front load washer", "EcoWash 8 kg", "8 kg front load", "AI steam washer", "1400 RPM washer" | ₹27,490 (MRP ₹38,990) |
| **Washing Machine** | `WM_HYDROPULSE_TL75_SMT` / `WM_TL75_SMT` | TATWA HYDROPULSE TL75 SMART (`TE-WM-TL751-SMT`) | "Washing machine 2", "Top load washer", "HydroPulse 7.5 kg", "7.5 kg top load", "Smart inverter washer" | ₹17,990 (MRP ₹24,990) |
| **Washing Machine** | `WM_AEROCARE_WD10_AI` / `WM_WD10_AI` | TATWA AEROCARE WD10 AI COMBO (`TE-WM-WD101-COMBO`) | "Washing machine 3", "Washer dryer combo", "10 kg washer dryer", "100% dry washer", "AeroCare combo" | ₹44,990 (MRP ₹59,990) |
| **Washing Machine** | `WM_AQUASPIN_SA65_TT` / `WM_SA65_TT` | TATWA AQUASPIN SA65 TT (`TE-WM-SA651-TT`) | "Washing machine 4", "Semi automatic washing machine", "Twin tub washer", "AquaSpin 6.5 kg", "Budget washing machine" | ₹9,990 (MRP ₹14,490) |
| **Smart TV** | `TV_VISION_55_QLED` / `TV_55_QLED` | TATWA VISION 55 QLED 4K (`TE-TV-551-QLED`) | "TV 1", "55 inch TV", "55 inch QLED", "Vision Pro 55", "QLED TV", "551-QLED", "120Hz TV" | ₹36,990 (MRP ₹54,990) |
| **Smart TV** | `TV_CRYSTALVIEW_65_OLED` / `TV_65_OLED` | TATWA CRYSTALVIEW 65 OLED PRO (`TE-TV-651-OLED`) | "TV 2", "65 inch TV", "65 inch OLED", "CrystalView 65", "OLED TV", "Cinema OLED", "651-OLED", "144Hz gaming TV" | ₹99,990 (MRP ₹1,49,990) |
| **Smart TV** | `TV_NOVA_43_UHD` / `TV_43_UHD` | TATWA NOVA 43 4K UHD SMART (`TE-TV-431-UHD`) | "TV 3", "43 inch TV", "Nova 43", "Frameless 4K TV", "431-UHD", "TV under 25000", "Affordable 4K TV" | ₹21,990 (MRP ₹32,990) |

---

## 4. Key Improvements Implemented in the Resolution Engine

1. **Fixed False-Positive Comparison Trigger on "TVs"**:
   - *Previous Defect*: `lowerText.includes('vs')` checked for substring `"vs"`, causing every mention of the word `"TVs"` or `"tvs"` to falsely trigger comparison mode instead of the TV showcase.
   - *Resolution*: Replaced with word-boundary regex `/\b(compare|comparison|comparing|versus|vs)\b/i`.
2. **Fixed "comparison" Noun Misclassification**:
   - *Previous Defect*: Queries like `"comparison between the TV's"` only checked for `"compare"`, failing to match `"comparison"` and falling back to product list view.
   - *Resolution*: Added full regex support for `comparison`, `comparing`, `difference`, `diff`, `तुलना`, `कंपेयर`, `अंतर`, and `फर्क`.
3. **Fixed Dishwasher vs Washing Machine Category Conflict**:
   - *Previous Defect*: `"dishwasher"` contains the substring `"washer"`. Because washing machine category detection checked `lowerText.includes('washer')` first, queries asking for dishwashers were falsely routed to washing machines.
   - *Resolution*: Ordered `dishwasher` detection before `washing_machine`, and added word boundaries to `/\b(washer|washers|washing)\b/i`.
4. **Enhanced Natural Language Model Pair Extraction for Comparisons**:
   - When a user says *"Compare TV 1 and TV 2"* without passing explicit enum parameters, the engine automatically extracts the specific models (`TV_55_QLED` and `TV_65_OLED`) and displays a clean 2-column comparison matrix instead of comparing all models.
5. **Contextual Comparison Titles**:
   - Comparison matrix titles now dynamically reflect the compared category: *"Tatwa Smart TVs Comparison"*, *"Tatwa Washing Machines Comparison"*, *"Tatwa Chimneys Comparison"*, etc.

---

## 5. Completed New Implementations (From Recommendations)

All four requested enhancement capabilities are now **FULLY IMPLEMENTED, TESTED, AND DEPLOYED**:

### A. Extended Vernacular Voice Triggers (Tamil, Kannada, Telugu) - ✅ IMPLEMENTED
- **Tamil**: `"தொலைக்காட்சி"` / `"டிவி"` (TV), `"சிம்னி"` (Chimney), `"துணி துவைக்கும் இயந்திரம்"` (Washing Machine), `"பாத்திரம் கழுவும் இயந்திரம்"` (Dishwasher).
- **Kannada**: `"ದೂರದರ್ಶನ"` / `"ಟಿವಿ"` (TV), `"ಚಿಮಣಿ"` (Chimney), `"ತೊಳೆಯುವ ಯಂತ್ರ"` (Washing Machine).
- **Telugu**: `"టెలివిజన్"` / `"టీవీ"` (TV), `"చిమ్నీ"` (Chimney), `"వాషింగ్ మెషిన్"` (Washing Machine).

### B. Cross-Category Smart Appliance Bundles Screen (`componentType: "bundle"`) - ✅ IMPLEMENTED
- Curated 3 multi-category appliance combo suites with combined pricing and discounts up to 36%:
  1. **Kitchen Suite Combo**: Aero 60 Chimney + FBID 14S Dishwasher (`₹79,990`, Save ₹23,490) + Free Dual Installation + Dishwasher Starter Pack.
  2. **Smart Home Living & Laundry Duo**: Vision Pro 55" QLED + EcoWash 8kg Front Load (`₹59,990`, Save ₹34,000) + Free Swivel Mount + Anti-Vibration Stand.
  3. **Cinema & Luxury Suite**: CrystalView 65" OLED + AeroCare 10kg Washer-Dryer Combo (`₹1,34,990`, Save ₹75,000) + Free Heavy-Duty Mount + 5-Year Protection.
- Rendered via `renderBundleScreen()` with interactive dual-appliance cards, plus (+) connectors, savings badges, and VIP privileges list.

### C. Pan-India Pin Code Serviceability & Installation Estimator Screen (`componentType: "serviceability"`) - ✅ IMPLEMENTED
- Dynamic 6-digit pin code and city recognition covering Bangalore (`560001`), Mumbai (`400001`), Delhi NCR (`110001`), Chennai (`600001`), Hyderabad (`500001`), Kolkata (`700001`), and Pan-India fallback.
- Returns technician visit SLA (Within 24 Hours / 24-48 Hours), delivery mode, 6 free standard installation inclusions, and 1800-TATWA-CARE toll-free helpline.
- Rendered via `renderServiceabilityScreen()` with live status indicator, 4-step certified installation blueprint, inclusions checklist, and metro hub dispatch badges.

### D. Direct Spec Filter Intents - ✅ IMPLEMENTED
- **Dishwasher Capacity**: "14 place", "12 place", "8 place" $\rightarrow$ filters matching models.
- **Washing Machine Specs**: "1400 RPM", "steam wash", "washer dryer combo" $\rightarrow$ filters matching laundry units.
- **TV Specs**: "144Hz", "120Hz", "OLED", "QLED" $\rightarrow$ filters display technologies.

---

*Authored by Tatwa Electronics AI Engineering Team • Synced with Live Worker Backend & 26-Test Automated Suite*
