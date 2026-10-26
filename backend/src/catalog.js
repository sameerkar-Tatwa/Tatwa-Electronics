/**
 * ============================================================================
 * TATWA ELECTRONICS - PRODUCT CATALOG & COMPONENT ENGINE (PURE JAVASCRIPT)
 * ============================================================================
 *
 * Fully supports 20 official Tatwa Electronics appliances across 4 categories:
 * - 3 Aero BLDC Chimneys (60 cm, 75 cm, 90 cm)
 * - 10 PureWash Dishwashers (Built-in, Semi-integrated, Freestanding, Compact Tabletop)
 * - 4 Smart Washing Machines (Front Load Inverter, Top Load, Washer-Dryer Combo, Semi-Automatic)
 * - 3 Ultra HD Smart TVs (55" QLED, 65" Cinema OLED, 43" Frameless 4K)
 *
 * Rich Components supported:
 * 1. "products"          : Luxury product cards with specs, pricing, MRP strikethrough, discount pill
 * 2. "comparison"        : Side-by-side spec comparison matrix (2-4 appliances)
 * 3. "offers"            : Filtered / sorted best promotional deals showcase
 * 4. "dishwasher-loading": Step-by-step utensil loading infographic & rules
 * 5. "manual"            : Heat Auto-Clean procedure (9m heat + 1m fan) & Maintenance guide
 * 6. "chimney-installation": 4-step wall mount & duct installation blueprint
 * 7. "washing-machine-guide": Fabric care, AI steam cycles & wash guide
 * 8. "tv-display-guide"  : QLED vs OLED display guide & picture mode setup
 */

