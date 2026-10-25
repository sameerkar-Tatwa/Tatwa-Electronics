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
  }
];

// Runner
async function runTestSuite() {
  console.log('===============================================================');
  console.log(`⚡ RUNNING TATWA ELECTRONICS TEST SUITE (15 TEST CASES)`);
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
