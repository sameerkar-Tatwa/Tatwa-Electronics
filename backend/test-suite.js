/**
 * ============================================================================
 * TATWA ELECTRONICS - AUTOMATED TEST SUITE FOR /api/tool & APPLIANCE CATALOG
 * ============================================================================
 *
 * Validates:
 * 1. Single string inputs, arrays, comma-delimited strings, stringified JSON arrays
 * 2. Natural language queries in Hindi and English
 * 3. Chimneys (3 models), Dishwashers (10 models), Washing Machines (4 models), Smart TVs (3 models)
 * 4. Side-by-side comparisons, price/budget filters, promotional offers
 * 5. Interactive guides (Chimney installation, Auto-clean, Washing machine fabric care, TV calibration)
 */

import http from 'http';

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Helper: Make HTTP Request
function sendRequest({ method = 'POST', path = '/api/tool', headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const tests = [
  {
    id: 'TC-01',
    name: 'Standard Single Product String',
    description: 'LLM outputs a single product string in body.product',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { product: 'chimney 1' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedImages.length === 1 &&
        res.body.displayedProducts[0].name === 'Tatwa Aero BLDC 60 cm' &&
        res.body.displayedProducts[0].sku === 'TE-CH-601-BLDC';
    }
  },
  {
    id: 'TC-02',
    name: 'Multiple Products Array (Comparison)',
    description: 'LLM outputs an array of strings in body.products',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { products: ['dishwasher 1', 'dishwasher 2'] }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedImages.length === 2 &&
        res.body.displayedProducts.some(p => p.sku === 'TE-DW-141-INT') &&
        res.body.displayedProducts.some(p => p.sku === 'TE-DW-142-SEMI');
    }
  },
  {
    id: 'TC-03',
    name: 'Oration Stringified JSON Array (body.product_enums)',
    description: 'Oration template strings the array as: "[\"chimney 1\", \"chimney 2\"]"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { product_enums: '["chimney 1", "chimney 2"]' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedImages.length === 2 &&
        res.body.displayedProducts[0].name === 'Tatwa Aero BLDC 60 cm' &&
        res.body.displayedProducts[1].name === 'Tatwa Aero BLDC 75 cm';
    }
  },
  {
    id: 'TC-04',
    name: 'Comma-Separated String in Single Key',
    description: 'LLM outputs a comma-delimited string: "dishwasher 1, chimney 2"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { product: 'dishwasher 1, chimney 2' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedImages.length === 2 &&
        res.body.displayedProducts.some(p => p.category === 'dishwasher') &&
        res.body.displayedProducts.some(p => p.category === 'chimney');
    }
  },
  {
    id: 'TC-05',
    name: 'Washing Machine Category & Numbered Alias',
    description: 'LLM outputs "washing machine 1" for front load inverter washer',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { product: 'washing machine 1' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedProducts.length === 1 &&
        res.body.displayedProducts[0].sku === 'TE-WM-FL801-INV' &&
        res.body.displayedProducts[0].category === 'washing_machine';
    }
  },
  {
    id: 'TC-06',
    name: 'Smart TV Category & QLED Alias',
    description: 'LLM outputs "tv 1" for 55 inch QLED Google TV',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { product: 'tv 1' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedProducts.length === 1 &&
        res.body.displayedProducts[0].sku === 'TE-TV-551-QLED' &&
        res.body.displayedProducts[0].category === 'tv';
    }
  },
  {
    id: 'TC-07',
    name: 'Natural Language Hindi Query with Budget Filter',
    description: 'Natural speech query: "30,000 के अंदर वाशिंग मशीन"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: '30,000 के अंदर वाशिंग मशीन' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedProducts.length > 0 &&
        res.body.displayedProducts.every(p => p.price <= 30000 && p.category === 'washing_machine');
    }
  },
  {
    id: 'TC-08',
    name: 'Natural Language TV Comparison',
    description: 'Natural speech query: "तीनों टीवी कंपेयर करें"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: 'तीनों टीवी कंपेयर करें' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 3 &&
        res.body.displayedProducts.every(p => p.category === 'tv');
    }
  },
  {
    id: 'TC-09',
    name: 'Chimney Installation Blueprint Trigger',
    description: 'Action trigger: "installation"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { action: 'installation' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'chimney-installation';
    }
  },
  {
    id: 'TC-10',
    name: 'Washing Machine Fabric Care Guide',
    description: 'Action trigger: "washing_machine_guide"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { action: 'washing_machine_guide' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'washing-machine-guide';
    }
  },
  {
    id: 'TC-11',
    name: 'Smart TV Display Calibration Guide',
    description: 'Action trigger: "tv_display_guide"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { action: 'tv_display_guide' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'tv-display-guide';
    }
  },
  {
    id: 'TC-12',
    name: 'Promotional Offers Showcase Across Categories',
    description: 'Action trigger: "show_offers"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { action: 'show_offers' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'offers' &&
        res.body.displayedProducts.length >= 4;
    }
  },
  {
    id: 'TC-13',
    name: 'Welcome Screen Action Trigger',
    description: 'Action trigger: "welcome"',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { action: 'welcome' }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'welcome';
    }
  },
  {
    id: 'TC-14',
    name: 'Full 20-Product Catalog Endpoint GET /api/products',
    description: 'Verifies all 20 appliances across all 4 categories',
    request: {
      method: 'GET',
      path: '/api/products'
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.totalCount === 20 &&
        res.body.products.length === 20 &&
        res.body.categories.includes('washing_machine') &&
        res.body.categories.includes('tv');
    }
  },
  {
    id: 'TC-15',
    name: 'Health Check Endpoint GET /api/health',
    description: 'Verifies backend health and brand identifier',
    request: {
      method: 'GET',
      path: '/api/health'
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.status === 'ok' &&
        res.body.brand === 'Tatwa Electronics' &&
        res.body.productCount === 20;
    }
  },
  {
    id: 'TC-16',
    name: 'display_tatwa_products with display_mode: comparison',
    description: 'Verifies exact agent tool call format with product_enums & display_mode',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: {
        tool: 'display_tatwa_products',
        display_mode: 'comparison',
        product_enums: ['CHIMNEY_AERO_BLDC_60', 'CHIMNEY_AERO_BLDC_75']
      }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 2 &&
        res.body.displayedProducts[0].name === 'Tatwa Aero BLDC 60 cm' &&
        res.body.displayedProducts[1].name === 'Tatwa Aero BLDC 75 cm';
    }
  },
  {
    id: 'TC-17',
    name: 'display_tatwa_products Washing Machine Sequence',
    description: 'Verifies all 4 washing machine enums in sequence display mode',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: {
        tool: 'display_tatwa_products',
        display_mode: 'sequence',
        product_enums: ['WM_ECOWASH_FL8_INV', 'WM_HYDROPULSE_TL75_SMT', 'WM_AEROCARE_WD10_AI', 'WM_AQUASPIN_SA65_TT']
      }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.displayedProducts.length === 4 &&
        res.body.displayedProducts.every(p => p.category === 'washing_machine');
    }
  },
  {
    id: 'TC-18',
    name: 'display_tatwa_products Smart TVs Comparison',
    description: 'Verifies side-by-side comparison of 3 Smart TVs using official enums',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: {
        tool: 'display_tatwa_products',
        display_mode: 'comparison',
        product_enums: ['TV_VISION_55_QLED', 'TV_CRYSTALVIEW_65_OLED', 'TV_NOVA_43_UHD']
      }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 3 &&
        res.body.displayedProducts.every(p => p.category === 'tv');
    }
  },
  {
    id: 'TC-19',
    name: 'Voice query "TV\'s" category showcase',
    description: 'User says "TV\'s" or "Tell me about TVs", resolving to 3 verified Tatwa Smart TVs',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "TV's" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'products' &&
        res.body.displayedProducts.length === 3 &&
        res.body.displayedProducts.every(p => p.category === 'tv');
    }
  },
  {
    id: 'TC-20',
    name: 'Voice query "comparison between the TV\'s"',
    description: 'User asks for comparison between TVs using apostrophe query',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "comparison between the TV's" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 3 &&
        res.body.displayedProducts.every(p => p.category === 'tv');
    }
  },
  {
    id: 'TC-21',
    name: 'Voice query "comparison between the washing machines"',
    description: 'Natural language comparison for washing machines',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "comparison between the washing machines" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length >= 2 &&
        res.body.displayedProducts.every(p => p.category === 'washing_machine');
    }
  },
  {
    id: 'TC-22',
    name: 'Voice query "comparison between the chimneys"',
    description: 'Natural language comparison for chimneys',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "comparison between the chimneys" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 3 &&
        res.body.displayedProducts.every(p => p.category === 'chimney');
    }
  },
  {
    id: 'TC-23',
    name: 'Voice query "Tell me about dishwashers" (Disambiguation)',
    description: 'Ensures dishwashers query never false-matches washing machine',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "Tell me about dishwashers" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'products' &&
        res.body.displayedProducts.length >= 2 &&
        res.body.displayedProducts.every(p => p.category === 'dishwasher');
    }
  },
  {
    id: 'TC-24',
    name: 'Query "Compare TV 1 and TV 2" (Specific Models)',
    description: 'Extracts exact TV 1 and TV 2 models from text for side-by-side matrix',
    request: {
      method: 'POST',
      path: '/api/tool',
      body: { query: "Compare TV 1 and TV 2" }
    },
    validate: (res) => {
      return res.status === 200 &&
        res.body.componentType === 'comparison' &&
        res.body.displayedProducts.length === 2 &&
        res.body.displayedProducts[0].sku === 'TE-TV-551-QLED' &&
        res.body.displayedProducts[1].sku === 'TE-TV-651-OLED';
    }
  }
];

// Runner
async function runTestSuite() {
  console.log('===============================================================');
  console.log(`⚡ RUNNING TATWA ELECTRONICS TEST SUITE (24 TEST CASES)`);
  console.log(`Target: ${BASE_URL}`);
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const res = await sendRequest(test.request);
      const isOk = test.validate(res);

      if (isOk) {
        console.log(`✅ [${test.id}] ${test.name} - PASSED`);
        passed++;
      } else {
        console.error(`❌ [${test.id}] ${test.name} - FAILED`);
        console.error(`   Status: ${res.status}`);
        console.error(`   Response: ${JSON.stringify(res.body || res.raw)}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [${test.id}] ${test.name} - ERROR:`, err.message);
      failed++;
    }
  }

  console.log('\n===============================================================');
  console.log(`TEST RESULTS: ${passed} PASSED / ${failed} FAILED (${passed + failed} TOTAL)`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite();
