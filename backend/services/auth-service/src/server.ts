import 'dotenv/config';
import { createApp } from './app.js';

const app = createApp();
const port = Number(process.env.PORT || 5001);

app.listen(port, () => {
     console.log(`Auth service running on port ${port}`);
});