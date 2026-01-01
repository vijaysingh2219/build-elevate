import './loadEnv';

import { env } from './env';
import { createServer } from './server';

const PORT = env.PORT;

// Create Express app
const server = createServer();

server.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