// ============================================================================
// 1. FULL 20-PRODUCT CATALOG FOR TATWA ELECTRONICS
// ============================================================================
export const TATWA_PRODUCT_CATALOG = {
  // --------------------------------------------------------------------------
  // CHIMNEYS / KITCHEN HOODS - AERO BLDC SERIES (3 Models)
  // --------------------------------------------------------------------------
  AERO_60: {
    id: 'tatwa-aero-60',
    enumKey: 'AERO_60',
    sequenceOrder: 1,
    name: 'Tatwa Aero BLDC 60 cm',
    modelName: 'TATWA AERO BLDC HC SC FL BK 60',
    sku: 'TE-CH-601-BLDC',
    category: 'chimney',
    categoryLabel: 'Auto-Clean BLDC Chimney',
    type: 'Wall-Mounted Curved Glass Chimney',
    shape: 'Curved Glass',
    colour: 'Black',
    width: '60 cm (600 mm)',
    dimensions: '600 × 418 × 485 mm',
    cooktopMatch: 'Suited for 60 cm Cooktops (2–4 Burners)',
    price: 21330,
    mrp: 32490,
    discountPercent: 34,
    savings: 11160,
    isOffer: true,
    suctionPower: '1500 m³/hr Airflow',
    motor: '150 W BLDC Inverter Motor',
    motorWattage: '150 W',
    noiseLevel: '44–46 dB (Ultra-Quiet)',
    speedLevels: '9 Speed Settings (BLDC Inverter Control)',
    filterDesign: 'Filterless Technology (Easy Maintenance)',
    cleaningFunction: 'Heat Auto Clean (9 min heat + 1 min fan)',
    controls: 'Touch with Wave Gesture Control (9 Speeds)',
    ledLight: '1 × 1.5 W Energy-saving LED',
    finish: 'Black Curved Tempered Glass',
    installation: 'Ducted & Ductless (Recirculating)',
    ventilation: 'Ducted & Ductless (Recirculating)',
    warranty: '2 Years Comprehensive • 12 Years on Motor',
    imageUrl: 'images/chimney_curved_glass.jpg',
    productPageUrl: '#',
    description: 'Compact 60 cm curved glass chimney with 1500 m³/hr suction, 150W BLDC motor, 44–46 dB ultra-quiet sound, 9 speeds, and touch & wave gesture control.',
    highlight: 'Heat Auto Clean • 44–46 dB Quiet • 12-Yr Motor Warranty',
    keyFeatures: ['1500 m³/hr Suction', '150W BLDC Motor', '44–46 dB Ultra-Quiet', '9 Speed Levels', 'Touch & Wave Gesture', '12-Year Motor Warranty']
  },

  AERO_75: {
    id: 'tatwa-aero-75',
    enumKey: 'AERO_75',
    sequenceOrder: 2,
    name: 'Tatwa Aero BLDC 75 cm',
    modelName: 'TATWA AERO BLDC HC SC FL BK 75',
    sku: 'TE-CH-751-BLDC',
    category: 'chimney',
    categoryLabel: 'Auto-Clean BLDC Chimney',
    type: 'Wall-Mounted Curved Glass Chimney',
    shape: 'Curved Glass',
    colour: 'Black',
    width: '75 cm (750 mm)',
    dimensions: '750 × 418 × 490 mm',
    cooktopMatch: 'Suited for 75 cm Cooktops (3–4 Burners)',
    price: 23118,
    mrp: 33990,
    discountPercent: 32,
    savings: 10872,
    isOffer: true,
    suctionPower: '1500 m³/hr Airflow',
    motor: '150 W BLDC Inverter Motor',
    motorWattage: '150 W',
    noiseLevel: '44–46 dB (Ultra-Quiet)',
    speedLevels: '9 Speed Settings (BLDC Inverter Control)',
    filterDesign: 'Filterless Technology (Easy Maintenance)',
    cleaningFunction: 'Heat Auto Clean (9 min heat + 1 min fan)',
    controls: 'Touch with Wave Gesture Control (9 Speeds)',
    ledLight: '1 × 1.5 W Energy-saving LED',
    finish: 'Black Curved Tempered Glass',
    installation: 'Ducted & Ductless (Recirculating)',
    ventilation: 'Ducted & Ductless (Recirculating)',
    warranty: '2 Years Comprehensive • 12 Years on Motor',
    imageUrl: 'images/chimney_angular_luxury.jpg',
    productPageUrl: '#',
    description: 'Mid-size 75 cm curved glass hood ideal for 3-4 burner gas cooktops with 1500 m³/hr airflow, 150W BLDC motor, 44–46 dB quiet sound, and heat auto-clean.',
    highlight: '75 cm Mid-Width • 44–46 dB Quiet • 12-Yr Motor Warranty',
    keyFeatures: ['75 cm Medium Width', '1500 m³/hr Suction', '150W BLDC Motor', '44–46 dB Ultra-Quiet', '9 Speed Levels', '12-Year Motor Warranty']
  },

  AERO_90: {
    id: 'tatwa-aero-90',
    enumKey: 'AERO_90',
    sequenceOrder: 3,
    name: 'Tatwa Aero BLDC 90 cm',
    modelName: 'TATWA AERO BLDC HC SC FL BK 90',
    sku: 'TE-CH-901-BLDC',
    category: 'chimney',
    categoryLabel: 'Auto-Clean BLDC Chimney',
    type: 'Wall-Mounted Curved Glass Chimney',
    shape: 'Curved Glass',
    colour: 'Black',
    width: '90 cm (900 mm)',
    dimensions: '900 × 418 × 490 mm',
    cooktopMatch: 'Suited for 90 cm Cooktops (3–5 Burners)',
    price: 24987,
    mrp: 35490,
    discountPercent: 30,
    savings: 10503,
    isOffer: true,
    suctionPower: '1500 m³/hr Airflow',
    motor: '150 W BLDC Inverter Motor',
    motorWattage: '150 W',
    noiseLevel: '44–46 dB (Ultra-Quiet)',
    speedLevels: '9 Speed Settings (BLDC Inverter Control)',
    filterDesign: 'Filterless Technology (Easy Maintenance)',
    cleaningFunction: 'Heat Auto Clean (9 min heat + 1 min fan)',
    controls: 'Touch with Wave Gesture Control (9 Speeds)',
    ledLight: '1 × 1.5 W Energy-saving LED',
    finish: 'Black Curved Tempered Glass',
    installation: 'Ducted & Ductless (Recirculating)',
    ventilation: 'Ducted & Ductless (Recirculating)',
    warranty: '2 Years Comprehensive • 12 Years on Motor',
    imageUrl: 'images/chimney_curved_glass.jpg',
    productPageUrl: '#',
    description: 'Wide 90 cm canopy hood covering 3-5 burner cooktops with maximum smoke capture, 150W BLDC motor, 44–46 dB sound level, and 12-year motor warranty.',
    highlight: '90 cm Wide Canopy • 44–46 dB Quiet • 12-Yr Motor Warranty',
    keyFeatures: ['90 cm Wide Coverage', '1500 m³/hr Airflow', '150W BLDC Motor', '44–46 dB Ultra-Quiet', '9 Speed Levels', '12-Year Motor Warranty']
  },

  // --------------------------------------------------------------------------
  // DISHWASHERS - PUREWASH SERIES (10 Models)
  // --------------------------------------------------------------------------
  FBID_8PR_14S: {
    id: 'tatwa-fbid-14s',
    enumKey: 'FBID_8PR_14S',
    sequenceOrder: 4,
    name: 'Tatwa PureWash FBID 14S Integrated',
    modelName: 'TATWA FBID 8PR 14S INT',
    sku: 'TE-DW-141-INT',
    category: 'dishwasher',
    categoryLabel: 'Built-in Integrated Dishwasher',
    type: 'Built-in Integrated',
    capacity: '14 Place Settings',
    washProgrammesCount: 8,
    programmes: '8 Programmes: Auto, Intensive, Normal, ECO, Glass, 90 Min, Rapid, Soak',
    price: 63901,
    mrp: 70990,
    discountPercent: 10,
    savings: 7089,
    isOffer: false,
    finish: 'Stainless Steel (Concealed Controls inside Door)',
    controls: 'Concealed Soft Touch & LED Display',
    washZones: 'Dual Zone Wash (Upper & Lower Zone Selection)',
    drying: 'Natural Drying + Extra Drying',
    dimensions: '815 × 598 × 600 mm',
    energyClass: 'A++ (266 kWh/yr)',
    noiseLevel: '44 dB(A)',
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Luxury fully built-in dishwasher concealed in cabinetry with concealed door controls, 14 place settings, and Dual Zone Wash.',
    highlight: 'Fully Built-in • Dual Zone Wash • 14 Place Settings • A++',
    keyFeatures: ['Fully Built-in Seamless', '14 Place Settings', '8 Wash Programs', 'Dual Zone Wash', 'A++ Energy Efficiency']
  },

  FSID_8PR_14S: {
    id: 'tatwa-fsid-14s',
    enumKey: 'FSID_8PR_14S',
    sequenceOrder: 5,
    name: 'Tatwa PureWash FSID 14S Semi-Integrated',
    modelName: 'TATWA FSID 8PR 14S SEMI',
    sku: 'TE-DW-142-SEMI',
    category: 'dishwasher',
    categoryLabel: 'Semi-integrated Dishwasher',
    type: 'Semi-integrated',
    capacity: '14 Place Settings',
    washProgrammesCount: 8,
    programmes: '8 Washing Programmes',
    price: 58617,
    mrp: 65490,
    discountPercent: 10,
    savings: 6873,
    isOffer: false,
    finish: 'Stainless Steel (Visible Front Control Panel)',
    controls: 'Front-facing LED Digital Display',
    drying: 'Natural Drying',
    dimensions: '815 × 598 × 600 mm',
    powerMemory: true,
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_freestanding.jpg',
    productPageUrl: '#',
    description: 'Semi-integrated dishwasher fitted inside cabinetry with convenient front-facing digital control panel and 14 place capacity.',
    highlight: 'Semi-Integrated Front Display • 14 Place Settings • 8 Programs',
    keyFeatures: ['Semi-Integrated Panel', 'Front Visible Controls', '14 Place Capacity', '8 Wash Programs', 'Power Memory']
  },

  FFSD_8PR_14S: {
    id: 'tatwa-ffsd-14s-inox',
    enumKey: 'FFSD_8PR_14S',
    sequenceOrder: 6,
    name: 'Tatwa PureWash FFSD 14S Inox',
    modelName: 'TATWA FFSD 8PR 14S INOX',
    sku: 'TE-DW-143-FS',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Dishwasher',
    type: 'Freestanding',
    capacity: '14 Place Settings',
    washProgrammesCount: 8,
    programmes: '8 Washing Programmes',
    price: 52170,
    mrp: 60490,
    discountPercent: 14,
    savings: 8320,
    isOffer: false,
    finish: 'Stainless Steel / Inox',
    controls: 'LED Display with Push Button',
    drying: 'Natural Drying',
    dimensions: '845 × 598 × 600 mm',
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_freestanding.jpg',
    productPageUrl: '#',
    description: 'Freestanding stainless steel dishwasher with 14 place capacity, flexible racks, and 8 programs for heavy Indian pots and pans.',
    highlight: 'Freestanding Inox • 14 Place Settings • Plug & Play',
    keyFeatures: ['Freestanding Inox Body', '14 Place Settings', '8 Wash Programs', 'Natural Drying', '10-Yr Cavity Warranty']
  },

  FFSD_8PR_14S_BK: {
    id: 'tatwa-ffsd-14s-bk',
    enumKey: 'FFSD_8PR_14S_BK',
    sequenceOrder: 7,
    name: 'Tatwa PureWash FFSD 14S Obsidian Black',
    modelName: 'TATWA FFSD 8PR 14S BK',
    sku: 'TE-DW-144-BK',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Dishwasher',
    type: 'Freestanding',
    capacity: '14 Place Settings',
    washProgrammesCount: 8,
    programmes: '8 Washing Programmes',
    price: 51964,
    mrp: 57990,
    discountPercent: 10,
    savings: 6026,
    isOffer: false,
    finish: 'Obsidian Black',
    controls: 'Push Button with LED Display',
    washZones: 'Dual Zone Wash',
    drying: 'Natural Drying',
    childLock: true,
    powerMemory: true,
    dimensions: '598 × 600 × 845 mm',
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Sleek black freestanding dishwasher with 14 place capacity, Dual Zone Wash, and child lock protection for family kitchens.',
    highlight: 'Sleek Black • Dual Zone Wash • Child Lock • 14 Place Settings',
    keyFeatures: ['Obsidian Black Finish', 'Dual Zone Wash', 'Child Lock Protection', '14 Place Settings', '8 Programs']
  },

  FFSD_7PR_14S_BK: {
    id: 'tatwa-ffsd-7pr-14s-bk',
    enumKey: 'FFSD_7PR_14S_BK',
    sequenceOrder: 8,
    name: 'Tatwa PureWash FFSD 7PR 14S Eco Black',
    modelName: 'TATWA FFSD 7PR 14S BK',
    sku: 'TE-DW-145-ECO',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Dishwasher',
    type: 'Freestanding',
    capacity: '14 Place Settings',
    washProgrammesCount: 7,
    programmes: '7 Washing Programmes',
    price: 30200,
    mrp: 45990,
    discountPercent: 34,
    savings: 15790,
    isOffer: true,
    finish: 'Black',
    controls: 'Push Button',
    loadFunction: 'Half Load Option',
    childLock: true,
    drying: 'Natural Drying',
    dimensions: '598 × 600 × 845 mm',
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Best value 14-place setting black dishwasher with 7 programmes, convenient Half Load function, and ₹15,790 (34%) discount savings.',
    highlight: '★ Best Value (34% Off) • Half Load • 14 Place Settings',
    keyFeatures: ['Best Value (Save ₹15,790)', '14 Place Settings', '7 Wash Programs', 'Half Load Option', 'Child Lock']
  },

  FFSD_6PR_14S_BK_DIGITAL: {
    id: 'tatwa-ffsd-6pr-14s-bk-digi',
    enumKey: 'FFSD_6PR_14S_BK_DIGITAL',
    sequenceOrder: 9,
    name: 'Tatwa PureWash FFSD 6PR 14S Black Digital',
    modelName: 'TATWA FFSD 6PR 14S BK DIGI',
    sku: 'TE-DW-146-DIG',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Digital Dishwasher',
    type: 'Freestanding',
    capacity: '14 Place Settings',
    washProgrammesCount: 6,
    programmes: '6 Washing Programmes',
    price: 35010,
    mrp: 48990,
    discountPercent: 29,
    savings: 13980,
    isOffer: true,
    finish: 'Black',
    controls: 'Electronic Push Button with Digital Display',
    loadFunction: 'Half Load Option',
    drying: 'Natural Drying',
    dimensions: '598 × 600 × 845 mm',
    warranty: '2 Years Comprehensive • 10 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Black digital freestanding dishwasher with intuitive screen, 14 place capacity, and convenient Half Load mode.',
    highlight: 'Digital Screen • 29% Off • Half Load • 14 Place Settings',
    keyFeatures: ['Digital Interface Display', '14 Place Settings', 'Half Load Function', '29% Discount', '10-Yr Cavity Warranty']
  },

  FFSD_6PR_12S_NEO_INOX: {
    id: 'tatwa-ffsd-6pr-12s-inox',
    enumKey: 'FFSD_6PR_12S_NEO_INOX',
    sequenceOrder: 10,
    name: 'Tatwa PureWash FFSD 6PR 12S Neo Inox',
    modelName: 'TATWA FFSD 6PR 12S NEO INOX',
    sku: 'TE-DW-121-INOX',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Dishwasher',
    type: 'Freestanding',
    capacity: '12 Place Settings',
    washProgrammesCount: 6,
    programmes: '6 Washing Programmes',
    price: 34250,
    mrp: 40990,
    discountPercent: 16,
    savings: 6740,
    isOffer: false,
    finish: 'Stainless Steel / Inox',
    controls: 'Electronic Push Button, LED Display',
    loadFunction: 'Half Load Option',
    powerMemory: true,
    drying: 'Natural Drying',
    dimensions: '845 × 598 × 600 mm',
    warranty: '2 Years Comprehensive • 5 Years on Cavity',
    imageUrl: 'images/dishwasher_freestanding.jpg',
    productPageUrl: '#',
    description: 'Medium 12-place setting dishwasher in brushed Inox, suited for nuclear families with Half Load flexibility.',
    highlight: '12 Place Medium Capacity • Stainless Steel • Half Load',
    keyFeatures: ['12 Place Settings', 'Inox Stainless Steel', 'Half Load Mode', 'Power Memory', '6 Programs']
  },

  FFSD_6PR_12S_NEO_BK: {
    id: 'tatwa-ffsd-6pr-12s-bk',
    enumKey: 'FFSD_6PR_12S_NEO_BK',
    sequenceOrder: 11,
    name: 'Tatwa PureWash FFSD 6PR 12S Neo Black',
    modelName: 'TATWA FFSD 6PR 12S NEO BK',
    sku: 'TE-DW-122-BK',
    category: 'dishwasher',
    categoryLabel: 'Freestanding Dishwasher',
    type: 'Freestanding',
    capacity: '12 Place Settings',
    washProgrammesCount: 6,
    programmes: '6 Washing Programmes',
    price: 29999,
    mrp: 37490,
    discountPercent: 20,
    savings: 7491,
    isOffer: true,
    finish: 'Neo Black',
    controls: 'Electronic Push Button, LED Display',
    loadFunction: 'Half Load Option',
    powerMemory: true,
    drying: 'Natural Drying',
    dimensions: '845 × 598 × 600 mm',
    warranty: '2 Years Comprehensive • 5 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Great value 12 place dishwasher in Neo Black under ₹30,000 (₹29,999) with 6 wash programs and half load mode.',
    highlight: 'Under ₹30,000 (₹29,999) • 12 Place Settings • Neo Black',
    keyFeatures: ['Under ₹30k (₹29,999)', '12 Place Settings', 'Neo Black Finish', 'Half Load Option', '5-Yr Cavity Warranty']
  },

  FFSD_6PR_8S_ACE_INOX: {
    id: 'tatwa-ffsd-6pr-8s-inox',
    enumKey: 'FFSD_6PR_8S_ACE_INOX',
    sequenceOrder: 12,
    name: 'Tatwa PureWash FFSD 6PR 8S Ace Inox',
    modelName: 'TATWA FFSD 6PR 8S ACE INOX',
    sku: 'TE-DW-081-CPT',
    category: 'dishwasher',
    categoryLabel: 'Tabletop Compact Dishwasher',
    type: 'Tabletop / Compact',
    capacity: '8 Place Settings',
    washProgrammesCount: 6,
    programmes: '6 Washing Programmes',
    price: 28150,
    mrp: 31990,
    discountPercent: 12,
    savings: 3840,
    isOffer: false,
    finish: 'Inox Finish',
    controls: 'Electronic Push Button, LED Display',
    loadFunction: 'Half Load Option',
    powerMemory: true,
    drying: 'Natural Drying',
    dimensions: '595 × 550 × 500 mm',
    cutoutDimensions: '662 × 605 × 555 mm',
    warranty: '2 Years Comprehensive • 5 Years on Cavity',
    imageUrl: 'images/dishwasher_freestanding.jpg',
    productPageUrl: '#',
    description: 'Compact 8-place tabletop dishwasher in Inox, designed for small kitchens and countertops with 6 wash programs.',
    highlight: 'Tabletop Compact • 8 Place Settings • Fits on Countertop',
    keyFeatures: ['Tabletop Compact Size', '8 Place Settings', 'Inox Finish', 'Half Load Option', 'Power Memory']
  },

  FFSD_6PR_8S_ACE_BLACK: {
    id: 'tatwa-ffsd-6pr-8s-bk',
    enumKey: 'FFSD_6PR_8S_ACE_BLACK',
    sequenceOrder: 13,
    name: 'Tatwa PureWash FFSD 6PR 8S Ace Black',
    modelName: 'TATWA FFSD 6PR 8S ACE BK',
    sku: 'TE-DW-082-CPT',
    category: 'dishwasher',
    categoryLabel: 'Tabletop Compact Dishwasher',
    type: 'Tabletop / Compact',
    capacity: '8 Place Settings',
    washProgrammesCount: 6,
    programmes: '6 Washing Programmes',
    price: 26750,
    mrp: 30490,
    discountPercent: 12,
    savings: 3740,
    isOffer: false,
    finish: 'Black Finish',
    controls: 'Electronic Push Button, LED Display',
    loadFunction: 'Half Load Option',
    powerMemory: true,
    drying: 'Natural Drying',
    dimensions: '595 × 550 × 500 mm',
    warranty: '2 Years Comprehensive • 5 Years on Cavity',
    imageUrl: 'images/dishwasher_integrated.jpg',
    productPageUrl: '#',
    description: 'Most affordable Tatwa compact dishwasher (₹26,750) with 8 place capacity, modern black finish, and countertop placement.',
    highlight: 'Lowest Price (₹26,750) • 8 Place Compact • Black Tabletop',
    keyFeatures: ['Lowest Price Tatwa Dishwasher (₹26,750)', '8 Place Compact Size', 'Black Modern Finish', 'Tabletop Friendly']
  },

  // --------------------------------------------------------------------------
  // WASHING MACHINES - ECOWASH & HYDROPULSE SERIES (4 Models)
  // --------------------------------------------------------------------------
  WM_FL8_INV: {
    id: 'tatwa-wm-fl8-inv',
    enumKey: 'WM_FL8_INV',
    sequenceOrder: 14,
    name: 'Tatwa EcoWash Pro 8 kg Front Load Inverter',
    modelName: 'TATWA ECOWASH FL8 INV AI',
    sku: 'TE-WM-FL801-INV',
    category: 'washing_machine',
    categoryLabel: 'Front Load Inverter Washer',
    type: 'Front Load Fully Automatic',
    capacity: '8.0 kg (Families of 4–5)',
    washProgrammesCount: 14,
    programmes: '14 Programmes: AI Cotton, Steam Allergy Care, Quick 15m, Wool, Tub Clean, Eco 40-60, Duvet',
    price: 27490,
    mrp: 38990,
    discountPercent: 29,
    savings: 11500,
    isOffer: true,
    finish: 'Dark Titanium Graphite',
    controls: 'Digital Rotary Dial + Smart LED Touch Screen',
    motor: 'Direct Drive Inverter BLDC Motor (1400 RPM)',
    motorWattage: '2000 W (Heater Mode)',
    noiseLevel: '52 dB Wash / 68 dB Spin (Silent Inverter)',
    energyRating: '5 Star BEE Rated (Lowest Electricity & Water Consumption)',
    dimensions: '600 × 565 × 850 mm',
    warranty: '3 Years Comprehensive • 10 Years on Motor',
    imageUrl: 'images/wm_front_load_8kg.jpg',
    productPageUrl: '#',
    description: '8 kg front load washer featuring AI Direct Drive, 1400 RPM high spin speed, built-in steam heater for 99.9% allergy care, and ultra-quiet inverter motor.',
    highlight: 'AI Direct Drive • 1400 RPM • Steam Care 99.9% • 5-Star BEE',
    keyFeatures: ['AI Direct Drive Sensor', 'Steam Wash 99.9% Allergen Removal', '1400 RPM High-Speed Spin', '5-Star BEE Efficiency', '10-Year Motor Warranty']
  },

  WM_TL75_SMT: {
    id: 'tatwa-wm-tl75-smt',
    enumKey: 'WM_TL75_SMT',
    sequenceOrder: 15,
    name: 'Tatwa HydroPulse 7.5 kg Top Load Smart Washer',
    modelName: 'TATWA HYDROPULSE TL75 SMART',
    sku: 'TE-WM-TL751-SMT',
    category: 'washing_machine',
    categoryLabel: 'Top Load Fully Automatic Washer',
    type: 'Top Load Fully Automatic',
    capacity: '7.5 kg (Families of 3–4)',
    washProgrammesCount: 8,
    programmes: '8 Programmes: Normal, Gentle/Delicate, Quick Wash, Strong Jeans, Aqua Reserve, Tub Clean',
    price: 17990,
    mrp: 24990,
    discountPercent: 28,
    savings: 7000,
    isOffer: true,
    finish: 'Metallic Platinum Silver',
    controls: 'Soft-touch Waterproof LED Panel',
    motor: 'Smart Inverter Motor (780 RPM)',
    drum: 'Stainless Steel TurboDrum with 3D Pulsator',
    lid: 'Soft Close Black Tempered Glass Lid',
    energyRating: '5 Star BEE Rated',
    dimensions: '540 × 540 × 890 mm',
    warranty: '2 Years Comprehensive • 10 Years on Motor',
    imageUrl: 'images/wm_top_load_75kg.jpg',
    productPageUrl: '#',
    description: '7.5 kg top load smart washer with TurboDrum 3D water stream, soft-close tempered glass lid, smart inverter motor, and stainless steel antibacterial tub.',
    highlight: 'TurboDrum Pulsator • Soft Close Glass • 5-Star Smart Inverter',
    keyFeatures: ['TurboDrum 3D Wash Flow', 'Smart Inverter Motor', 'Soft-Close Glass Lid', 'Stainless Steel Tub', '5-Star Energy Saver']
  },

  WM_WD10_AI: {
    id: 'tatwa-wm-wd10-ai',
    enumKey: 'WM_WD10_AI',
    sequenceOrder: 16,
    name: 'Tatwa AeroCare 10 kg AI Washer-Dryer Combo',
    modelName: 'TATWA AEROCARE WD10 AI COMBO',
    sku: 'TE-WM-WD101-COMBO',
    category: 'washing_machine',
    categoryLabel: 'Washer Dryer Combo (10kg / 7kg)',
    type: 'Front Load Washer Dryer Combo',
    capacity: '10.0 kg Wash / 7.0 kg 100% Dry',
    washProgrammesCount: 16,
    programmes: '16 Programmes: Wash & Wear in 59m, Allergen Steam, Air Refresh, Cotton, Delicate, Eco Dry',
    price: 44990,
    mrp: 59990,
    discountPercent: 25,
    savings: 15000,
    isOffer: true,
    finish: 'Obsidian Matte Black',
    controls: 'Full Color Touch Screen with Jog Dial',
    motor: 'Direct Motion Inverter Motor (1400 RPM)',
    dryingTech: 'Condenser Sensor Dry (100% Ready-to-Wear Clothes)',
    dimensions: '600 × 595 × 850 mm',
    warranty: '3 Years Comprehensive • 12 Years on Motor',
    imageUrl: 'images/wm_washer_dryer_10kg.jpg',
    productPageUrl: '#',
    description: 'All-in-one 10kg washer and 7kg condenser dryer combo with 100% dry output, sensor auto-dry, 1400 RPM spin, and dual hygiene steam cycle.',
    highlight: 'Wash & 100% Dry in 1 Machine • 10kg/7kg • Direct Motion Motor',
    keyFeatures: ['10kg Wash + 7kg 100% Dry', 'Sensor Condenser Dry', '1400 RPM Direct Motion Motor', 'Wash & Wear 59m Cycle', '12-Year Motor Warranty']
  },

  WM_SA65_TT: {
    id: 'tatwa-wm-sa65-tt',
    enumKey: 'WM_SA65_TT',
    sequenceOrder: 17,
    name: 'Tatwa AquaSpin 6.5 kg Semi-Automatic Twin Tub',
    modelName: 'TATWA AQUASPIN SA65 TT',
    sku: 'TE-WM-SA651-TT',
    category: 'washing_machine',
    categoryLabel: 'Semi-Automatic Twin Tub Washer',
    type: 'Semi-Automatic Twin Tub',
    capacity: '6.5 kg Wash / 5.0 kg Spin',
    washProgrammesCount: 3,
    programmes: '3 Programmes: Gentle, Normal, Strong (with 20 min Soak Timer)',
    price: 9990,
    mrp: 14490,
    discountPercent: 31,
    savings: 4500,
    isOffer: true,
    finish: 'Pure White with Ocean Blue Lids',
    controls: 'Ergonomic Rotary Dials',
    motor: 'High Torque Motor (1350 RPM Spin)',
    body: '100% Rust-Proof Fibre Body with Magic Lint Filter',
    dimensions: '740 × 430 × 880 mm',
    warranty: '2 Years Comprehensive • 5 Years on Wash Motor',
    imageUrl: 'images/wm_semi_automatic_65kg.jpg',
    productPageUrl: '#',
    description: 'Affordable 6.5 kg semi-automatic washer with 1350 RPM spin air dryer, rust-free polymer cabinet, soak timer, and heavy duty roller jet pulsator.',
    highlight: 'Under ₹10k (₹9,990) • 1350 RPM Spin • 100% Rust-Proof',
    keyFeatures: ['Best Budget (Under ₹10k)', '1350 RPM High-Speed Spin', '100% Rust-Free Body', 'Roller Jet Pulsator', '5-Year Wash Motor Warranty']
  },

  // --------------------------------------------------------------------------
  // SMART TELEVISIONS - VISION & CRYSTALVIEW SERIES (3 Models)
  // --------------------------------------------------------------------------
  TV_55_QLED: {
    id: 'tatwa-tv-55-qled',
    enumKey: 'TV_55_QLED',
    sequenceOrder: 18,
    name: 'Tatwa Vision Pro 55" 4K QLED Google TV',
    modelName: 'TATWA VISION 55 QLED 4K',
    sku: 'TE-TV-551-QLED',
    category: 'tv',
    categoryLabel: '4K Ultra HD QLED Smart TV',
    type: 'Quantum Dot QLED TV',
    displaySize: '55 Inch (139 cm)',
    resolution: '4K Ultra HD (3840 × 2160 Pixels)',
    refreshRate: '120 Hz MEMC (Motion Smoothing)',
    hdr: 'Dolby Vision IQ, HDR10+, HLG',
    sound: '40W Dolby Atmos with Built-in Woofer',
    os: 'Google TV with Hands-Free Far-Field Voice Mic',
    price: 36990,
    mrp: 54990,
    discountPercent: 33,
    savings: 18000,
    isOffer: true,
    finish: 'Metallic Titanium Bezel-less with Center Pedestal Stand',
    connectivity: '3 × HDMI 2.1 (eARC, ALLM), 2 × USB, Dual-Band Wi-Fi, Bluetooth 5.2',
    dimensions: '1226 × 712 × 76 mm',
    warranty: '3 Years Comprehensive Warranty',
    imageUrl: 'images/tv_qled_55inch.jpg',
    productPageUrl: '#',
    description: '55" Quantum Dot 4K QLED Smart TV with 1 Billion colors, 120Hz MEMC motion smoothing, Dolby Vision IQ & Atmos 40W sound, and Google TV voice control.',
    highlight: 'Quantum Dot QLED • 120Hz MEMC • Dolby Vision IQ • 40W Sound',
    keyFeatures: ['Quantum Dot 1 Billion Colors', '120Hz MEMC Motion Clarity', 'Dolby Vision IQ & Dolby Atmos', 'Hands-Free Far-field Voice', '3-Year Comprehensive Warranty']
  },

  TV_65_OLED: {
    id: 'tatwa-tv-65-oled',
    enumKey: 'TV_65_OLED',
    sequenceOrder: 19,
    name: 'Tatwa CrystalView 65" OLED Cinema Smart TV',
    modelName: 'TATWA CRYSTALVIEW 65 OLED PRO',
    sku: 'TE-TV-651-OLED',
    category: 'tv',
    categoryLabel: 'Flagship Cinema OLED TV',
    type: 'Self-lit OLED TV',
    displaySize: '65 Inch (164 cm)',
    resolution: '4K Ultra HD Cinema (3840 × 2160 Pixels)',
    refreshRate: '144 Hz Native VRR (Nvidia G-Sync & AMD FreeSync)',
    hdr: 'Dolby Vision IQ, HDR10+ Adaptive, Filmmaker Mode',
    sound: '60W 2.1.2 Ch Soundbar with Integrated Subwoofer',
    os: 'Google TV Ultra with AI Picture Engine Pro',
    price: 99990,
    mrp: 149990,
    discountPercent: 33,
    savings: 50000,
    isOffer: true,
    finish: 'Razor-Thin 3.8mm Blade Design, Aerospace Metal Frame',
    connectivity: '4 × HDMI 2.1 (4K@144Hz, eARC, VRR), 3 × USB, Wi-Fi 6, Bluetooth 5.3',
    dimensions: '1448 × 832 × 45 mm',
    warranty: '3 Years Comprehensive • 5 Years on OLED Panel',
    imageUrl: 'images/tv_oled_65inch.jpg',
    productPageUrl: '#',
    description: '65" Flagship OLED Cinema TV featuring 8.3 million self-lit pixels with infinite contrast, 144Hz VRR gaming, 60W soundbar, and ultra-thin 3.8mm blade styling.',
    highlight: 'Infinite Contrast OLED • 144Hz VRR Gaming • 60W Subwoofer • 3.8mm Blade',
    keyFeatures: ['Self-Lit OLED Infinite Contrast', '144Hz Native VRR Gaming', '60W Built-in Subwoofer Soundbar', 'Dolby Vision IQ & Atmos', '5-Year OLED Panel Warranty']
  },

  TV_43_UHD: {
    id: 'tatwa-tv-43-uhd',
    enumKey: 'TV_43_UHD',
    sequenceOrder: 20,
    name: 'Tatwa Nova 43" 4K Ultra HD Frameless Smart TV',
    modelName: 'TATWA NOVA 43 4K UHD SMART',
    sku: 'TE-TV-431-UHD',
    category: 'tv',
    categoryLabel: '4K Ultra HD Frameless Smart TV',
    type: 'Frameless 4K LED Smart TV',
    displaySize: '43 Inch (108 cm)',
    resolution: '4K Ultra HD (3840 × 2160 Pixels)',
    refreshRate: '60 Hz with Dynamic Motion Engine',
    hdr: 'HDR10, HLG',
    sound: '30W Dolby Audio Box Speakers',
    os: 'Google TV with Chromecast Built-in',
    price: 21990,
    mrp: 32990,
    discountPercent: 33,
    savings: 11000,
    isOffer: true,
    finish: 'Frameless Bezel-less Black with Metal Corner Legs',
    connectivity: '3 × HDMI 2.0, 2 × USB, Dual-Band Wi-Fi, Bluetooth 5.0',
    dimensions: '963 × 560 × 74 mm',
    warranty: '2 Years Comprehensive Warranty',
    imageUrl: 'images/tv_frameless_43inch.jpg',
    productPageUrl: '#',
    description: '43" frameless 4K Ultra HD Smart Google TV with vivid HDR picture, 30W Dolby Audio, Chromecast built-in, and bezel-less design under ₹22,000.',
    highlight: 'Under ₹22,000 (₹21,990) • Frameless 4K UHD • Google TV • 30W Sound',
    keyFeatures: ['Best Value 4K Under ₹22k', 'Frameless Bezel-less Screen', 'Google TV with Play Store', '30W Dolby Audio Sound', 'Chromecast & AirPlay Built-in']
  }
};

