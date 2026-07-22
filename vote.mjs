import { getStore } from '@netlify/blobs';

// Start from zero. Real votes accumulate from the first play onward.
const SEED = {
  Intake:     { a: 0, b: 0 },
  Triage:     { a: 0, b: 0 },
  Automation: { a: 0, b: 0 },
  Contracts:  { a: 0, b: 0 },
  Visibility: { a: 0, b: 0 },
};
const PILLARS = Object.keys(SEED);

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-store',
  },
});

export default async (req) => {
  if (req.method === 'OPTIONS') return json({});

  const store = getStore('legal-trolley-votes');

  // GET → return every pillar's current totals (for preloading if wanted)
  if (req.method === 'GET') {
    const out = {};
    for (const p of PILLARS) {
      const saved = await store.get(p, { type: 'json' });
      out[p] = saved || SEED[p];
    }
    return json(out);
  }

  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch { return json({ error: 'bad json' }, 400); }
    const { pillar, choice } = body || {};
    if (!PILLARS.includes(pillar) || (choice !== 'a' && choice !== 'b')) {
      return json({ error: 'invalid pillar or choice' }, 400);
    }
    const current = (await store.get(pillar, { type: 'json' })) || { ...SEED[pillar] };
    current[choice] = (current[choice] || 0) + 1;
    await store.setJSON(pillar, current);
    return json({ pillar, a: current.a, b: current.b });
  }

  return json({ error: 'method not allowed' }, 405);
};
