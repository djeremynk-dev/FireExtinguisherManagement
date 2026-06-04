import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5003);

app.listen(port, () => {
  console.log(`Extinguisher service running on port ${port}`);
});