// ============================================================================
// COMPATIBILITY ALIASES & NORMALIZATIONS
// ============================================================================
TATWA_PRODUCT_CATALOG.CHIMNEY_1 = TATWA_PRODUCT_CATALOG.AERO_60;
TATWA_PRODUCT_CATALOG.CHIMNEY_2 = TATWA_PRODUCT_CATALOG.AERO_75;
TATWA_PRODUCT_CATALOG.CHIMNEY_3 = TATWA_PRODUCT_CATALOG.AERO_90;
TATWA_PRODUCT_CATALOG.LIBRA_60 = TATWA_PRODUCT_CATALOG.AERO_60;
TATWA_PRODUCT_CATALOG.LIBRA_75 = TATWA_PRODUCT_CATALOG.AERO_75;
TATWA_PRODUCT_CATALOG.LIBRA_90 = TATWA_PRODUCT_CATALOG.AERO_90;

TATWA_PRODUCT_CATALOG.DISHWASHER_1 = TATWA_PRODUCT_CATALOG.FBID_8PR_14S;
TATWA_PRODUCT_CATALOG.DISHWASHER_2 = TATWA_PRODUCT_CATALOG.FSID_8PR_14S;
TATWA_PRODUCT_CATALOG.DISHWASHER_FBID_8PR_14S = TATWA_PRODUCT_CATALOG.FBID_8PR_14S;
TATWA_PRODUCT_CATALOG.DISHWASHER_FSID_8PR_14S = TATWA_PRODUCT_CATALOG.FSID_8PR_14S;

