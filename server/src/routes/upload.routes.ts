import express, { Request, Response } from 'express';
import imagekit from '../utils/imagekit';

const router = express.Router();

router.get('/upload', async (req: Request, res: Response) => {
	try {
		const { signature, expire, token } = imagekit.getAuthenticationParameters();
		res.json({ signature, expire, token });
	} catch (error) {
		console.error('Error generating authentication parameters:', error);
		res.status(500).json({
			message: 'Failed to generate authentication parameters',
			error: (error as Error).message,
		});
	}
});

export default router;
