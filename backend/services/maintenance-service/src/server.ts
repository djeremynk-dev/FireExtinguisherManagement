import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5005);

app.listen(port, () => {
  console.log(`Maintenance service running on port ${port}`);
});