TATWA_PRODUCT_CATALOG.WASHING_MACHINE_1 = TATWA_PRODUCT_CATALOG.WM_FL8_INV;
TATWA_PRODUCT_CATALOG.WASHING_MACHINE_2 = TATWA_PRODUCT_CATALOG.WM_TL75_SMT;
TATWA_PRODUCT_CATALOG.WASHING_MACHINE_3 = TATWA_PRODUCT_CATALOG.WM_WD10_AI;
TATWA_PRODUCT_CATALOG.WASHING_MACHINE_4 = TATWA_PRODUCT_CATALOG.WM_SA65_TT;

TATWA_PRODUCT_CATALOG.TV_1 = TATWA_PRODUCT_CATALOG.TV_55_QLED;
TATWA_PRODUCT_CATALOG.TV_2 = TATWA_PRODUCT_CATALOG.TV_65_OLED;
TATWA_PRODUCT_CATALOG.TV_3 = TATWA_PRODUCT_CATALOG.TV_43_UHD;

// Agent Prompt Exact Registry Enums
TATWA_PRODUCT_CATALOG.CHIMNEY_AERO_BLDC_60 = TATWA_PRODUCT_CATALOG.AERO_60;
TATWA_PRODUCT_CATALOG.CHIMNEY_AERO_BLDC_75 = TATWA_PRODUCT_CATALOG.AERO_75;
TATWA_PRODUCT_CATALOG.CHIMNEY_AERO_BLDC_90 = TATWA_PRODUCT_CATALOG.AERO_90;
TATWA_PRODUCT_CATALOG.CHIMNEY_LIBRA_BLDC_60 = TATWA_PRODUCT_CATALOG.AERO_60;
TATWA_PRODUCT_CATALOG.CHIMNEY_LIBRA_BLDC_75 = TATWA_PRODUCT_CATALOG.AERO_75;
TATWA_PRODUCT_CATALOG.CHIMNEY_LIBRA_BLDC_90 = TATWA_PRODUCT_CATALOG.AERO_90;

TATWA_PRODUCT_CATALOG.DW_FBID_8PR_14S = TATWA_PRODUCT_CATALOG.FBID_8PR_14S;
TATWA_PRODUCT_CATALOG.DW_FSID_8PR_14S = TATWA_PRODUCT_CATALOG.FSID_8PR_14S;
TATWA_PRODUCT_CATALOG.DW_FFSD_8PR_14S_INOX = TATWA_PRODUCT_CATALOG.FFSD_8PR_14S;
TATWA_PRODUCT_CATALOG.DW_FFSD_8PR_14S_BK = TATWA_PRODUCT_CATALOG.FFSD_8PR_14S_BK;
TATWA_PRODUCT_CATALOG.DW_FFSD_7PR_14S_BK = TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK;
TATWA_PRODUCT_CATALOG.DW_FFSD_6PR_14S_BK_DIGITAL = TATWA_PRODUCT_CATALOG.FFSD_6PR_14S_BK_DIGITAL;
TATWA_PRODUCT_CATALOG.DW_FFSD_6PR_12S_NEO_INOX = TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_INOX;
TATWA_PRODUCT_CATALOG.DW_FFSD_6PR_12S_NEO_BK = TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_BK;
TATWA_PRODUCT_CATALOG.DW_FFSD_6PR_8S_ACE_INOX = TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_INOX;
TATWA_PRODUCT_CATALOG.DW_FFSD_6PR_8S_ACE_BLACK = TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_BLACK;

