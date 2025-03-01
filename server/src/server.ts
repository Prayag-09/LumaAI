import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';
import chatRoutes from './routes/chat.routes';
import uploadRoute from './routes/upload.routes';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', requireAuth(), uploadRoute);
app.use('/api', requireAuth(), chatRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
