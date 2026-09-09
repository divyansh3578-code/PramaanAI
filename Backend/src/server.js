const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');

async function start() {
  await connectDB();
  app.listen(port, () => console.log(`SIH backend running at http://localhost:${port}`));
}
start().catch(err => { console.error('Startup failed:', err); process.exit(1); });