TATWA_PRODUCT_CATALOG.WM_ECOWASH_FL8_INV = TATWA_PRODUCT_CATALOG.WM_FL8_INV;
TATWA_PRODUCT_CATALOG.WM_HYDROPULSE_TL75_SMT = TATWA_PRODUCT_CATALOG.WM_TL75_SMT;
TATWA_PRODUCT_CATALOG.WM_AEROCARE_WD10_AI = TATWA_PRODUCT_CATALOG.WM_WD10_AI;
TATWA_PRODUCT_CATALOG.WM_AQUASPIN_SA65_TT = TATWA_PRODUCT_CATALOG.WM_SA65_TT;

TATWA_PRODUCT_CATALOG.TV_VISION_55_QLED = TATWA_PRODUCT_CATALOG.TV_55_QLED;
TATWA_PRODUCT_CATALOG.TV_CRYSTALVIEW_65_OLED = TATWA_PRODUCT_CATALOG.TV_65_OLED;
TATWA_PRODUCT_CATALOG.TV_NOVA_43_UHD = TATWA_PRODUCT_CATALOG.TV_43_UHD;

// ============================================================================
// 2. PREDEFINED COMPONENT PAYLOADS & GUIDES
// ============================================================================

export const DISHWASHER_LOADING_GUIDE = {
  title: 'How to Load a Tatwa Dishwasher for Indian Cookware',
  subtitle: 'Official loading techniques for maximum cleaning performance and drainage',
  imageUrl: 'images/dishwasher_integrated.jpg',
  sections: [
    {
      rackName: 'Lower Basket (Heaviest Cookware)',
      icon: '🍳',
      items: 'Pressure cookers, Kadai, Patila, Frying pans, Large dinner plates',
      rules: [
        'Place heavy pots and kadai facing downwards at a 45° angle so water sprays inside and drains freely.',
        'Never nest/stack utensils inside one another; each vessel needs direct spray access.',
        'Position large thalis and dinner plates vertically between the foldable rack tines.'
      ]
    },
    {
      rackName: 'Upper Basket (Glasses, Cups & Katoris)',
      icon: '☕',
      items: 'Chai cups, glassware, serving bowls, steel katoris, small plates',
      rules: [
        'Tilt glasses and chai mugs upside-down at an angle to prevent water pooling on curved bottoms.',
        'Secure light plastic or steel bowls firmly between tines so water pressure does not flip them.',
        'Adjust the upper basket height if tall pots are loaded in the bottom basket.'
      ]
    },
    {
      rackName: 'Cutlery Tray / Basket',
      icon: '🍴',
      items: 'Spoons, forks, butter knives, small whisks, and peelers',
      rules: [
        'Alternate spoon handles up and down so spoons do not nest/stick together during the wash.',
        'Place knife blades pointing downwards for safe unloading.',
        'Long ladles and tongs should be laid flat on the upper basket shelf.'
      ]
    },
    {
      rackName: 'Critical Checks Before Pressing Start',
      icon: '⚠️',
      items: 'Spray arms, detergent flap, food scraping',
      rules: [
        'Spin spray arms by hand: Ensure tall spatulas or deep pots do not block either arm from rotating freely.',
        'Clear the detergent dispenser: Ensure plates do not block the tablet door from springing open.',
        'Scrape, do not pre-wash: Scrape off large bones, lemon rinds, and solid food into the dustbin.'
      ]
    }
  ]
};

export const USER_MANUAL_GUIDE = {
  title: 'Tatwa Electronics User Manual & Official Maintenance Guide',
  subtitle: 'Official operating procedures, gesture controls, heat auto-clean, care guidelines & troubleshooting FAQ',

  // 1. Chimney Heat Auto-Clean Protocol
  chimneyAutoClean: {
    title: 'Chimney Heat Auto-Clean Step-by-Step Procedure',
    cycleDuration: '10 Minutes Total (9 min Heating + 1 min Fan)',
    reminderHours: 'Every 30 Operating Hours / Post-Heavy Frying',
    steps: [
      { step: 1, name: 'Press Auto-Clean Button', desc: 'Touch the Auto-Clean symbol on the front glass panel or trigger the motion gesture sensor.' },
      { step: 2, name: 'Heating Phase (9 Minutes)', desc: 'Internal heating coils warm up the motor chamber to liquefy thick accumulated oil and grease deposits.' },
      { step: 3, name: 'Fan Drain Phase (1 Minute)', desc: 'The high-speed blower fan rotates to channel the liquefied grease directly into the stainless steel collector tray.' },
      { step: 4, name: 'Oil Collector Maintenance', desc: 'Slide out the bottom metal oil collector tray, empty accumulated grease, wash with warm soapy water, and replace.' }
    ],
    precautions: [
      'Clean oil collector periodically to prevent grease overflow.',
      'Always disconnect power before surface wiping or servicing.',
      'Auto-clean is an assistance feature—filterless design does not mean maintenance-free.'
    ]
  },

  // 2. Touch & Wave Gesture Control Operation
  gestureControl: {
    title: 'Touch & Wave Gesture Control Operation',
    technology: 'Dual Optical Motion Sensors with 9 Speed Control',
    operatingDistance: '5 to 10 cm (2 to 4 inches) from front glass panel',
    instructions: [
      {
        gesture: 'Wave Left-to-Right (👋 ➡️)',
        action: 'Power ON / Step Up Speed (1 → 9)',
        desc: 'Wave your hand smoothly from left to right across the sensor to turn on at Speed 1. Repeated waves increment speed up to Speed 9 for heavy frying.'
      },
      {
        gesture: 'Wave Right-to-Left (⬅️ 👋)',
        action: 'Step Down Speed / Power OFF',
        desc: 'Wave your hand smoothly from right to left to step down the speed level. A final wave at Speed 1 powers the chimney off completely.'
      },
      {
        gesture: 'Touch Controls Backup',
        action: 'Direct Capacitive Touch',
        desc: 'Touch icons on the front panel provide instant direct access to all 9 speeds, LED lighting, and Auto-Clean mode if hands are wet or greasy.'
      }
    ],
    tips: [
      'Maintain 5–10 cm distance with steady, moderate hand movements.',
      'Keep the black glass front clean and smudge-free for optimal optical sensing.',
      'If gesture does not respond, verify sensor cleanliness and use touch buttons.'
    ]
  },

  // 3. Filterless Technology & Maintenance
  filterlessMaintenance: {
    title: 'Filterless Technology & Real-World Maintenance',
    concept: 'Filterless Design ≠ Maintenance-Free',
    summary: 'The Tatwa Aero BLDC uses a filterless design so there are no mesh or baffle filters to scrub or replace. Periodic exterior care and oil tray cleaning are essential for peak airflow.',
    maintenanceRules: [
      {
        title: 'Exterior Glass & Body Care',
        frequency: 'Weekly or After Deep Cooking',
        action: 'Disconnect power, spray mild neutral kitchen detergent onto a soft microfiber cloth, and wipe down the curved tempered glass and body.'
      },
      {
        title: 'Oil Collector Tray',
        frequency: 'Every 2 to 3 Weeks',
        action: 'Slide out the bottom metal collector tray, drain liquefied grease, rinse in warm water with dish soap, dry and reinstall.'
      },
      {
        title: 'Heat Auto-Clean Trigger',
        frequency: 'Every 30 Cooking Hours or Monthly',
        action: 'Run the dedicated 10-minute thermal heating cycle to prevent grease solidification inside the blower chamber.'
      }
    ]
  },

  // 4. Troubleshooting Support FAQ
  troubleshootingFAQ: [
    {
      q: 'Why does the chimney sound noisy or make a humming sound?',
      a: 'Ensure duct pipe diameter is minimum 150mm (6 inches) with no sharp 90-degree bends. Run the 10-minute Auto-Clean to clear blower residue.'
    },
    {
      q: 'Why are dishes wet or cloudy after a dishwasher cycle?',
      a: 'Refill dishwasher salt in the bottom container to neutralize hard water limescale, and replenish liquid rinse aid to accelerate spotless drying.'
    },
    {
      q: 'How does the Washing Machine AI Direct Drive protect clothes?',
      a: 'The motor detects garment weight and fabric softness in real-time, automatically adjusting drum motion across 6 optimized tumble patterns.'
    },
    {
      q: 'How do I optimize 4K picture quality on Tatwa Google TVs?',
      a: 'Enable HDR Dynamic Tone Mapping in Picture Settings, and set Picture Mode to Cinema or Filmmaker Mode for authentic color grading.'
    }
  ]
};

export const WASHING_MACHINE_FABRIC_GUIDE = {
  title: 'Tatwa EcoWash Smart Fabric & Program Guide',
  subtitle: 'Optimized wash settings, steam sanitization and load management for everyday laundry',
  imageUrl: 'images/wm_front_load_8kg.jpg',
  sections: [
    {
      rackName: 'AI Steam Allergy Care (60°C – 90°C)',
      icon: '♨️',
      items: 'Baby clothes, bedsheets, towels, sensitive skin garments',
      rules: [
        'Heats water into pure micro-steam penetrating deep fabric weaves to eradicate 99.9% dust mites and bacteria.',
        'Reduces stubborn wrinkles by up to 30%, making ironing effortless.',
        'Always separate delicate silks and woolens before running steam cycles.'
      ]
    },
    {
      rackName: 'Cotton & Heavy Daily Loads',
      icon: '👕',
      items: 'Denim jeans, shirts, cotton trousers, kurtas',
      rules: [
        'Load up to 80% capacity for optimal drum agitation and water saturation.',
        'Use the 1400 RPM spin speed to extract maximum moisture, cutting drying time in half.',
        'Pour liquid detergent in Compartment II; add fabric softener in the flower-marked center slot.'
      ]
    },
    {
      rackName: 'Delicates & Quick 15m Refresh',
      icon: '✨',
      items: 'Activewear, gym clothes, lightly soiled daily tees, synthetic blends',
      rules: [
        'Use Quick 15 for up to 2 kg lightly soiled clothes to save 70% electricity and water.',
        'Turn printed tees and zip jackets inside-out to prevent fabric friction.'
      ]
    }
  ]
};

