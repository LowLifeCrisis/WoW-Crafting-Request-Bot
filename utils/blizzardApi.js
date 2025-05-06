// utils/blizzardApi.js
require('dotenv').config();             // ensure .env is loaded
const axios = require('axios');
const qs    = require('qs');

let tokenCache = {
  accessToken: null,
  expiresAt:   0
};

// Sanity check .env
console.log(
  'Blizzard API config:',
  'CLIENT_ID=', process.env.BNET_CLIENT_ID ? '[OK]' : '[MISSING]',
  'CLIENT_SECRET=', process.env.BNET_CLIENT_SECRET ? '[OK]' : '[MISSING]',
  'REGION=', process.env.BNET_REGION
);

async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }
  const resp = await axios.post(
    `https://${process.env.BNET_REGION.toLowerCase()}.battle.net/oauth/token`,
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
  tokenCache.expiresAt   = Date.now() + (resp.data.expires_in - 60) * 1000;
  return tokenCache.accessToken;
}

async function searchItemByName(name) {
  const token  = await getAccessToken();
  const region = process.env.BNET_REGION.toLowerCase(); // e.g. "us"

  // Build the querystring
  const params = new URLSearchParams({
    namespace:    `static-${region}`,
    'name.en_US': name,
    page:         '1',
    pageSize:     '1',
    orderBy:      'id',
    locale:       'en_US'
  });

  const url = `https://${region}.api.blizzard.com/data/wow/search/item?${params.toString()}`;
  console.log('🔍 WoW API search URL:', url);

  // Pass the token in the header, not in the URL
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data.results?.[0]?.data || null;
}

module.exports = { searchItemByName };

