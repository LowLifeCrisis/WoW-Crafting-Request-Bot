// utils/blizzardApi.js
const axios = require('axios');
const qs    = require('qs');

let tokenCache = {
  accessToken: null,
  expiresAt:   0
};
// Sanity Check
console.log(
    'Blizzard API config:',
    'CLIENT_ID=', process.env.BNET_CLIENT_ID ? '[OK]' : '[MISSING]',
    'CLIENT_SECRET=', process.env.BNET_CLIENT_SECRET ? '[OK]' : '[MISSING]',
    'REGION=', process.env.BNET_REGION
  );
// Fetch (and cache) an OAuth token
async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const resp = await axios.post(
    `https://${process.env.BNET_REGION}.battle.net/oauth/token`,
    qs.stringify({ grant_type: 'client_credentials' }),
    {
      auth: {
        username: process.env.BNET_CLIENT_ID,
        password: process.env.BNET_CLIENT_SECRET
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  tokenCache.accessToken = resp.data.access_token;
  // Subtract 60s so we refresh just before expiry
  tokenCache.expiresAt   = Date.now() + (resp.data.expires_in - 60) * 1000;
  return tokenCache.accessToken;
}

// Search for an item by its English name
// utils/blizzardApi.js
async function searchItemByName(name) {
    const token = await getAccessToken();
    const base = `https://${process.env.BNET_REGION}.api.blizzard.com`;
    const qs   = new URLSearchParams({
      namespace: `static-${process.env.BNET_REGION}`,
      'name.en_US': name,
      page:         '1',
      pageSize:    '1',
      orderBy:     'id',
      locale:      'en_US',
      access_token: token
    });
    const url = `${base}/data/wow/search/item?${qs.toString()}`;
  
    console.log('🔍 WoW API search URL:', url);
    const res = await axios.get(url);
    return res.data.results?.[0]?.data || null;
  }
  
module.exports = { searchItemByName };