export const TV_DISPLAY_GUIDE = {
  title: 'Tatwa Cinema Display & Audio Calibration Guide',
  subtitle: 'Unlocking 4K QLED, OLED Infinite Contrast & Dolby Atmos immersive home theater',
  imageUrl: 'images/tv_oled_65inch.jpg',
  sections: [
    {
      rackName: 'Quantum Dot QLED vs OLED Contrast',
      icon: '📺',
      items: 'Brightness, Color Volume, Black Levels, Viewing Angles',
      rules: [
        'QLED (Tatwa Vision Pro): Uses Quantum Dots for ultra-high 1000+ nits peak brightness, ideal for bright sunlit Indian living rooms.',
        'OLED (Tatwa CrystalView): 8.3 million self-lit individual pixels provide perfect absolute black, infinite contrast ratio, and wide 178° viewing angles.'
      ]
    },
    {
      rackName: 'Dolby Atmos & Audio Tuning',
      icon: '🔊',
      items: 'Voice Clarity, Virtual Surround, eARC Passthrough',
      rules: [
        'Enable Dialogue Enhancer for crisp, audible movie dialogues without raising overall volume.',
        'Use HDMI Port 1 (eARC 2.1) when connecting high-end home theater AVRs or external subwoofers.'
      ]
    }
  ]
};

// ============================================================================
// 3. CORE HELPER FUNCTIONS
// ============================================================================

export function getAllProducts() {
  return [
    // Chimneys
    TATWA_PRODUCT_CATALOG.AERO_60,
    TATWA_PRODUCT_CATALOG.AERO_75,
    TATWA_PRODUCT_CATALOG.AERO_90,
    // Dishwashers
    TATWA_PRODUCT_CATALOG.FBID_8PR_14S,
    TATWA_PRODUCT_CATALOG.FSID_8PR_14S,
    TATWA_PRODUCT_CATALOG.FFSD_8PR_14S,
    TATWA_PRODUCT_CATALOG.FFSD_8PR_14S_BK,
    TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK,
    TATWA_PRODUCT_CATALOG.FFSD_6PR_14S_BK_DIGITAL,
    TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_INOX,
    TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_BK,
    TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_INOX,
    TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_BLACK,
    // Washing Machines
    TATWA_PRODUCT_CATALOG.WM_FL8_INV,
    TATWA_PRODUCT_CATALOG.WM_TL75_SMT,
    TATWA_PRODUCT_CATALOG.WM_WD10_AI,
    TATWA_PRODUCT_CATALOG.WM_SA65_TT,
    // Televisions
    TATWA_PRODUCT_CATALOG.TV_55_QLED,
    TATWA_PRODUCT_CATALOG.TV_65_OLED,
    TATWA_PRODUCT_CATALOG.TV_43_UHD
  ];
}

export function getProductById(id) {
  if (!id) return null;
  const lower = id.toLowerCase().trim();
  const all = getAllProducts();
  return all.find((p) => p.id.toLowerCase() === lower || p.enumKey.toLowerCase() === lower || p.sku.toLowerCase() === lower) || null;
}

export function getProductsByCategory(category) {
  if (!category || category === 'all' || category === 'both') {
    return getAllProducts();
  }
  const normCat = category.toLowerCase().trim();
  return getAllProducts().filter((p) => p.category.toLowerCase() === normCat);
}

// ============================================================================
// 4. FUZZY RESOLUTION & OMNI-QUERY DISPATCHER
// ============================================================================

/**
 * Resolves any tool call, webhook payload, or natural language search query
 * strictly to the authorized Tatwa Electronics product catalog & components.
 *
 * @param {Object} rawInput - Payload from Oration AI or HTTP request
 * @returns {Object} Standardized rich visualizer response payload
 */
