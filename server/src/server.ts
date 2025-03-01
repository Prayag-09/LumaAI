import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requireAuth } from '@clerk/express';
import chatRoutes from './routes/chat.routes';
import uploadRoute from './routes/upload.routes';

dotenv.config();
const app = express();
const port = process.env.PORT;
const corsOptions = {
	origin: '*',
	credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', requireAuth(), uploadRoute);
app.use('/api', requireAuth(), chatRoutes);

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
