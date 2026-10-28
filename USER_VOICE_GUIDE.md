# 🎙️ Tatwa Electronics — Master Voice Agent & Visualizer Handover Guide (`USER_VOICE_GUIDE.md`)
> **Showroom Sales, Voice Training & Interactive Visualizer Handover Specification**  
> *Authoritative bridge connecting Customer Voice Utterances $\rightarrow$ AI Spoken Dialogue (TTS) $\rightarrow$ Tool Calls $\rightarrow$ Real-time Visualizer Screens.*

---

## 📑 Table of Contents
1. [Architectural Overview & Spoken-to-Visual Synchronicity](#1-architectural-overview--spoken-to-visual-synchronicity)
2. [Voice-Safe Pronunciation & Dialogue Quality Rules](#2-voice-safe-pronunciation--dialogue-quality-rules)
3. [Master Visual Screens Directory (Every Visual Screen In-Depth)](#3-master-visual-screens-directory)
   - [Screen 01: Flagship Studio Home (`welcome`)](#screen-01-flagship-studio-home-welcome)
   - [Screen 02: Smart TVs Showcase (`products` / `category: tv`)](#screen-02-smart-tvs-showcase-products--category-tv)
   - [Screen 03: Washing Machines Showcase (`products` / `category: washing_machine`)](#screen-03-washing-machines-showcase-products--category-washing_machine)
   - [Screen 04: Aero BLDC Chimneys Showcase (`products` / `category: chimney`)](#screen-04-aero-bldc-chimneys-showcase-products--category-chimney)
   - [Screen 05: PureWash Dishwashers Showcase (`products` / `category: dishwasher`)](#screen-05-purewash-dishwashers-showcase-products--category-dishwasher)
   - [Screen 06: Single Product Spotlight (`products` / `display_mode: single`)](#screen-06-single-product-spotlight-products--display_mode-single)
   - [Screen 07: Smart TVs Comparison Matrix (`comparison` / `category: tv`)](#screen-07-smart-tvs-comparison-matrix-comparison--category-tv)
   - [Screen 08: Dual TV Matchup (`comparison` / 2 Models)](#screen-08-dual-tv-matchup-comparison--2-models)
   - [Screen 09: Washing Machines Comparison Matrix (`comparison` / `category: washing_machine`)](#screen-09-washing-machines-comparison-matrix-comparison--category-washing_machine)
   - [Screen 10: Kitchen Chimneys Comparison Matrix (`comparison` / `category: chimney`)](#screen-10-kitchen-chimneys-comparison-matrix-comparison--category-chimney)
   - [Screen 11: Dishwashers Comparison Matrix (`comparison` / `category: dishwasher`)](#screen-11-dishwashers-comparison-matrix-comparison--category-dishwasher)
   - [Screen 12: Cross-Category Flagships Matrix (`comparison` / `category: flagship`)](#screen-12-cross-category-flagships-matrix-comparison--category-flagship)
   - [Screen 13: Chimney 1500 m³/hr Suction & BLDC Motor Deep Dive (`bldc-motor` / TC-29)](#screen-13-chimney-1500-m³hr-suction--bldc-motor-deep-dive-bldc-motor--tc-29)
   - [Screen 14: Washing Machine Family Size Suitability Guide (`wm-family-guide` / TC-30)](#screen-14-washing-machine-family-size-suitability-guide-wm-family-guide--tc-30)
   - [Screen 15: Dishwasher Place Settings Difference & Indian Cookware Guide (`dishwasher-place-settings-guide` / TC-31)](#screen-15-dishwasher-place-settings-difference--indian-cookware-guide-dishwasher-place-settings-guide--tc-31)
   - [Screen 16: Chimney Installation Blueprint (`chimney-installation` / TC-09)](#screen-16-chimney-installation-blueprint-chimney-installation--tc-09)
   - [Screen 17: Heat Auto-Clean Visual Guide (`chimney-cleaning`)](#screen-17-heat-auto-clean-visual-guide-chimney-cleaning)
   - [Screen 18: Touch & Wave Gesture Controls Guide (`chimney-controls`)](#screen-18-touch--wave-gesture-controls-guide-chimney-controls)
   - [Screen 19: Smart Fabric & Program Guide (`washing-machine-guide` / TC-10)](#screen-19-smart-fabric--program-guide-washing-machine-guide--tc-10)
   - [Screen 20: Cinema Display & Audio Calibration Guide (`tv-display-guide` / TC-11)](#screen-20-cinema-display--audio-calibration-guide-tv-display-guide--tc-11)
   - [Screen 21: Indian Utensil Rack Loading Guide (`dishwasher-loading`)](#screen-21-indian-utensil-rack-loading-guide-dishwasher-loading)
   - [Screen 22: Salt Softener & Hygiene Care Guide (`dishwasher-cleaning`)](#screen-22-salt-softener--hygiene-care-guide-dishwasher-cleaning)
   - [Screen 23: PureWash Innovations & USPs (`dishwasher-usp`)](#screen-23-purewash-innovations--usps-dishwasher-usp)
   - [Screen 24: User Manual & Troubleshooting Master (`manual`)](#screen-24-user-manual--troubleshooting-master-manual)
   - [Screen 25: Promotional Deals Showcase (`offers`)](#screen-25-promotional-deals-showcase-offers)
   - [Screen 26: Smart Appliance Bundles & Combo Suites (`bundle` / TC-25)](#screen-26-smart-appliance-bundles--combo-suites-bundle--tc-25)
   - [Screen 27: Pan-India Pin Code Serviceability & Installation Estimator (`serviceability` / TC-26)](#screen-27-pan-india-pin-code-serviceability--installation-estimator-serviceability--tc-26)
4. [Showroom Verbal Aliases & Numbered Shortcuts Reference](#4-showroom-verbal-aliases--numbered-shortcuts-reference)
5. [Multilingual Conversational Protocol (Hindi, Tamil, Kannada, Telugu)](#5-multilingual-conversational-protocol)
6. [Showroom Training & Demonstration Best Practices](#6-showroom-training--demonstration-best-practices)

---

## 1. Architectural Overview & Spoken-to-Visual Synchronicity

The Tatwa Electronics experience pairs an **intelligent conversational voice agent** (powered by Oration AI & LLM backend) with a **real-time visual display screen** (Tatwa Flagship Studio Visualizer).

```
  [ Customer / Sales Executive Speaks ]
                   │
                   ▼
  [ Oration AI Speech Recognition (ASR) ]
                   │
                   ▼
  [ Webhook Dispatch: POST /api/tool ]
                   │
                   ▼
  [ Fuzzy Intent & Entity Resolution Engine (catalog.js) ]
         ┌─────────┴─────────┐
         ▼                   ▼
  [ Spoken Voice Script ]  [ Visualizer JSON Payload ]
  (Delivered via TTS)      (Sent via SSE: /api/stream/:sessionId)
         │                   │
         ▼                   ▼
  [ Customer Hears Audio ] [ Customer Sees Screen Update ]
```

### The Gold Standard of Spoken-to-Visual Synchronicity:
1. **Visual Anchor Callout**: The voice agent must never talk in isolation. It should explicitly guide the customer's eyes to the screen:
   * *English*: *"As you can see on the screen on your right..."*, *"Notice the side-by-side comparison table..."*, *"I have pulled up the detailed guide right here..."*
   * *Hindi*: *"जैसा कि आप दाईं ओर स्क्रीन पर देख सकते हैं..."*, *"मैंने आपके लिए स्क्रीन पर कम्पेरिज़न टेबल खोल दी है..."*, *"स्क्रीन पर दिए गए चार मॉडल्स को देखिए..."*
2. **Concise Turn-by-Turn Cadence**: Deliver 2 to 4 punchy, consultative sentences. Never recite raw bullet lists or long spec sheets.
3. **Comprehension Check Pause**: Always conclude with a natural question or verification (*"Shall we explore this model further?"*, *"क्या यह अंतर स्पष्ट है?"*), then **STOP and wait** for the user's reply.

---

## 2. Voice-Safe Pronunciation & Dialogue Quality Rules

To ensure speech synthesis (TTS) sounds natural, premium, and human, all dialogue scripts must adhere strictly to these voice rules:

| Rule Category | ❌ NEVER Say / Write for TTS | ✅ ALWAYS Say / Write for TTS | Explanation |
|---|---|---|---|
| **Airflow Suction** | `1500 m³/hr`, `1500 m3/hr`, `1500 m cube per hour` | `1500 cubic meters per hour` | Text-to-speech engines mispronounce `m³/hr` as "m cube slash h r". |
| **Dimensions** | `845 × 598 × 600 mm`, `845x598x600` | `845 by 598 by 600 millimeters` | Never pronounce `×` as "times" or "into". |
| **SKUs / Model Codes** | `TATWA AERO BLDC HC SC FL BK 60`, `TE-DW-141-INT` | `Tatwa Aero BLDC 60 centimeter` or `Tatwa PureWash Built-in 14 Place` | Model SKUs sound like robotic jargon. Use friendly commercial nicknames. |
| **Pricing** | `Rs. 21330`, `INR 21,330/-` | `21,330 rupees` or `₹21,330` | Speak currency naturally in Indian Rupees. |
| **Numbering** | `Point 1: 3D Spray, Point 2: Dual Zone` | `First, ... and second, ...` | Avoid reading dry numbered outlines. |
| **Punctuation & Pauses** | Rushed sentences without commas | Natural commas `,` and ellipses `...` | Punctuation guides TTS breathing pauses. |

---

## 3. Master Visual Screens Directory

Below is the comprehensive specification for all visual screens supported in the Tatwa Flagship Studio.

---

### Screen 01: Flagship Studio Home (`welcome`)
* **Screen Trigger Utterances**:
  * English: *"Welcome"*, *"Home screen"*, *"Go back to start"*, *"Show main menu"*, *"Tatwa home"*
  * Hindi / Hinglish: *"होम स्क्रीन दिखाओ"*, *"शुरू से शुरू करो"*, *"मेन पेज पर जाओ"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Welcome to Tatwa Electronics Flagship Studio! Here on your screen, you can explore our complete smart appliance collection, including Aero BLDC kitchen chimneys, PureWash dishwashers, EcoWash inverter washing machines, and Cinema OLED televisions. What would you like to explore first?"
  * **Hindi**:
    > "तत्वा इलेक्ट्रॉनिक्स के फ्लैगशिप स्टूडियो में आपका स्वागत है! जैसा कि आप स्क्रीन पर देख सकते हैं, हमारे पास Aero BLDC किचन चिमनी, PureWash डिशवॉशर, EcoWash इन्वर्टर वाशिंग मशीन और सिनेमा OLED स्मार्ट टीवी की पूरी रेंज मौजूद है। आप किस अप्लायंस के बारे में जानना चाहेंगे?"
* **Visual Screen Layout**:
  * 4 interactive luxury category cards with ambient backlight glow: Chimneys, Dishwashers, Washing Machines, and Smart TVs.
  * Mascot badge with "Tap or Speak to Explore" CTA prompt.

---

### Screen 02: Smart TVs Showcase (`products` / `category: tv`)
* **Screen Trigger Utterances**:
  * English: *"Show me the TVs"*, *"Smart TVs"*, *"What televisions do you have?"*, *"TV collection"*
  * Hindi / Hinglish: *"टीवी दिखाओ"*, *"Tatwa ke TV dikhao"*, *"स्मार्ट टीवी की रेंज क्या है"*
  * Regional: Tamil: *"டிவி காட்டுங்கள்"*, Telugu: *"టీవీలు చూపించండి"*, Kannada: *"ಟಿವಿ ತೋರಿಸಿ"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here is our Tatwa Smart TV collection on your screen. We offer three flagship options: the Nova 43-inch 4K Frameless TV at 21,990 rupees, our best-selling Vision Pro 55-inch Quantum Dot QLED at 36,990 rupees, and the ultimate CrystalView 65-inch Cinema OLED with 144Hz refresh rate at 99,990 rupees. Would you like to compare their display technologies or look into a specific screen size?"
  * **Hindi**:
    > "स्क्रीन पर हमारी Tatwa स्मार्ट टीवी रेंज प्रस्तुत है। इसमें तीन बेहतरीन विकल्प हैं: Nova 43 inch 4K frameless टीवी 21,990 रुपये में, सबसे लोकप्रिय Vision Pro 55 inch QLED टीवी 36,990 रुपये में, और 144Hz रिफ्रेश रेट वाला फ्लैगशिप CrystalView 65 inch OLED टीवी 99,990 रुपये में। क्या आप इनके डिस्प्ले फीचर्स कम्पेयर करना चाहेंगे या किसी मॉडल की डिटेल देखना चाहते हैं?"
* **Visual Screen Layout**:
  * 3 product cards displaying screen sizes (43", 55", 65"), Display Tech pills (Frameless UHD, Quantum QLED, Self-lit OLED), 120Hz/144Hz badges, Dolby Atmos tags, MRP strikethrough, and savings badges.

---

### Screen 03: Washing Machines Showcase (`products` / `category: washing_machine`)
* **Screen Trigger Utterances**:
  * English: *"Show me washing machines"*, *"Washers"*, *"What washing machines do you have?"*
  * Hindi / Hinglish: *"वाशिंग मशीन दिखाओ"*, *"कपड़े धोने की मशीन बताओ"*, *"Washing machines dikhao"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "On your screen is Tatwa's complete laundry lineup across four distinct tiers. Starting with our AquaSpin 6.5kg twin tub at 9,990 rupees, our HydroPulse 7.5kg smart top load at 17,990 rupees, our EcoWash 8kg Inverter front load with AI Steam at 27,490 rupees, and our flagship AeroCare 10kg washer-dryer combo that delivers 100% dry clothes at 44,990 rupees. Which type fits your family's daily laundry routine?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa वाशिंग मशीनों की पूरी रेंज प्रदर्शित है। हमारे पास चार प्रमुख ऑप्शन्स हैं: AquaSpin 6.5 kg ट्विन टब सिर्फ 9,990 रुपये में, HydroPulse 7.5 kg टॉप लोड 17,990 रुपये में, 90 डिग्री स्टीम वॉश वाली EcoWash 8 kg फ्रंट लोड 27,490 रुपये में, और 100% सूखे कपड़े देने वाला AeroCare 10 kg वॉशर-ड्रायर कॉम्बो 44,990 रुपये में। आपके परिवार के हिसाब से कौन सा मॉडल सही रहेगा?"
* **Visual Screen Layout**:
  * 4 product cards: 6.5kg Semi-Auto, 7.5kg Smart Top Load, 8.0kg Front Load Direct Drive, 10kg AI Washer-Dryer Combo. Displays spin speeds (1400 vs 780 RPM), BEE 5-Star badges, and 10–12 year motor warranties.

---

### Screen 04: Aero BLDC Chimneys Showcase (`products` / `category: chimney`)
* **Screen Trigger Utterances**:
  * English: *"Show me chimneys"*, *"Aero BLDC chimneys"*, *"Kitchen hoods"*, *"What chimneys do you sell?"*
  * Hindi / Hinglish: *"चिमनी दिखाओ"*, *"Tatwa ki chimney dikhao"*, *"किचन चिमनी रेंज"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Take a look at the screen for Tatwa's Aero BLDC kitchen chimney series. All three models feature a heavy-duty 1500 cubic meters per hour suction capacity, thermal Heat Auto-Clean, and wave gesture controls with a 12-year motor warranty. They are available in 60 centimeter at 21,330 rupees, 75 centimeter at 23,118 rupees, and 90 centimeter at 24,987 rupees. How many burners does your kitchen cooktop have?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa की Aero BLDC किचन चिमनी सीरीज मौजूद है। इन तीनों मॉडल्स में 1500 cubic meters per hour की शक्तिशाली सक्शन क्षमता, थर्मल Heat Auto-Clean, वेव जेस्चर कंट्रोल और 12 साल की मोटर वारंटी दी गई है। यह 60 centimeter में 21,330 रुपये, 75 centimeter में 23,118 रुपये, और 90 centimeter में 24,987 रुपये में उपलब्ध हैं। आपके गैस स्टोव में कितने बर्नर हैं?"
* **Visual Screen Layout**:
  * 3 premium cooker hood cards (60cm, 75cm, 90cm) with 1500 m³/hr badge, 150W BLDC motor tag, 9-speed wave gesture icon, and oil collector indicator.

---

### Screen 05: PureWash Dishwashers Showcase (`products` / `category: dishwasher`)
* **Screen Trigger Utterances**:
  * English: *"Show dishwashers"*, *"PureWash dishwashers"*, *"What dishwashers do you have?"*
  * Hindi / Hinglish: *"डिशवॉशर दिखाओ"*, *"बर्तन धोने की मशीन बताओ"*, *"Dishwasher collection"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "On your screen is our comprehensive PureWash dishwasher range comprising 10 specialized models across three capacity sizes: 8-place compact tabletop units starting at 26,750 rupees, 12-place freestanding models starting at 29,999 rupees, and 14-place family models equipped with 3D Triple Spray Arms and 70°C Intensive Hygiene. Would you like to see how place settings match your household size, or compare built-in versus freestanding designs?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa की PureWash डिशवॉशर रेंज प्रदर्शित है, जिसमें 10 मॉडल्स शामिल हैं। इनमें 8 place tabletop यूनिट्स 26,750 रुपये से, 12 place मॉडल्स 29,999 रुपये से, और भारी भारतीय बर्तनों के लिए 14 place मॉडल्स 30,200 रुपये से लेकर 63,901 रुपये तक उपलब्ध हैं। क्या आप जानना चाहेंगे कि आपके परिवार के लिए कितने place settings का डिशवॉशर सही रहेगा?"
* **Visual Screen Layout**:
  * 10 dishwasher cards categorized by capacity (8S, 12S, 14S) and installation type (Built-in FBID, Semi-integrated FSID, Freestanding FFSD Inox/Black, Tabletop Ace Inox/Black).

---

### Screen 06: Single Product Spotlight (`products` / `display_mode: single`)
* **Screen Trigger Utterances**:
  * English: *"Tell me about TV 1"*, *"Vision Pro 55 inch"*, *"Chimney 1 details"*, *"Dishwasher 1 price"*
  * Hindi / Hinglish: *"पहला टीवी दिखाओ"*, *"60 सेंटीमीटर चिमनी की डिटेल बताओ"*, *"EcoWash 8kg के बारे में बताओ"*
* **Spoken AI Voice Agent Script (Example: Vision Pro 55" QLED)**:
  * **English**:
    > "Spotlighted on your screen is the Tatwa Vision Pro 55-inch 4K QLED TV. It delivers over 1 billion vibrant colors with Quantum Dot technology, 120Hz MEMC motion smoothing, Dolby Vision IQ, and a built-in 40-Watt Dolby Atmos soundbar with woofer. It is priced at 36,990 rupees, giving you a flat savings of 18,000 rupees off the MRP. Would you like me to demonstrate its display settings or compare it with the 65-inch OLED?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa Vision Pro 55 inch 4K QLED टीवी की पूरी डिटेल है। इसमें Quantum Dot तकनीक से 1 बिलियन से ज्यादा कलर्स, 120Hz मोशन स्मूथिंग, Dolby Vision IQ और 40W का Dolby Atmos साउंडबार दिया गया है। इसकी कीमत 36,990 रुपये है, जिस पर MRP से पूरे 18,000 रुपये की छूट है। क्या आप इसकी डिस्प्ले सेटिंग्स देखना चाहेंगे या इसे 65 inch OLED से कम्पेयर करें?"
* **Visual Screen Layout**:
  * Hero product imagery, large discount callout pill, detailed feature pills, full technical specification matrix, warranty badge, and "Add to Bundle" action button.

---

### Screen 07: Smart TVs Comparison Matrix (`comparison` / `category: tv`)
* **Screen Trigger Utterances**:
  * English: *"Compare TVs"*, *"What is the difference between the TVs?"*, *"QLED vs OLED vs UHD"*
  * Hindi / Hinglish: *"टीवी में क्या फर्क है"*, *"तीनों टीवी कम्पेयर करो"*, *"TV comparison"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "I have opened the side-by-side comparison matrix for all three Tatwa Smart TVs on your screen. As you can see, the Nova 43-inch provides excellent 4K value at 21,990 rupees, the Vision Pro 55-inch steps up to 1000-nit Quantum QLED color and 120Hz MEMC at 36,990 rupees, while our CrystalView 65-inch OLED offers self-lit infinite contrast and 144Hz gaming refresh rate for the ultimate cinema experience. Which screen size fits your living room wall?"
  * **Hindi**:
    > "मैंने आपके लिए स्क्रीन पर तीनों Tatwa स्मार्ट टीवी की कम्पेरिज़न टेबल खोल दी है। जैसा कि आप देख सकते हैं, Nova 43 inch शानदार 4K वैल्यू देता है 21,990 रुपये में, Vision Pro 55 inch में ब्राइट Quantum QLED डिस्प्ले और 120Hz रिफ्रेश रेट मिलता है 36,990 रुपये में, जबकि 65 inch CrystalView OLED में 144Hz गेमिंग और परफेक्ट ब्लैक कलर्स मिलते हैं। आपकी दीवार के लिए कौन सा साइज बेहतर रहेगा?"
* **Visual Screen Layout**:
  * 3-column technical comparison table covering: Screen Tech, Resolution, Refresh Rate, HDR Formats, Audio Output, Operating System, Connectivity (HDMI 2.1 eARC), Price, and Comprehensive Warranty.

---

### Screen 08: Dual TV Matchup (`comparison` / 2 Models)
* **Screen Trigger Utterances**:
  * English: *"Compare TV 1 and TV 2"*, *"Difference between Vision Pro and CrystalView"*, *"55 inch QLED vs 65 inch OLED"*
  * Hindi / Hinglish: *"पहला और दूसरा टीवी कम्पेयर करो"*, *"QLED और OLED में क्या अंतर है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here is the focused two-model matchup between the Vision Pro 55-inch QLED and the CrystalView 65-inch Cinema OLED on your screen. The 55-inch QLED uses Quantum Dots with high peak brightness perfect for sunlit living rooms at 36,990 rupees. In contrast, the 65-inch OLED uses 8.3 million self-lit pixels for pitch-black cinema viewing and 144Hz native gaming at 99,990 rupees. Shall we look into audio calibration or mounting clearances?"
  * **Hindi**:
    > "स्क्रीन पर 55 inch QLED और 65 inch Cinema OLED के बीच सीधा मुकाबला दिखाया गया है। 55 inch QLED सूरज की रोशनी वाले ब्राइट कमरों के लिए बहुत शानदार है और इसकी कीमत 36,990 रुपये है। वहीं 65 inch OLED में हर एक पिक्सल खुद लाइट देता है, जिससे रात के समय होम थिएटर और 144Hz गेमिंग का बेहतरीन अनुभव मिलता है। क्या आप इसका ऑडियो सेटअप समझना चाहेंगे?"
* **Visual Screen Layout**:
  * 2-column head-to-head comparison highlighting key technical differentiators, price delta, and best-use recommendation tags.

---

### Screen 09: Washing Machines Comparison Matrix (`comparison` / `category: washing_machine`)
* **Screen Trigger Utterances**:
  * English: *"Compare washing machines"*, *"Difference between front load and top load"*, *"Washers comparison"*
  * Hindi / Hinglish: *"वाशिंग मशीन में क्या अंतर है"*, *"फ्रंट लोड और टॉप लोड में क्या फर्क है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Notice the technical comparison matrix on your screen comparing front load, top load, and washer-dryer options. Front load models like the EcoWash 8kg provide superior fabric gentleness and 1400 RPM spin extraction with 90°C Steam sanitization, while top load models like the HydroPulse 7.5kg offer convenient upright loading without bending. If you lack drying space or live in a humid climate, the AeroCare 10kg combo washes and 100% dries in a single drum. Which drum style do you prefer?"
  * **Hindi**:
    > "स्क्रीन पर दी गई कम्पेरिज़न टेबल में फ्रंट लोड, टॉप लोड और वॉशर-ड्रायर का अंतर दिखाया गया है। EcoWash 8 kg फ्रंट लोड 1400 RPM की तेज स्पिन स्पीड और 90 डिग्री AI स्टीम से कपड़ों को सैनिटाइज करती है। वहीं HydroPulse 7.5 kg टॉप लोड बिना झुके आसान लोडिंग की सुविधा देती है। यदि आपके घर में कपड़े सुखाने की जगह कम है, तो AeroCare 10 kg कॉम्बो 100% सुखाकर कपड़े निकालता है। आप कौन सा स्टाइल पसंद करेंगे?"
* **Visual Screen Layout**:
  * Multi-column table comparing: Drum Architecture, Capacity, Motor RPM (1400 vs 780 vs 1350), Wash Programs, Heater/Steam availability, BEE Star Rating, Water Consumption, and Price.

---

### Screen 10: Kitchen Chimneys Comparison Matrix (`comparison` / `category: chimney`)
* **Screen Trigger Utterances**:
  * English: *"Compare chimneys"*, *"Difference between 60cm, 75cm, and 90cm chimney"*, *"Chimney comparison"*
  * Hindi / Hinglish: *"चिमनी कम्पेयर करो"*, *"60, 75 और 90 सेंटीमीटर चिमनी में क्या फर्क है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here is the side-by-side comparison of our three Aero BLDC chimneys on your screen. All three models deliver the exact same 1500 cubic meters per hour suction power, whisper-quiet 44 to 46 decibel noise level, and Heat Auto-Clean. The only decision you need to make is the canopy width: 60 centimeter is ideal for 2 to 4 burner stoves at 21,330 rupees, 75 centimeter for 3 to 4 burner stoves at 23,118 rupees, and 90 centimeter covers wide 3 to 5 burner hobs at 24,987 rupees. How wide is your kitchen cooking hob?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa की तीनों Aero BLDC चिमनियों की तुलना प्रस्तुत है। तीनों मॉडल्स में समान 1500 cubic meters per hour की सक्शन क्षमता, शांत 44 से 46 डेसिबल का साउंड और Heat Auto-Clean मिलता है। मुख्य अंतर सिर्फ चौड़ाई का है: 2 से 4 बर्नर चूल्हे के लिए 60 centimeter (21,330 रुपये), 3 से 4 बर्नर के लिए 75 centimeter (23,118 रुपये), और चौड़े 3 से 5 बर्नर के लिए 90 centimeter (24,987 रुपये) सही रहता है। आपके किचन प्लेटफॉर्म का साइज क्या है?"
* **Visual Screen Layout**:
  * 3-column table: Cooktop Stove Match (2–4 vs 3–4 vs 3–5 burners), Dimensions (W × D × H), Suction Power (1500 m³/hr across all), Motor Wattage (150W), Noise Range (44–46 dB), and Price.

---

### Screen 11: Dishwashers Comparison Matrix (`comparison` / `category: dishwasher`)
* **Screen Trigger Utterances**:
  * English: *"Compare dishwashers"*, *"What is the difference between built-in and freestanding dishwasher?"*
  * Hindi / Hinglish: *"डिशवॉशर में क्या फर्क है"*, *"बिल्ट-इन और फ्रीस्टैंडिंग में क्या अंतर है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "I have pulled up the dishwasher comparison matrix on your screen. Built-in models like the FBID 14-place are fully concealed behind modular kitchen cabinetry with hidden door controls at 63,901 rupees. Freestanding models like the FFSD 14-place Inox at 52,170 rupees can be placed anywhere next to your sink without kitchen woodwork. If you have a compact kitchen, our Ace tabletop units sit directly on the countertop at 26,750 rupees. Which installation format fits your kitchen layout?"
  * **Hindi**:
    > "स्क्रीन पर डिशवॉशर्स की कम्पेरिज़न टेबल खोल दी गई है। Built-in मॉडल जैसे FBID 14 place पूरी तरह से किचन कैबिनेट के अंदर छिप जाता है और इसके कंट्रोल्स दरवाजे के ऊपर होते हैं (63,901 रुपये)। Freestanding मॉडल जैसे Inox 14 place (52,170 रुपये) बिना किसी फर्नीचर मॉडिफिकेशन के सीधे सिंक के पास लग जाता है। यदि किचन में जगह कम है, तो हमारा Ace tabletop डिशवॉशर सीधे काउंटरटॉप पर रखा जा सकता है (26,750 रुपये)। आपके किचन के लिए कौन सा मॉडल उपयुक्त है?"
* **Visual Screen Layout**:
  * Matrix comparing: Installation Class (Built-in vs Semi-integrated vs Freestanding vs Tabletop), Place Settings (14S vs 12S vs 8S), Wash Zones, Wash Programs, Cutlery Tray type, Noise Level, and Price.

---

### Screen 12: Cross-Category Flagships Matrix (`comparison` / `category: flagship`)
* **Screen Trigger Utterances**:
  * English: *"Compare flagship appliances"*, *"Show top models across categories"*, *"Best appliances"*
  * Hindi / Hinglish: *"सभी के टॉप मॉडल दिखाओ"*, *"फ्लैगशिप अप्लायंसेज कम्पेयर करो"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Displayed on your screen is our luxury cross-category flagship showcase, featuring the highest-spec model from each Tatwa category: the Aero 90 BLDC chimney with 1500 cubic meters per hour suction, the PureWash FBID 14-place integrated dishwasher, the AeroCare 10kg washer-dryer combo, and the CrystalView 65-inch Cinema OLED. All four feature our longest manufacturer warranties. Would you like to explore bundle savings on these flagships?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa के चारों कैटेगरीज के टॉप फ्लैगशिप मॉडल्स एक साथ प्रस्तुत हैं: 1500 cubic meters per hour सक्शन वाली Aero 90 BLDC चिमनी, 14 place Built-in डिशवॉशर, 100% सुखाने वाली AeroCare 10 kg वाशिंग मशीन, और 65 inch CrystalView Cinema OLED टीवी। इन सभी पर हमारी सबसे लंबी वारंटी उपलब्ध है। क्या आप इन पर कॉम्बो बंडल डिस्काउंट देखना चाहेंगे?"
* **Visual Screen Layout**:
  * 4-card marquee featuring the top appliance from each product category with signature engineering USPs and maximum promotional discount tags.

---

### Screen 13: Chimney 1500 m³/hr Suction & BLDC Motor Deep Dive (`bldc-motor` / TC-29)
* **Screen Trigger Utterances**:
  * English: *"BLDC motor"*, *"Suction capacity"*, *"1500 m3/hr suction"*, *"Tell me about the chimney motor"*
  * Hindi / Hinglish: *"1500 सक्शन क्षमता क्या है"*, *"BLDC मोटर के बारे में बताओ"*, *"चिमनी की मोटर कैसे काम करती है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "As shown in the video and airflow schematic on your screen, all Tatwa Aero chimneys are driven by a 150-Watt Brushless DC Inverter Motor delivering 1500 cubic meters per hour of high-velocity airflow. This means it evacuates dense smoke and heavy masala tadka fumes from your kitchen in seconds while operating at an ultra-quiet 44 to 46 decibels. Best of all, the motor consumes up to 50% less electricity and is backed by a 12-year warranty. Is this suction power clear, or shall we look at Heat Auto-Clean next?"
  * **Hindi**:
    > "जैसा कि आप स्क्रीन पर दिए गए वीडियो और एयरफ्लो डायग्राम में देख सकते हैं, Tatwa Aero चिमनियों में 150 Watt की Brushless DC Inverter मोटर लगी है जो 1500 cubic meters per hour का हाई-वेलोसिटी सक्शन देती है। यह भारी तड़के और तेल के धुएं को कुछ ही सेकंड में किचन से बाहर निकाल देती है, वह भी सिर्फ 44 से 46 डेसिबल की शांत आवाज में। यह 50% तक बिजली बचाती है और इस पर पूरे 12 साल की मोटर वारंटी है। क्या यह सक्शन क्षमता स्पष्ट है, या आगे Heat Auto-Clean को समझें?"
* **Visual Screen Layout**:
  * Video player rendering `bldc_motor.mp4`, 1500 m³/hr airflow animation, 150W low power draw badge, 44–46 dB quiet sound indicator, and 12-Year Motor Warranty seal.

---

### Screen 14: Washing Machine Family Size Suitability Guide (`wm-family-guide` / TC-30)
* **Screen Trigger Utterances**:
  * English: *"Which washing machine for which family?"*, *"Family size guide"*, *"Washing machine capacity guide"*, *"Washing machine for 4 members"*
  * Hindi / Hinglish: *"किस फैमिली के लिए कौन सी वाशिंग मशीन सही है"*, *"4 सदस्यों के परिवार के लिए कौन सी मशीन लें"*, *"Family guide washing machine"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here on your screen is our official Family Size Suitability Guide matching drum capacity and motor type to your household size. For couples or 2 to 3 members, our 6.5kg AquaSpin at 9,990 rupees handles daily loads easily. For a standard family of 3 to 4 members, our 7.5kg HydroPulse smart top load at 17,990 rupees handles 14 to 16 daily garments. For 4 to 5 members with daily heavy laundry, we recommend our 8kg EcoWash front load with 90°C Steam at 27,490 rupees. And for large families of 5 to 8 members, our 10kg AeroCare washer-dryer at 44,990 rupees washes and 100% dries heavy duvets and curtains. How many members are in your family?"
  * **Hindi**:
    > "स्क्रीन पर हमारा आधिकारिक Family Size Guide दिया गया है, जो परिवार के सदस्यों के अनुसार सही क्षमता बताता है। 2 से 3 सदस्यों के लिए हमारी 6.5 kg AquaSpin (9,990 रुपये) रोज के कपड़ों के लिए बेहतरीन है। 3 से 4 सदस्यों के सामान्य परिवार के लिए 7.5 kg HydroPulse टॉप लोड (17,990 रुपये) 14 से 16 कपड़े आसानी से धोती है। 4 से 5 सदस्यों के भारी कपड़ों के लिए हम 8 kg EcoWash फ्रंट लोड (27,490 रुपये) रेकमेंड करते हैं जिसमें 90 डिग्री स्टीम वॉश है। और 5 से 8 सदस्यों के बड़े संयुक्त परिवार के लिए हमारी 10 kg AeroCare (44,990 रुपये) भारी चादरें और पर्दे धोकर 100% सुखा देती है। आपके परिवार में कितने सदस्य हैं?"
* **Visual Screen Layout**:
  * 4 interactive household tier cards (2–3 Members / 6.5kg, 3–4 Members / 7.5kg, 4–5 Members / 8.0kg, 5–8+ Members / 10kg Combo) showing daily garment capacity examples, bedsheet/duvet fit, motor RPM, and direct buy links.

---

### Screen 15: Dishwasher Place Settings Difference & Indian Cookware Guide (`dishwasher-place-settings-guide` / TC-31)
* **Screen Trigger Utterances**:
  * English: *"What is the difference between place settings?"*, *"8 place vs 12 place vs 14 place"*, *"Can kadai fit in dishwasher?"*, *"Dishwasher plate setting difference"*
  * Hindi / Hinglish: *"डिशवॉशर में 8, 12 और 14 प्लेस सेटिंग में क्या अंतर है"*, *"क्या कढ़ाई डिशवॉशर में धुल सकती है"*, *"Place settings difference"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Notice the Place Settings Comparison Guide on your screen. An 8-place setting tabletop unit holds 64 to 72 utensils and fits directly on your countertop, ideal for 1 to 3 members. A 12-place setting freestanding unit holds around 100 utensils, accommodating daily plates plus two medium kadai for a family of 4 to 5 members. For heavy Indian cooking, our 14-place setting models accommodate over 120 utensils, including 5-liter pressure cookers, large patilas, and 14 thalis, with Dual Zone wash and 3D Triple Spray Arms. Which cookware do you use most frequently?"
  * **Hindi**:
    > "स्क्रीन पर प्लेस सेटिंग्स कम्पेरिज़न गाइड को देखिए। 8 place tabletop यूनिट 64 से 72 बर्तन संभालती है और सीधे काउंटरटॉप पर आ जाती है, जो 1 से 3 लोगों के लिए बेस्ट है। 12 place freestanding यूनिट लगभग 100 बर्तन और दो मध्यम कढ़ाई धो सकती है, जो 4 से 5 सदस्यों के लिए उपयुक्त है। और भारतीय भारी कुकिंग के लिए हमारा 14 place मॉडल 120 से ज्यादा बर्तन धो सकता है—जिसमें 5 लीटर का प्रेशर कुकर, गहरे पतीले और 14 बड़ी थालियां आसानी से आ जाती हैं। आप अपने घर में रोजाना किस तरह के बर्तन ज्यादा इस्तेमाल करते हैं?"
* **Visual Screen Layout**:
  * 3 capacity tier cards (8S Ace Tabletop, 12S Neo Freestanding, 14S PureWash Heavy Cookware) showing utensil counts (64 vs 100 vs 120+), cookware fit diagrams (Kadai, 5L Cooker, Thalis), dimensions, and salt softener hard water care advice.

---

### Screen 16: Chimney Installation Blueprint (`chimney-installation` / TC-09)
* **Screen Trigger Utterances**:
  * English: *"Chimney installation"*, *"How to install chimney?"*, *"What is the duct size for chimney?"*, *"Installation steps"*
  * Hindi / Hinglish: *"चिमनी कैसे लगाएं"*, *"चिमनी इंस्टालेशन के स्टेप्स क्या हैं"*, *"पाइप का साइज क्या होना चाहिए"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here is our official Chimney Installation Blueprint on your screen. Installation requires four critical steps: First, maintaining a vertical clearance of 65 to 75 centimeters above your gas cooktop. Second, anchoring the heavy-duty mounting bracket into solid masonry. Third, mounting the hood securely. And fourth, connecting a 150-millimeter or 6-inch rigid exhaust duct with minimal bends to ensure maximum 1500 cubic meters per hour airflow. Our certified technicians handle this entire process for you. Would you like to check installation serviceability for your pin code?"
  * **Hindi**:
    > "स्क्रीन पर हमारी आधिकारिक चिमनी इंस्टालेशन गाइड दी गई है। इसमें चार मुख्य बातें ध्यान रखनी होती हैं: पहला, गैस चूल्हे से चिमनी की ऊंचाई 65 से 75 सेंटीमीटर होनी चाहिए। दूसरा, दीवार पर ब्रैकेट को मजबूती से फिक्स करना। तीसरा, चिमनी हुड को हैंग करना। और चौथा, 150 मिलीमीटर यानी 6 इंच का डक्ट पाइप लगाना ताकि 1500 cubic meters per hour का पूरा सक्शन मिले। हमारे सर्टिफाइड टेक्नीशियन यह सारा काम आपके लिए करते हैं। क्या आप अपने एरिया का पिनकोड चेक करना चाहेंगे?"
* **Visual Screen Layout**:
  * Technical blueprint diagram illustrating wall clearance (65–75 cm), bracket mounting holes, 150mm duct exhaust outlet, and anti-vibration damping pads.

---

### Screen 17: Heat Auto-Clean Visual Guide (`chimney-cleaning`)
* **Screen Trigger Utterances**:
  * English: *"Heat auto clean"*, *"How does auto clean work?"*, *"How to clean chimney"*, *"Oil collector cleaning"*
  * Hindi / Hinglish: *"ऑटो क्लीन कैसे काम करता है"*, *"चिमनी की सफाई कैसे होती है"*, *"तेल का डिब्बा कैसे साफ करें"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Take a look at the Auto-Clean breakdown on your screen. With one touch, the internal thermal heating element heats up for 9 minutes, melting stubborn oily grease and ghee residues accumulated on the motor housing. Then, the high-speed centrifugal fan runs for 1 minute, flushing the liquefied oil directly into the removable stainless steel oil collector tray at the bottom. You simply slide out the metal tray, empty the oil, rinse with soapy water, and slide it back in. Shall we see the touch and gesture controls next?"
  * **Hindi**:
    > "स्क्रीन पर Heat Auto-Clean की पूरी प्रक्रिया समझाई गई है। सिर्फ एक टच दबाने पर, 9 मिनट तक हीटिंग कॉइल गर्म होकर मोटर के अंदर जमे तेल और घी को पिघला देती है। इसके बाद 1 मिनट तक ब्लोअर फैन तेजी से घूमकर पिघले हुए तेल को नीचे लगे स्टेनलेस स्टील ऑयल कलेक्टर में इकट्ठा कर देता है। आपको बस उस ट्रे को बाहर निकालकर धोना होता है। क्या अब हम जेस्चर कंट्रोल के बारे में जानें?"
* **Visual Screen Layout**:
  * 4-step auto-clean diagram: Step 1 Touch/Gesture Trigger, Step 2 9-Min Thermal Heating, Step 3 1-Min Blower Flush, Step 4 Detachable Stainless Steel Oil Collector slide-out demo.

---

### Screen 18: Touch & Wave Gesture Controls Guide (`chimney-controls`)
* **Screen Trigger Utterances**:
  * English: *"Wave gesture"*, *"Gesture controls"*, *"How to operate chimney without touching?"*
  * Hindi / Hinglish: *"हाथ हिलाकर चिमनी कैसे चलाएं"*, *"जेस्चर कंट्रोल कैसे काम करता है"*, *"Gesture controls"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "On your screen is our Wave Gesture Control guide. Built into the black tempered glass panel are dual optical motion sensors. Waving your hand smoothly from left to right turns the chimney on at Speed 1, and repeated waves step up the speed all the way to Speed 9 for intense frying. To reduce speed or turn it off, simply wave from right to left. This keeps the glass panel completely fingerprint and grease-free while cooking. Is this gesture operation clear?"
  * **Hindi**:
    > "स्क्रीन पर वेव जेस्चर कंट्रोल का तरीका दिखाया गया है। चिमनी के ब्लैक टेम्पर्ड ग्लास पर दो ऑप्टिकल मोशन सेंसर लगे हैं। जब आप बाएं से दाएं हाथ हिलाते हैं, तो चिमनी ऑन हो जाती है और स्पीड 1 से 9 तक बढ़ती है। स्पीड कम करने या बंद करने के लिए दाएं से बाएं हाथ हिलाना होता है। इससे खाना बनाते समय गीले या चिकने हाथों से चिमनी को छूना नहीं पड़ता। क्या यह जेस्चर कंट्रोल समझ आ गया?"
* **Visual Screen Layout**:
  * Sensor interaction animation showing hand wave directions (Left-to-Right = ON/Speed Up 1–9, Right-to-Left = Speed Down/OFF), 5–10 cm operating distance callout, and touch panel backup icons.

---

### Screen 19: Smart Fabric & Program Guide (`washing-machine-guide` / TC-10)
* **Screen Trigger Utterances**:
  * English: *"Fabric care guide"*, *"Washing machine guide"*, *"How to use steam wash"*, *"Baby clothes washing"*
  * Hindi / Hinglish: *"स्टीम वॉश कैसे काम करता है"*, *"कपड़ों की देखभाल कैसे करें"*, *"बच्चों के कपड़े कैसे धोएं"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here is our Smart Fabric Care Guide on your screen. The AI Steam Allergy Care cycle heats water up to 90 degrees Celsius, generating penetrating micro-steam that eradicates 99.9% of allergens and bacteria from baby wear and bedding while reducing wrinkles by 30%. For everyday denim and cottons, the Direct Drive motor uses 1400 RPM spin extraction to cut drying time in half. And for gym wear or lightly soiled clothes, the Quick 15-minute refresh saves up to 70% water and power. Would you like to check family capacity sizing next?"
  * **Hindi**:
    > "स्क्रीन पर हमारा स्मार्ट फैब्रिक केयर गाइड दिखाया गया है। इसका AI Steam Allergy Care प्रोग्राम पानी को 90 डिग्री सेल्सियस तक गर्म करके शुद्ध भाप बनाता है, जो बच्चों के कपड़ों और बेडशीट्स से 99.9% बैक्टीरिया और एलर्जी खत्म करता है और सिलवटें भी 30% कम करता है। रोजाना के कॉटन कपड़ों के लिए 1400 RPM की तेज स्पिन कपड़ों को आधा सुखा देती है। वहीं हल्के गंदे कपड़ों के लिए सिर्फ 15 मिनट का क्विक वॉश बिजली और पानी दोनों बचाता है। क्या आप वाशिंग मशीन की फैमिली कैपेसिटी गाइड देखना चाहेंगे?"
* **Visual Screen Layout**:
  * 3 interactive fabric program cards: AI Steam Allergy Care (60°C–90°C), Heavy Cotton 1400 RPM moisture extraction, and Quick 15m daily cycle with detergent dispenser compartment instructions.

---

### Screen 20: Cinema Display & Audio Calibration Guide (`tv-display-guide` / TC-11)
* **Screen Trigger Utterances**:
  * English: *"TV display guide"*, *"QLED vs OLED display guide"*, *"Dolby Atmos audio tuning"*, *"Cinema calibration"*
  * Hindi / Hinglish: *"टीवी डिस्प्ले गाइड दिखाओ"*, *"QLED और OLED में पिक्चर क्वालिटी का क्या अंतर है"*, *"Dolby Atmos साउंड कैसे सेट करें"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "As detailed in the calibration guide on your screen, Quantum Dot QLED delivers over 1000 nits of peak brightness, making colors pop vibrantly even in bright sunlit living rooms. On the other hand, Self-lit OLED controls each pixel individually, achieving absolute pitch blacks and infinite contrast for a true cinema experience in dim rooms. For audio, our TVs feature HDMI 2.1 with eARC, transmitting uncompressed Dolby Atmos directly to external soundbars. Which viewing environment matches your room?"
  * **Hindi**:
    > "स्क्रीन पर टीवी डिस्प्ले और साउंड गाइड प्रस्तुत है। Quantum Dot QLED 1000 nits से ज्यादा ब्राइटनेस देता है, जिससे दिन के उजाले और खिड़कियों वाले कमरों में भी कलर्स बहुत ब्राइट दिखते हैं। दूसरी तरफ, Self-lit OLED का हर पिक्सल खुद बंद हो सकता है, जिससे रात के अंधेरे में बिल्कुल असली ब्लैक कलर्स और सिनेमा जैसा अनुभव मिलता है। साउंड के लिए इसमें eARC HDMI 2.1 पोर्ट है जिससे Dolby Atmos साउंडबार आसानी से कनेक्ट हो जाता है। आपके कमरे में लाइटिंग कैसी रहती है?"
* **Visual Screen Layout**:
  * Split visual comparing Quantum Dot backlight crystal layer (1000+ nits) with Self-lit OLED organic pixel layer (infinite contrast), alongside Dolby Atmos eARC passthrough and dialogue enhancer audio settings.

---

### Screen 21: Indian Utensil Rack Loading Guide (`dishwasher-loading`)
* **Screen Trigger Utterances**:
  * English: *"How to load dishwasher"*, *"Kadai in dishwasher"*, *"Indian utensils in dishwasher"*, *"How to place plates and spoons"*
  * Hindi / Hinglish: *"डिशवॉशर में बर्तन कैसे लगाएं"*, *"कढ़ाई कैसे रखें"*, *"बर्तन लोड करने का तरीका"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Notice the utensil loading diagram on your screen. In the bottom basket, place heavy kadai, patilas, and pressure cookers upside-down at a 45-degree angle so high-pressure water sprays inside and drains freely without collecting dirty pools. In the upper basket, place katoris, tea cups, and glasses tilted downwards. Place spoons and forks in the cutlery tray with handles alternating. Finally, always give the spray arms a quick manual spin before starting to ensure tall spatulas don't obstruct rotation. Shall we see how salt prevents hard water stains?"
  * **Hindi**:
    > "स्क्रीन पर बर्तन जमाने का सही तरीका देखिए। नीचे वाली बास्केट में भारी कढ़ाई, पतीले और प्रेशर कुकर को उल्टा 45 डिग्री के कोण पर रखें, ताकि पानी अंदर तक जाए और गंदा पानी जमा न हो। ऊपर वाली बास्केट में कटोरी, चाय के कप और ग्लास उल्टे रखें। चम्मच और कांटे कटलरी ट्रे में लगाएं। मशीन चालू करने से पहले एक बार दोनों स्प्रे आर्म्स को हाथ से घुमाकर देख लें कि कोई करछुल या प्लेट उनसे टकरा तो नहीं रही। क्या आप देखना चाहेंगे कि नमक से पानी के दाग कैसे रुकते हैं?"
* **Visual Screen Layout**:
  * 3-tier loading infographic: Lower Rack (Kadai, Patila, Cooker at 45° angle), Upper Rack (Katoris, Glasses, Cups), Cutlery Tray (Alternating handles), plus Critical Checkpoints (Spray arm clearance, food scraping).

---

### Screen 22: Salt Softener & Hygiene Care Guide (`dishwasher-cleaning`)
* **Screen Trigger Utterances**:
  * English: *"Dishwasher salt"*, *"Rinse aid"*, *"Hard water care"*, *"Dishwasher cleaning"*
  * Hindi / Hinglish: *"डिशवॉशर में नमक कैसे डालें"*, *"खारे पानी से बर्तन कैसे बचाएं"*, *"Rinse aid क्या होता है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "On your screen is our Hard Water & Salt Softener guide. In Indian cities with hard borewell or municipal water, minerals cause cloudy white scale on steel utensils. Refilling special dishwasher salt in the bottom chamber ionizes the water, neutralizing calcium and magnesium. Adding liquid rinse aid ensures water sheets off glasses for spotless, droplet-free drying. Lastly, simply rinse the 3-stage mesh filter under tap water once a week to maintain peak washing pressure. Would you like to see our PureWash innovations next?"
  * **Hindi**:
    > "स्क्रीन पर खारे पानी और डिशवॉशर साल्ट की गाइड दी गई है। भारत में बोरवेल या हार्ड पानी की वजह से बर्तनों पर सफेद दाग पड़ जाते हैं। मशीन के नीचे बने चेंबर में स्पेशल डिशवॉशर साल्ट डालने से पानी मीठा हो जाता है और स्केल नहीं जमता। Rinse aid डालने से बर्तनों पर पानी की बूंदें नहीं रुकतीं और वे बिल्कुल चमकते हुए सूखते हैं। हफ्ते में एक बार नीचे लगी 3-स्टेज जाली को नल के नीचे धोना काफी होता है। क्या अब हम PureWash की खास तकनीक देखें?"
* **Visual Screen Layout**:
  * Cutaway diagram showing: Bottom Water Softening Chamber salt funnel, Rinse Aid dosage dial, 3-Stage Micro-Mesh Filter cleaning, and Anti-Limescale before/after steel glass comparison.

---

### Screen 23: PureWash Innovations & USPs (`dishwasher-usp`)
* **Screen Trigger Utterances**:
  * English: *"Dishwasher features"*, *"Why Tatwa dishwasher?"*, *"3D spray wash"*, *"70 degree sanitization"*
  * Hindi / Hinglish: *"Tatwa डिशवॉशर की क्या खासियत है"*, *"3D स्प्रे क्या है"*, *"70 डिग्री वाश क्या होता है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Here are the four signature engineering innovations of Tatwa PureWash on your screen. First, 3D Triple Spray Arms with high-pressure rotational jets that penetrate oily masala grease. Second, Dual Zone Wash allowing you to run only the upper or lower rack when you have fewer dishes. Third, 70°C Intensive Hygiene Sterilization that dissolves burnt tadka while eliminating 99.9% of kitchen germs. And fourth, spacious 14-place capacity built specifically for Indian thalis and pressure cookers. Shall we compare models or look at bundled pricing?"
  * **Hindi**:
    > "स्क्रीन पर Tatwa PureWash की चार मुख्य विशेषताएं दिखाई गई हैं। पहला, 3D ट्रिपल स्प्रे आर्म्स जो गहरे तेल और मसाले को पूरी ताकत से साफ करते हैं। दूसरा, Dual Zone Wash जिससे कम बर्तन होने पर आप सिर्फ ऊपर या नीचे की रैक चलाकर पानी बचा सकते हैं। तीसरा, 70 डिग्री सेल्सियस का गर्म पानी जो जले हुए बर्तनों को साफ कर 99.9% कीटाणु मारता है। और चौथा, भारतीय थालियों और 5 लीटर कुकर के लिए 14 place की बड़ी क्षमता। क्या आप मॉडल्स की कम्पेरिज़न देखना चाहेंगे?"
* **Visual Screen Layout**:
  * 4 interactive feature cards with high-definition diagrams: 3D Triple Spray Arms, Dual Zone Independent Wash, 70°C Intensive Hygiene Sterilization, and 14-Place Indian Capacity.

---

### Screen 24: User Manual & Troubleshooting Master (`manual`)
* **Screen Trigger Utterances**:
  * English: *"User manual"*, *"Maintenance guide"*, *"Troubleshooting FAQ"*, *"Why is chimney making noise?"*
  * Hindi / Hinglish: *"मैनुअल दिखाओ"*, *"मेंटेनेंस गाइड"*, *"चिमनी से आवाज क्यों आ रही है"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "I have opened the Tatwa Master User Manual & Troubleshooting Guide on your screen. It includes detailed operating procedures for Chimney Heat Auto-Clean, gesture sensor calibration, and step-by-step troubleshooting solutions for common questions like duct noise prevention, hard water scale elimination, and optimal 4K Google TV picture settings. Is there a specific appliance you need troubleshooting assistance with?"
  * **Hindi**:
    > "मैंने स्क्रीन पर Tatwa मास्टर यूजर मैनुअल और मेंटेनेंस गाइड खोल दी है। इसमें चिमनी के Heat Auto-Clean, जेस्चर सेंसर की सेटिंग्स, और सामान्य समस्याओं के समाधान दिए गए हैं—जैसे चिमनी के पाइप की आवाज ठीक करना, बर्तनों पर सफेद दाग हटाना, और टीवी की पिक्चर सेटिंग्स। क्या आपको किसी खास अप्लायंस के बारे में जानकारी चाहिए?"
* **Visual Screen Layout**:
  * Multi-tabbed maintenance dashboard: Tab 1 Chimney Auto-Clean Procedure, Tab 2 Wave Gesture Calibration, Tab 3 Filterless Care Rules, Tab 4 Master Troubleshooting FAQ with expandable accordions.

---

### Screen 25: Promotional Deals Showcase (`offers`)
* **Screen Trigger Utterances**:
  * English: *"Show offers"*, *"Best discounts"*, *"Deals"*, *"Promotions"*
  * Hindi / Hinglish: *"ऑफर क्या हैं"*, *"सबसे ज्यादा डिस्काउंट किस पर है"*, *"बेस्ट डील्स दिखाओ"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Take a look at today's top promotional deals on your screen, with direct savings of up to 75,000 rupees. Featured offers include 34% off on the Aero 60 BLDC chimney at 21,330 rupees, 34% off on our PureWash Eco Black 14-place dishwasher at 30,200 rupees, and a massive 50,000 rupee discount on the CrystalView 65-inch Cinema OLED at 99,990 rupees. Would you like to check out combo bundle packages for additional savings?"
  * **Hindi**:
    > "स्क्रीन पर आज के बेस्ट प्रमोशनल ऑफर्स दिखाए गए हैं, जिन पर 75,000 रुपये तक की सीधी बचत हो रही है। इनमें Aero 60 BLDC चिमनी पर 34% छूट के साथ 21,330 रुपये, Eco Black 14 place डिशवॉशर पर 34% छूट के साथ 30,200 रुपये, और 65 inch OLED टीवी पर पूरे 50,000 रुपये की भारी छूट उपलब्ध है। क्या आप और ज्यादा बचत के लिए कॉम्बो बंडल पैकेज देखना चाहेंगे?"
* **Visual Screen Layout**:
  * Filtered grid displaying all discounted models sorted by percentage discount with vibrant discount pills (`36% OFF`, `SAVE ₹50,000`), original MRP strikethrough, and limited-time offer badges.

---

### Screen 26: Smart Appliance Bundles & Combo Suites (`bundle` / TC-25)
* **Screen Trigger Utterances**:
  * English: *"Smart appliance bundles"*, *"Kitchen suite combo"*, *"Show bundles"*, *"Combo packages"*
  * Hindi / Hinglish: *"कॉम्बो पैकेज दिखाओ"*, *"किचन बंडल में क्या है"*, *"बंडल ऑफर्स"*
* **Spoken AI Voice Agent Script**:
  * **English**:
    > "Notice our three curated Smart Appliance Suites on your screen with combined savings of up to 36% plus complimentary VIP installation. Our Smart Chef Kitchen Suite pairs the Aero 60 chimney and FBID 14-place dishwasher for 79,990 rupees, saving 23,490 rupees. Our Living & Laundry Duo pairs the 55-inch QLED TV and 8kg Front Load washer for 59,990 rupees, saving 34,000 rupees. And our Cinema Luxury Suite pairs the 65-inch OLED and 10kg washer-dryer combo for 1,34,990 rupees, saving 75,000 rupees. Which suite fits your home renovation plans?"
  * **Hindi**:
    > "स्क्रीन पर हमारे तीन विशेष स्मार्ट अप्लायंस बंडल्स दिखाए गए हैं, जिन पर 36% तक की बचत और फ्री VIP इंस्टालेशन मिल रही है। Smart Chef Kitchen Suite में Aero 60 चिमनी और 14 place Built-in डिशवॉशर सिर्फ 79,990 रुपये में मिलता है (23,490 रुपये की बचत)। Living & Laundry Duo में 55 inch QLED टीवी और 8 kg फ्रंट लोड वाशिंग मशीन 59,990 रुपये में उपलब्ध है (34,000 रुपये की बचत)। और Cinema Luxury Suite में 65 inch OLED टीवी और 10 kg वॉशर-ड्रायर कॉम्बो पर पूरे 75,000 रुपये की छूट है। आपके घर के लिए कौन सा कॉम्बो सही रहेगा?"
* **Visual Screen Layout**:
  * 3 luxury bundle cards with dual-product imagery connected by a central `+` connector, total bundle price, combined MRP, total savings callout badge, and VIP privileges checklist (Free dual installation, accessories, and priority concierge).

---

### Screen 27: Pan-India Pin Code Serviceability & Installation Estimator (`serviceability` / TC-26)
* **Screen Trigger Utterances**:
  * English: *"Can you deliver and install in 560001?"*, *"Pincode 110001"*, *"Installation in Bangalore"*, *"Delivery charges"*
  * Hindi / Hinglish: *"पिनकोड 560001 में डिलीवरी होगी क्या"*, *"बैंगलोर में इंस्टालेशन का समय क्या है"*, *"पिनकोड चेक करो"*
* **Spoken AI Voice Agent Script (Example: Bangalore 560001)**:
  * **English**:
    > "Good news! As shown on your screen, PIN code 560001 in Bangalore is in our express coverage hub. We provide express delivery with a certified technician visit within 24 hours. Your service includes free unboxing, site inspection, standard wall mounting, duct or water connection, and an in-person product demo with instant digital warranty activation. We also provide our toll-free customer helpline, 1800-TATWA-CARE, active seven days a week. Would you like to proceed with booking or check another PIN code?"
  * **Hindi**:
    > "अच्छी खबर है! स्क्रीन पर देख सकते हैं कि बैंगलोर का पिनकोड 560001 हमारे एक्सप्रेस सर्विस जोन में आता है। यहां 24 घंटे के अंदर हमारे सर्टिफाइड टेक्नीशियन आपके घर पहुंचकर इंस्टालेशन पूरा करते हैं। इसमें अनबॉक्सिंग, साइट इंस्पेक्शन, वॉल माउंटिंग, पाइप फिटिंग और लाइव डेमो पूरी तरह फ्री शामिल है। साथ ही हफ्ते के सातों दिन हमारा टोल-फ्री हेल्पलाइन 1800-TATWA-CARE उपलब्ध रहता है। क्या आप कोई अन्य पिनकोड चेक करना चाहेंगे?"
* **Visual Screen Layout**:
  * Live status pill (`Verified Express Coverage`), 24-hr SLA turnaround timer, 4-step certified installation flow, 6 free standard inclusions checklist, and 1800-TATWA-CARE contact badge.

---

## 4. Showroom Verbal Aliases & Numbered Shortcuts Reference

To allow rapid showroom demonstrations, sales staff and customers can call any appliance by its friendly verbal number, nickname, or dimension:

| Product Model & SKU | Canonical Enum Key | Voice Fast-Track Nicknames & Aliases | Showroom Display Price |
|---|---|---|---|
| **TATWA AERO BLDC 60** (`TE-CH-601-BLDC`) | `CHIMNEY_AERO_BLDC_60` | *"Chimney 1"*, *"Aero 60"*, *"60cm chimney"*, *"Small chimney"*, *"600mm hood"* | ₹21,330 |
| **TATWA AERO BLDC 75** (`TE-CH-751-BLDC`) | `CHIMNEY_AERO_BLDC_75` | *"Chimney 2"*, *"Aero 75"*, *"75cm chimney"*, *"Medium chimney"*, *"750mm hood"* | ₹23,118 |
| **TATWA AERO BLDC 90** (`TE-CH-901-BLDC`) | `CHIMNEY_AERO_BLDC_90` | *"Chimney 3"*, *"Aero 90"*, *"90cm chimney"*, *"Wide canopy chimney"*, *"900mm hood"* | ₹24,987 |
| **TATWA FBID 14S INT** (`TE-DW-141-INT`) | `DW_FBID_8PR_14S` | *"Dishwasher 1"*, *"Built-in dishwasher"*, *"Integrated dishwasher"*, *"Concealed dishwasher"* | ₹63,901 |
| **TATWA FSID 14S SEMI** (`TE-DW-142-SEMI`) | `DW_FSID_8PR_14S` | *"Dishwasher 2"*, *"Semi-integrated dishwasher"*, *"Front panel dishwasher"* | ₹58,617 |
| **TATWA FFSD 14S INOX** (`TE-DW-143-FS`) | `DW_FFSD_8PR_14S_INOX` | *"Dishwasher 3"*, *"Freestanding Inox"*, *"Stainless steel 14 place"*, *"Inox dishwasher"* | ₹52,170 |
| **TATWA FFSD 14S BK** (`TE-DW-144-BK`) | `DW_FFSD_8PR_14S_BK` | *"Dishwasher 4"*, *"Freestanding black"*, *"Obsidian black 14 place"* | ₹51,964 |
| **TATWA FFSD 7PR 14S ECO** (`TE-DW-145-ECO`) | `DW_FFSD_7PR_14S_BK` | *"Dishwasher 5"*, *"Eco black dishwasher"*, *"7 program dishwasher"*, *"Best value 14S"* | ₹30,200 |
| **TATWA FFSD 6PR 14S DIGI** (`TE-DW-146-DIG`) | `DW_FFSD_6PR_14S_BK_DIGITAL` | *"Dishwasher 6"*, *"Black digital dishwasher"*, *"Screen display dishwasher"* | ₹35,010 |
| **TATWA FFSD 12S NEO INOX** (`TE-DW-121-INOX`) | `DW_FFSD_6PR_12S_NEO_INOX` | *"Dishwasher 7"*, *"12 place Inox"*, *"Neo Inox dishwasher"* | ₹34,250 |
| **TATWA FFSD 12S NEO BK** (`TE-DW-122-BK`) | `DW_FFSD_6PR_12S_NEO_BK` | *"Dishwasher 8"*, *"12 place black"*, *"Dishwasher under 30000"*, *"₹29,999 dishwasher"* | ₹29,999 |
| **TATWA FFSD 8S ACE INOX** (`TE-DW-081-CPT`) | `DW_FFSD_6PR_8S_ACE_INOX` | *"Dishwasher 9"*, *"Ace Inox compact"*, *"8 place tabletop Inox"*, *"Tabletop dishwasher"* | ₹28,150 |
| **TATWA FFSD 8S ACE BK** (`TE-DW-082-CPT`) | `DW_FFSD_6PR_8S_ACE_BLACK` | *"Dishwasher 10"*, *"Ace black compact"*, *"Cheapest dishwasher"*, *"Smallest dishwasher"* | ₹26,750 |
| **TATWA ECOWASH FL8 INV** (`TE-WM-FL801-INV`) | `WM_ECOWASH_FL8_INV` | *"Washing machine 1"*, *"Front load washer"*, *"EcoWash 8kg"*, *"8kg front load"*, *"1400 RPM"* | ₹27,490 |
| **TATWA HYDROPULSE TL75** (`TE-WM-TL751-SMT`) | `WM_HYDROPULSE_TL75_SMT` | *"Washing machine 2"*, *"Top load washer"*, *"HydroPulse 7.5kg"*, *"7.5kg top load"* | ₹17,990 |
| **TATWA AEROCARE WD10 AI** (`TE-WM-WD101-COMBO`)| `WM_AEROCARE_WD10_AI` | *"Washing machine 3"*, *"Washer dryer combo"*, *"100% dry washer"*, *"10kg combo"* | ₹44,990 |
| **TATWA AQUASPIN SA65 TT** (`TE-WM-SA651-TT`) | `WM_AQUASPIN_SA65_TT` | *"Washing machine 4"*, *"Semi-automatic"*, *"Twin tub washer"*, *"Under 10000 washer"* | ₹9,990 |
| **TATWA VISION PRO 55 QLED** (`TE-TV-551-QLED`) | `TV_VISION_55_QLED` | *"TV 1"*, *"55 inch TV"*, *"Vision Pro 55"*, *"55 inch QLED"*, *"120Hz TV"* | ₹36,990 |
| **TATWA CRYSTALVIEW 65 OLED** (`TE-TV-651-OLED`)| `TV_CRYSTALVIEW_65_OLED` | *"TV 2"*, *"65 inch TV"*, *"CrystalView 65"*, *"65 inch OLED"*, *"144Hz gaming TV"* | ₹99,990 |
| **TATWA NOVA 43 UHD** (`TE-TV-431-UHD`) | `TV_NOVA_43_UHD` | *"TV 3"*, *"43 inch TV"*, *"Nova 43"*, *"Frameless 4K TV"*, *"TV under 25000"* | ₹21,990 |

---

## 5. Multilingual Conversational Protocol

The Tatwa AI Voice Assistant is fully trained to converse fluently in **English, Hindi, Tamil, Kannada, and Telugu**.

### Linguistic Rules:
1. **Script Rule**: Write Indian vernacular words in their native script (`தமிழ்`, `ಕನ್ನಡ`, `తెలుగు`, `देवनागरी`), while keeping technical terms, model names, units, and numbers in **Latin script** (e.g. `1500 cubic meters per hour`, `BLDC motor`, `14 place settings`, `QLED`).
2. **Colloquial Register**: Use natural spoken words rather than archaic formal vocabulary. Keep words like `kitchen`, `customer`, `warranty`, `price`, `motor`, and `service` in Latin script.
3. **Mid-Call Language Persistence**: Lock into the language selected by the customer. Do not flip back to English simply because the customer sprinkles in English words. Switch languages only upon explicit instruction.

---

## 6. Showroom Training & Demonstration Best Practices

1. **Lead with Value, Anchor with Visuals**:
   Always pair your vocal answer with a visual demonstration on the screen. Let the visual screen do the heavy lifting for technical numbers while you explain the customer benefit.
2. **Practical Indian Cooking Context**:
   * *Chimneys*: Relate 1500 m³/hr suction to deep tadka, mustard seeds, and fish/chicken frying.
   * *Dishwashers*: Demonstrate that steel kadai, oily ghee patilas, and 5L pressure cookers fit comfortably in the lower basket.
   * *Washing Machines*: Highlight that AI Steam at 90°C eliminates dust mites and sanitizes school uniforms and infant garments.
   * *Smart TVs*: Emphasize that Quantum Dot 1000-nit high brightness prevents screen washout in sunny living rooms.
3. **The 3-Second Rule**:
   Every visual screen update completes in under 300 milliseconds. Keep vocal speech seamless so the customer experiences instantaneous, lag-free responsiveness.

---

*Authored by Tatwa Electronics AI Engineering Team • Synced with Oration AI Voice Engine, Worker Webhook & Visualizer Screen Suite*