export function resolveToolRequest(rawInput = {}) {
  const merged = { ...rawInput };

  // 1. Extract natural language text and normalized intent
  let text = '';
  if (merged.query && typeof merged.query === 'string') text += ' ' + merged.query;
  if (merged.product && typeof merged.product === 'string') text += ' ' + merged.product;
  if (merged.message && typeof merged.message === 'string') text += ' ' + merged.message;
  if (merged.action && typeof merged.action === 'string') text += ' ' + merged.action;
  if (merged.category && typeof merged.category === 'string') text += ' ' + merged.category;

  const lowerText = text.toLowerCase().trim();
  const allProducts = getAllProducts();

  // 2. Extract Category
  let category = merged.category ? String(merged.category).toLowerCase().trim() : '';
  if (!category || category === 'all' || category === 'both') {
    if (lowerText.includes('washing machine') || lowerText.includes('washer') || lowerText.includes('कपड़े') || lowerText.includes('वाशिंग मशीन')) {
      category = 'washing_machine';
    } else if (lowerText.includes('tv') || lowerText.includes('television') || lowerText.includes('qled') || lowerText.includes('oled') || lowerText.includes('टीवी') || lowerText.includes('टेलीविजन')) {
      category = 'tv';
    } else if (lowerText.includes('chimney') || lowerText.includes('चिमनी') || lowerText.includes('hood') || lowerText.includes('suction') || lowerText.includes('bldc')) {
      category = 'chimney';
    } else if (lowerText.includes('dishwasher') || lowerText.includes('डिशवॉशर') || lowerText.includes('बर्तन')) {
      category = 'dishwasher';
    }
  }

  // 3. Extract Max Price / Budget Filter
  const cleanNumText = lowerText.replace(/,/g, '');
  let maxPrice = Number(merged.maxPrice || merged.max_price || merged.budget || 0);
  if (!maxPrice) {
    const budgetMatch = cleanNumText.match(/(?:under|below|less than|budget|अंडर|कम|के अंदर)\s*(?:of|rs\.?|inr|₹)?\s*(\d{4,6})/i) ||
                        cleanNumText.match(/(\d{4,6})\s*(?:under|below|budget|के अंदर|से कम|तक|अंदर)/i) ||
                        cleanNumText.match(/(\d{4,6})/);
    if (budgetMatch && (lowerText.includes('under') || lowerText.includes('below') || lowerText.includes('अंडर') || lowerText.includes('budget') || lowerText.includes('less than') || lowerText.includes('कम') || lowerText.includes('अंदर'))) {
      maxPrice = Number(budgetMatch[1]);
    }
  }

  // 4. Action & Display Mode Detection
  let action = merged.action ? String(merged.action).toLowerCase().trim() : '';
  const displayMode = (merged.display_mode || merged.displayMode || merged.mode || '').toLowerCase().trim();

  if (displayMode === 'comparison' || displayMode === 'compare') {
    action = 'compare_products';
  } else if (displayMode === 'manual' || displayMode === 'guide') {
    action = 'show_manual';
  } else if (displayMode === 'offers' || displayMode === 'deals') {
    action = 'show_offers';
  } else if (displayMode === 'welcome') {
    action = 'welcome';
  } else if (displayMode === 'single') {
    action = 'show_products';
  } else if (displayMode === 'sequence') {
    action = 'sequence';
  } else if (action === 'welcome' || lowerText.includes('welcome') || lowerText.includes('होम') || lowerText.includes('home')) {
    action = 'welcome';
  } else if (lowerText.includes('compare') || lowerText.includes('कंपेयर') || lowerText.includes('तुलना') || lowerText.includes('vs') || merged.compare === true || merged.compare === 'true') {
    action = 'compare_products';
  } else if (lowerText.includes('offer') || lowerText.includes('ऑफर') || lowerText.includes('discount') || lowerText.includes('छूट') || lowerText.includes('deal')) {
    action = 'show_offers';
  } else if (maxPrice > 0) {
    action = 'filter_by_price';
  } else if (
    lowerText.includes('manual') ||
    lowerText.includes('troubleshoot') ||
    lowerText.includes('troubleshooting') ||
    lowerText.includes('maintenance') ||
    lowerText.includes('मैनुअल')
  ) {
    action = 'show_manual';
  }

  // ==========================================================================
  // VIEW 0: WELCOME SCREEN
  // ==========================================================================
  if (action === 'welcome') {
    return {
      componentType: 'welcome',
      title: 'Tatwa Electronics Studio',
      subtitle: 'Smart Living • Intelligent Kitchen & Home Appliances',
      products: [
        TATWA_PRODUCT_CATALOG.AERO_60,
        TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK,
        TATWA_PRODUCT_CATALOG.WM_FL8_INV,
        TATWA_PRODUCT_CATALOG.TV_55_QLED
      ]
    };
  }

  // ==========================================================================
  // VIEW 1: GUIDES & MANUALS
  // ==========================================================================

  // 1a. Chimney Installation Guide
  if (
    action === 'chimney_installation' ||
    action === 'installation' ||
    (lowerText.includes('install') && (category === 'chimney' || !category))
  ) {
    return {
      componentType: 'chimney-installation',
      title: 'Tatwa Chimney Installation Guide',
      subtitle: 'Aero BLDC Auto-Clean Cooker Hood Step-by-Step Installation Manual',
      products: [TATWA_PRODUCT_CATALOG.AERO_60, TATWA_PRODUCT_CATALOG.AERO_90],
      images: [
        {
          name: 'Chimney Installation Blueprint',
          title: '4-Step Wall Mount & Duct Installation',
          imageUrl: 'images/chimney_installation_hero.jpg',
          description: 'Step 1 Prepare Wall, Step 2 Fix Bracket, Step 3 Mount Chimney, Step 4 Connect & Test'
        }
      ]
    };
  }

  // 1b. Dishwasher Loading Guide
  if (action === 'dishwasher_loading' || action === 'loading_guide' || (lowerText.includes('load') && category === 'dishwasher')) {
    return {
      componentType: 'dishwasher-loading',
      title: 'How to Load a Tatwa Dishwasher',
      subtitle: 'Optimal utensil arrangement for Indian kadai, thalis and cutlery',
      guideData: DISHWASHER_LOADING_GUIDE,
      products: [TATWA_PRODUCT_CATALOG.FBID_8PR_14S, TATWA_PRODUCT_CATALOG.FSID_8PR_14S],
      images: [
        {
          name: 'Dishwasher Loading Diagram',
          title: 'Tatwa Dishwasher Loading Architecture',
          imageUrl: DISHWASHER_LOADING_GUIDE.imageUrl,
          description: 'Upper basket for cups/glasses, lower basket for kadai/plates.'
        }
      ]
    };
  }

  // 1c. Chimney Cleaning & Auto-Clean Guide
  if (action === 'chimney_cleaning' || (lowerText.includes('clean') && category === 'chimney')) {
    return {
      componentType: 'chimney-cleaning',
      title: 'Chimney Cleaning & Maintenance Guide',
      subtitle: '9-Min Thermal Heat Auto-Clean & Stainless Steel Oil Collector Protocol',
      products: [TATWA_PRODUCT_CATALOG.AERO_60, TATWA_PRODUCT_CATALOG.AERO_75, TATWA_PRODUCT_CATALOG.AERO_90],
      images: [
        {
          name: 'Chimney Heat Auto-Clean Guide',
          title: '9-Min Thermal Heat + 1-Min Blower Flush',
          imageUrl: 'images/clean_hero_diag.jpg',
          description: 'Step 1 Surface Care, Step 2 9-Min Thermal Melting, Step 3 1-Min Centrifuge Flush, Step 4 Empty Stainless Oil Collector.'
        }
      ]
    };
  }

  // 1d. Dishwasher Salt & Chemical Care Guide
  if (action === 'dishwasher_cleaning' || action === 'dishwasher_maintenance' || (lowerText.includes('salt') && category === 'dishwasher')) {
    return {
      componentType: 'dishwasher-cleaning',
      title: 'Dishwasher Hygiene & Salt Softener Guide',
      subtitle: 'Water softening salt, rinse aid dispenser & 3-stage filtration maintenance',
      products: [TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_BK, TATWA_PRODUCT_CATALOG.FBID_8PR_14S],
      images: [
        {
          name: 'Dishwasher Care Guide',
          title: 'Essential Hygiene & Filter Maintenance',
          imageUrl: TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_BK.imageUrl,
          description: 'Add salt to prevent limescale, refill rinse aid for streak-free drying, rinse 3-stage mesh filter weekly.'
        }
      ]
    };
  }

  // 1e. Dishwasher USPs & 3D Spray
  if (action === 'dishwasher_usp' || action === 'dishwasher_features') {
    return {
      componentType: 'dishwasher-usp',
      title: 'Tatwa PureWash Dishwasher Innovations',
      subtitle: 'Engineered for Heavy Indian Cooking, Burnt Kadai & 14-Place Hygiene',
      products: [TATWA_PRODUCT_CATALOG.FBID_8PR_14S, TATWA_PRODUCT_CATALOG.FSID_8PR_14S, TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK],
      images: [
        {
          name: 'Dishwasher Signature USPs',
          title: 'Tatwa 3D Hydro-Clean & 70°C Sanitization',
          imageUrl: 'images/dw_usp_hero.jpg',
          description: 'USP 1 3D Triple Spray Arms, USP 2 Dual Zone Wash, USP 3 70°C Intensive Hygiene, USP 4 14-Place Indian Cookware Capacity.'
        }
      ]
    };
  }

  // 1f. BLDC Inverter Motor Spotlight
  if (action === 'bldc_motor' || lowerText.includes('bldc') || lowerText.includes('inverter motor')) {
    return {
      componentType: 'bldc-motor',
      title: 'Tatwa Inverter BLDC Motor Technology',
      subtitle: 'Brushless DC Inverter Motor Architecture & Operation Video',
      videoUrl: 'images/bldc_motor.mp4',
      products: [TATWA_PRODUCT_CATALOG.AERO_60, TATWA_PRODUCT_CATALOG.AERO_75, TATWA_PRODUCT_CATALOG.AERO_90],
      images: [
        {
          name: 'Inverter BLDC Motor Video',
          title: 'Brushless DC Inverter Motor Architecture',
          imageUrl: 'images/bldc_motor.mp4',
          description: 'Consumes only 150W, runs whisper-quiet at 44-46 dB, and backed by an industry-leading 12-year warranty.'
        }
      ]
    };
  }

  // 1g. Chimney Wave Gesture Controls
  if (action === 'chimney_controls' || action === 'gesture_control' || lowerText.includes('gesture')) {
    return {
      componentType: 'chimney-controls',
      title: 'Touch & Wave Gesture Control System',
      subtitle: 'Hands-free dual optical motion sensor & 9-speed touch control interface',
      products: [TATWA_PRODUCT_CATALOG.AERO_90],
      images: [
        {
          name: 'Gesture Controls',
          title: 'Touch & Wave Motion Sensor Guide',
          imageUrl: TATWA_PRODUCT_CATALOG.AERO_90.imageUrl,
          description: 'Wave left-to-right to turn on and increase speed. Wave right-to-left to decrease speed and power down.'
        }
      ]
    };
  }

  // 1h. Washing Machine Fabric & Cycle Guide
  if (action === 'washing_machine_guide' || (lowerText.includes('wash guide') || lowerText.includes('fabric care'))) {
    return {
      componentType: 'washing-machine-guide',
      title: 'Tatwa EcoWash Smart Fabric & Program Guide',
      subtitle: 'Optimized wash settings, steam sanitization and load management for everyday laundry',
      guideData: WASHING_MACHINE_FABRIC_GUIDE,
      products: [TATWA_PRODUCT_CATALOG.WM_FL8_INV, TATWA_PRODUCT_CATALOG.WM_WD10_AI],
      images: [
        {
          name: 'Fabric Care Guide',
          title: 'AI Steam & Fabric Protection',
          imageUrl: 'images/wm_front_load_8kg.jpg',
          description: 'AI Direct Drive optimizes drum motions based on fabric weight and softness.'
        }
      ]
    };
  }

  // 1i. TV Display & Picture Calibration Guide
  if (action === 'tv_display_guide' || action === 'tv_guide' || lowerText.includes('qled vs oled')) {
    return {
      componentType: 'tv-display-guide',
      title: 'Tatwa Cinema Display & Audio Calibration Guide',
      subtitle: 'Unlocking 4K QLED, OLED Infinite Contrast & Dolby Atmos immersive home theater',
      guideData: TV_DISPLAY_GUIDE,
      products: [TATWA_PRODUCT_CATALOG.TV_55_QLED, TATWA_PRODUCT_CATALOG.TV_65_OLED],
      images: [
        {
          name: 'Display Guide',
          title: 'Quantum Dot vs OLED Cinema Comparison',
          imageUrl: 'images/tv_oled_65inch.jpg',
          description: 'QLED delivers ultra-bright vivid HDR; OLED delivers pure absolute blacks and infinite contrast.'
        }
      ]
    };
  }

  // 1j. User Manual & Maintenance Master
  if (action === 'show_manual' || action === 'manual' || action === 'auto_clean' || action === 'troubleshooting') {
    return {
      componentType: 'manual',
      title: 'Tatwa User Manual & Maintenance Master Guide',
      subtitle: 'Heat auto-clean, wave gesture control, filterless care & troubleshooting matrix',
      manualData: USER_MANUAL_GUIDE,
      products: [TATWA_PRODUCT_CATALOG.AERO_60, TATWA_PRODUCT_CATALOG.FBID_8PR_14S, TATWA_PRODUCT_CATALOG.WM_FL8_INV],
      images: [
        {
          name: 'Chimney Auto-Clean Procedure',
          title: '9-Min Heating + 1-Min Fan Oil Collector Guide',
          imageUrl: TATWA_PRODUCT_CATALOG.AERO_60.imageUrl,
          description: 'Thermal heat auto-clean separates oil into the stainless steel collector.'
        }
      ]
    };
  }

  // ==========================================================================
  // VIEW 2: OFFERS & PROMOTIONAL DEALS SHOWCASE
  // ==========================================================================
  if (action === 'show_offers' || action === 'offers' || action === 'discounts') {
    const wantsCompare = lowerText.includes('compare') || lowerText.includes('कंपेयर') || lowerText.includes('तुलना') || lowerText.includes('vs') || merged.compare === true || merged.compare === 'true';

    let offerCandidates = allProducts.filter((p) => p.isOffer);
    if (category && category !== 'all' && category !== 'both') {
      offerCandidates = offerCandidates.filter((p) => p.category === category);
    }
    if (maxPrice > 0) {
      offerCandidates = offerCandidates.filter((p) => p.price <= maxPrice);
    }

    if (wantsCompare && offerCandidates.length >= 2) {
      return {
        componentType: 'comparison',
        title: `Tatwa ${category ? category.replace('_', ' ').toUpperCase() : 'Appliance'} Offers Comparison`,
        subtitle: `Comparing ${offerCandidates.length} promotional models with discounts up to 34% off`,
        products: offerCandidates,
        images: offerCandidates.map((p) => ({
          name: p.name,
          title: p.name,
          imageUrl: p.imageUrl,
          description: `Price: ₹${p.price.toLocaleString('en-IN')} (Save ₹${p.savings.toLocaleString('en-IN')})`
        }))
      };
    }

    return {
      componentType: 'offers',
      title: `Tatwa Electronics Promotional Deals`,
      subtitle: `Exclusive limited-period savings on high-demand smart appliances`,
      products: offerCandidates.length > 0 ? offerCandidates : allProducts.filter((p) => p.isOffer),
      images: (offerCandidates.length > 0 ? offerCandidates : allProducts.filter((p) => p.isOffer)).map((p) => ({
        name: p.name,
        title: p.name,
        imageUrl: p.imageUrl,
        description: `Now ₹${p.price.toLocaleString('en-IN')} (Save ₹${p.savings.toLocaleString('en-IN')} • ${p.discountPercent}% Off)`
      }))
    };
  }

  // ==========================================================================
  // VIEW 3: BUDGET & MULTI-CONDITION FILTERS
  // ==========================================================================
  if (action === 'filter_by_price' || maxPrice > 0) {
    let pool = allProducts;
    if (category && category !== 'all' && category !== 'both') {
      pool = pool.filter((p) => p.category === category);
    }
    const matching = pool.filter((p) => p.price <= maxPrice);

    const targetList = matching.length > 0 ? matching : pool;
    const catLabel = category ? (category === 'washing_machine' ? 'Washing Machines' : category === 'tv' ? 'Smart TVs' : category === 'chimney' ? 'Chimneys' : 'Dishwashers') : 'Appliances';

    const wantsCompare = lowerText.includes('compare') || lowerText.includes('कंपेयर') || lowerText.includes('तुलना') || lowerText.includes('vs');

    if (wantsCompare && targetList.length >= 2) {
      return {
        componentType: 'comparison',
        title: `Compare Tatwa ${catLabel} Under ₹${maxPrice.toLocaleString('en-IN')}`,
        subtitle: `Side-by-side comparison of ${targetList.length} models within your budget`,
        products: targetList,
        images: targetList.map((p) => ({
          name: p.name,
          title: p.name,
          imageUrl: p.imageUrl,
          description: `Price: ₹${p.price.toLocaleString('en-IN')} (MRP: ₹${p.mrp.toLocaleString('en-IN')})`
        }))
      };
    }

    return {
      componentType: 'products',
      title: `Tatwa ${catLabel} Under ₹${maxPrice.toLocaleString('en-IN')}`,
      subtitle: matching.length > 0
        ? `Found ${matching.length} models matching your budget of ₹${maxPrice.toLocaleString('en-IN')}`
        : `Showing closest appliances available around your budget`,
      products: targetList,
      images: targetList.map((p) => ({
        name: p.name,
        title: p.name,
        imageUrl: p.imageUrl,
        description: `Price: ₹${p.price.toLocaleString('en-IN')} (MRP: ₹${p.mrp.toLocaleString('en-IN')})`
      }))
    };
  }

  // ==========================================================================
  // VIEW 4: SIDE-BY-SIDE SPEC COMPARISON MATRIX
  // ==========================================================================
  if (action === 'compare_products' || action === 'compare' || action === 'comparison') {
    let toCompare = [];

    // Parse explicit requested products
    let requested = merged.products || merged.product_enums || merged.models || [];
    if (typeof requested === 'string') {
      try {
        requested = JSON.parse(requested);
      } catch (_) {
        requested = requested.split(',').map((s) => s.trim());
      }
    }

    if (Array.isArray(requested) && requested.length > 0) {
      toCompare = requested
        .map((req) => resolveSingleProduct(req, allProducts))
        .filter(Boolean);
    }

    // Fallback if no specific products provided: compare category candidates
    if (toCompare.length < 2) {
      if (category === 'chimney') {
        toCompare = [TATWA_PRODUCT_CATALOG.AERO_60, TATWA_PRODUCT_CATALOG.AERO_75, TATWA_PRODUCT_CATALOG.AERO_90];
      } else if (category === 'washing_machine') {
        toCompare = [TATWA_PRODUCT_CATALOG.WM_FL8_INV, TATWA_PRODUCT_CATALOG.WM_TL75_SMT, TATWA_PRODUCT_CATALOG.WM_WD10_AI];
      } else if (category === 'tv') {
        toCompare = [TATWA_PRODUCT_CATALOG.TV_55_QLED, TATWA_PRODUCT_CATALOG.TV_65_OLED, TATWA_PRODUCT_CATALOG.TV_43_UHD];
      } else if (category === 'dishwasher') {
        toCompare = [TATWA_PRODUCT_CATALOG.FBID_8PR_14S, TATWA_PRODUCT_CATALOG.FSID_8PR_14S, TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK];
      } else {
        // Compare cross-category flagships
        toCompare = [
          TATWA_PRODUCT_CATALOG.AERO_60,
          TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK,
          TATWA_PRODUCT_CATALOG.WM_FL8_INV,
          TATWA_PRODUCT_CATALOG.TV_55_QLED
        ];
      }
    }

    // Limit to max 4 models for clean side-by-side rendering
    toCompare = toCompare.slice(0, 4);

    return {
      componentType: 'comparison',
      title: `Tatwa Appliance Comparison (${toCompare.length} Models)`,
      subtitle: `Side-by-side technical specification, capacity and price matrix`,
      products: toCompare,
      images: toCompare.map((p) => ({
        name: p.name,
        title: p.name,
        imageUrl: p.imageUrl,
        description: `Price: ₹${p.price.toLocaleString('en-IN')} (Save ₹${p.savings.toLocaleString('en-IN')})`
      }))
    };
  }

  // ==========================================================================
  // VIEW 5: EXACT PRODUCT LOOKUPS OR CATEGORY BROWSING
  // ==========================================================================
  let resolvedList = [];

  // Check if explicit product list passed
  let requestedProducts = merged.products || merged.product || merged.product_enums || [];
  if (typeof requestedProducts === 'string') {
    try {
      requestedProducts = JSON.parse(requestedProducts);
    } catch (_) {
      requestedProducts = requestedProducts.split(',').map((s) => s.trim());
    }
  }

  if (Array.isArray(requestedProducts) && requestedProducts.length > 0) {
    resolvedList = requestedProducts
      .map((req) => resolveSingleProduct(req, allProducts))
      .filter(Boolean);
  } else if (typeof requestedProducts === 'string' && requestedProducts.trim()) {
    const p = resolveSingleProduct(requestedProducts, allProducts);
    if (p) resolvedList.push(p);
  }

  // If query contains specific product mention
  if (resolvedList.length === 0 && lowerText) {
    for (const p of allProducts) {
      if (
        lowerText.includes(p.name.toLowerCase()) ||
        lowerText.includes(p.modelName.toLowerCase()) ||
        lowerText.includes(p.sku.toLowerCase())
      ) {
        resolvedList.push(p);
      }
    }
  }

  // If still empty, filter by category or return all
  if (resolvedList.length === 0) {
    if (category && category !== 'all' && category !== 'both') {
      resolvedList = allProducts.filter((p) => p.category === category);
    } else {
      resolvedList = allProducts;
    }
  }

  const catTitle = category ? (category === 'washing_machine' ? 'Washing Machines' : category === 'tv' ? 'Smart TVs' : category === 'chimney' ? 'Chimneys' : 'Dishwashers') : 'Appliances';

  return {
    componentType: resolvedList.length > 1 ? 'products' : 'products',
    title: resolvedList.length === 1 ? resolvedList[0].name : `Tatwa ${catTitle} Showcase`,
    subtitle: resolvedList.length === 1 ? resolvedList[0].highlight : `Showing ${resolvedList.length} verified Tatwa Electronics models`,
    products: resolvedList,
    images: resolvedList.map((p) => ({
      name: p.name,
      title: p.name,
      imageUrl: p.imageUrl,
      description: `Price: ₹${p.price.toLocaleString('en-IN')} (MRP: ₹${p.mrp.toLocaleString('en-IN')})`
    }))
  };
}

