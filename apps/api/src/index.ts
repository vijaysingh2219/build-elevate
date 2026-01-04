import dotenv from 'dotenv';

const envFile =
  process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
      ? '.env.test'
      : '.env.local';

dotenv.config({ path: [envFile, '.env'] });

import { createServer } from './server';

const PORT = process.env.PORT || 4000;

// Create Express app
const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
