import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

interface ChatHistoryItem {
	role: string;
	parts: string;
	[key: string]: any;
}

// Create a new chat
router.post('/chat', async (req, res) => {
	try {
		const { userId, history } = req.body;

		const chat = await prisma.chat.create({
			data: {
				userId,
				history: (history as unknown as Prisma.JsonValue) || Prisma.JsonNull,
			},
		});
		res.json(chat);
	} catch (error) {
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

// Update chat history
router.put('/chat/:chatId', async (req, res) => {
	try {
		const { chatId } = req.params;
		const { history } = req.body;

		const updatedChat = await prisma.chat.update({
			where: { id: chatId },
			data: {
				history: (history as unknown as Prisma.JsonValue) || Prisma.JsonNull,
			},
		});
		res.json(updatedChat);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update chat history' });
	}
});

// Get chat by ID
router.get('/chat/:chatId', async (req, res) => {
	try {
		const { chatId } = req.params;
		const chat = await prisma.chat.findUnique({
			where: { id: chatId },
		});
		res.json(chat);
	} catch (error) {
		res.status(500).json({ error: 'Chat not found' });
	}
});

export default router;
