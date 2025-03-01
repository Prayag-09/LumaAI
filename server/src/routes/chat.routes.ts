import express from 'express';
import { Request, Response } from 'express';
import { requireAuth } from '@clerk/express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

interface AuthenticatedRequest extends Request {
	auth?: {
		userId: string;
	};
}

interface ChatHistoryItem {
	role: 'user' | 'model';
	parts: { text: string }[];
	img?: string;
}

router.post(
	'/chats',
	requireAuth(),
	async (req: AuthenticatedRequest, res: Response) => {
		if (!req.auth?.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { history } = req.body;
		if (!history || !Array.isArray(history)) {
			return res.status(400).json({
				success: false,
				message: 'Chat history is required and must be an array',
			});
		}

		const chat = await prisma.chat.create({
			data: {
				userId: req.auth.userId,
				history: JSON.stringify(history),
			},
		});

		return res.status(201).json({ success: true, data: chat });
	}
);

// GET /userchats - Fetch all chats for a user
router.get(
	'/userchats',
	requireAuth(),
	async (req: AuthenticatedRequest, res: Response) => {
		if (!req.auth?.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const chats = await prisma.chat.findMany({
			where: { userId: req.auth.userId },
			orderBy: { updatedAt: 'desc' },
		});

		const chatsWithTitles = chats.map((chat : any) => {
			const history = (JSON.parse(chat.history as unknown as string) as ChatHistoryItem[]) || [];
			return {
				id: chat.id,
				title:
					history.length > 0 && history[0]?.parts?.[0]?.text
						? history[0].parts[0].text.slice(0, 30)
						: 'Untitled Chat',
				history,
				userId: chat.userId,
				createdAt: chat.createdAt,
				updatedAt: chat.updatedAt,
			};
		});

		return res.json({ success: true, data: chatsWithTitles });
	}
);

router.get(
	'/chats/:id',
	requireAuth(),
	async (req: AuthenticatedRequest, res: Response) => {
		if (!req.auth?.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const chat = await prisma.chat.findFirst({
			where: {
				userId: req.auth.userId,
				id: req.params.id,
			},
		});

		if (!chat) {
			return res
				.status(404)
				.json({ success: false, message: 'Chat not found' });
		}

		return res.json({ success: true, data: chat });
	}
);

router.put(
	'/chats/:id',
	requireAuth(),
	async (req: AuthenticatedRequest, res: Response) => {
		if (!req.auth?.userId) {
			return res.status(401).json({ success: false, message: 'Unauthorized' });
		}

		const { question, answer, img } = req.body;
		if (!question?.trim() && !answer?.trim()) {
			return res.status(400).json({
				success: false,
				message: 'Question or answer required',
			});
		}

		const chat = await prisma.chat.findFirst({
			where: {
				id: req.params.id,
				userId: req.auth.userId,
			},
		});

		if (!chat) {
			return res
				.status(404)
				.json({ success: false, message: 'Chat not found' });
		}

		const currentHistory = (JSON.parse(chat.history as string) as ChatHistoryItem[]) || [];
		const newItems: ChatHistoryItem[] = [];
		if (question?.trim()) {
			newItems.push({
				role: 'user',
				parts: [{ text: question.trim() }],
				...(img && { img }),
			});
		}
		if (answer?.trim()) {
			newItems.push({
				role: 'model',
				parts: [{ text: answer.trim() }],
			});
		}

		const updatedChat = await prisma.chat.update({
			where: { id: req.params.id },
			data: {
				history: JSON.stringify([...currentHistory, ...newItems]),
			},
		});

		return res.status(200).json({ success: true, data: updatedChat });
	}
);

export default router;
