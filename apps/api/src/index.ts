import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

import { createServer } from './server';

const PORT = process.env.PORT || 4000;

// Create Express app
const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