/**
 * Resolves a single user string or enum into a canonical Tatwa product
 */
function resolveSingleProduct(query, allProducts) {
  if (!query) return null;
  const upper = String(query).trim().toUpperCase();
  if (TATWA_PRODUCT_CATALOG[upper]) {
    return TATWA_PRODUCT_CATALOG[upper];
  }
  const q = String(query).toLowerCase().trim();

  // 1. Direct enumKey or id match
  for (const p of allProducts) {
    if (p.id.toLowerCase() === q || p.enumKey.toLowerCase() === q || p.sku.toLowerCase() === q) {
      return p;
    }
  }

  // 2. Direct name or modelName match
  for (const p of allProducts) {
    if (p.name.toLowerCase() === q || p.modelName.toLowerCase() === q) {
      return p;
    }
  }

  // 3. Numbered aliases (Chimney 1, 2, 3; Dishwasher 1, 2; Washing Machine 1, 2, 3, 4; TV 1, 2, 3)
  if (q.includes('chimney 1') || q === 'c1' || q.includes('aero 60') || q.includes('60 cm') || q.includes('60cm')) return TATWA_PRODUCT_CATALOG.AERO_60;
  if (q.includes('chimney 2') || q === 'c2' || q.includes('aero 75') || q.includes('75 cm') || q.includes('75cm')) return TATWA_PRODUCT_CATALOG.AERO_75;
  if (q.includes('chimney 3') || q === 'c3' || q.includes('aero 90') || q.includes('90 cm') || q.includes('90cm')) return TATWA_PRODUCT_CATALOG.AERO_90;

  if (q.includes('dishwasher 1') || q.includes('built-in') || q.includes('integrated') || q.includes('fbid')) return TATWA_PRODUCT_CATALOG.FBID_8PR_14S;
  if (q.includes('dishwasher 2') || q.includes('semi-integrated') || q.includes('fsid')) return TATWA_PRODUCT_CATALOG.FSID_8PR_14S;
  if (q.includes('ffsd 7pr') || q.includes('7pr') || (q.includes('34%') && q.includes('dish'))) return TATWA_PRODUCT_CATALOG.FFSD_7PR_14S_BK;
  if (q.includes('digital') && q.includes('dish')) return TATWA_PRODUCT_CATALOG.FFSD_6PR_14S_BK_DIGITAL;
  if (q.includes('neo black') || q.includes('29999')) return TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_BK;
  if (q.includes('neo inox')) return TATWA_PRODUCT_CATALOG.FFSD_6PR_12S_NEO_INOX;
  if (q.includes('ace black') || q.includes('26750')) return TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_BLACK;
  if (q.includes('ace inox')) return TATWA_PRODUCT_CATALOG.FFSD_6PR_8S_ACE_INOX;

  if (q.includes('washing machine 1') || q.includes('front load') || q.includes('ecowash') || q.includes('8 kg') || q.includes('8kg')) return TATWA_PRODUCT_CATALOG.WM_FL8_INV;
  if (q.includes('washing machine 2') || q.includes('top load') || q.includes('hydropulse') || q.includes('7.5 kg') || q.includes('7.5kg')) return TATWA_PRODUCT_CATALOG.WM_TL75_SMT;
  if (q.includes('washing machine 3') || q.includes('washer dryer') || q.includes('aerocare') || q.includes('combo') || q.includes('10 kg') || q.includes('10kg')) return TATWA_PRODUCT_CATALOG.WM_WD10_AI;
  if (q.includes('washing machine 4') || q.includes('semi automatic') || q.includes('twin tub') || q.includes('aquaspin') || q.includes('6.5 kg') || q.includes('6.5kg')) return TATWA_PRODUCT_CATALOG.WM_SA65_TT;

  if (q.includes('tv 1') || q.includes('qled') || q.includes('55 inch') || q.includes('55"') || q.includes('vision pro')) return TATWA_PRODUCT_CATALOG.TV_55_QLED;
  if (q.includes('tv 2') || q.includes('oled') || q.includes('65 inch') || q.includes('65"') || q.includes('crystalview')) return TATWA_PRODUCT_CATALOG.TV_65_OLED;
  if (q.includes('tv 3') || q.includes('43 inch') || q.includes('43"') || q.includes('frameless') || q.includes('nova')) return TATWA_PRODUCT_CATALOG.TV_43_UHD;

  // 4. Substring fallback
  for (const p of allProducts) {
    if (p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())) {
      return p;
    }
  }

  return null;
}
