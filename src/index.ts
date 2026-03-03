import './config/env.js';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 3001;

async function main() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`API base: http://localhost:${PORT}/api/v1`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
