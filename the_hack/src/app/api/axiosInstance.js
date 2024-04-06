import axios from 'axios';

export default axios.create({
  url: process.env.AIGCC_ASSET_API_URL,
  headers: {
    api_key: process.env.ASSET_SERVICE_KEY,
  },
});
