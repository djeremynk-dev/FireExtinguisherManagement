import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5004);

app.listen(port, () => {
  console.log(`Inspection service running on port ${port}`);
});