import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5007);

app.listen(port, () => {
  console.log(`User service running on port ${port}`);
});