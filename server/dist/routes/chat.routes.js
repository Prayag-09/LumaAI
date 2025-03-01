"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@clerk/express");
const prisma_1 = __importDefault(require("../prisma"));
const router = express_1.default.Router();
// Create a new chat
router.post('/chats', (0, express_2.requireAuth)(), async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { history } = req.body;
        if (!history || !Array.isArray(history)) {
            return res
                .status(400)
                .json({ message: 'Chat history is required and must be an array' });
        }
        const chat = await prisma_1.default.chat.create({
            data: {
                userId: req.auth.userId,
                history,
            },
        });
        return res.status(201).json(chat);
    }
    catch (error) {
        console.error('Error creating chat:', error);
        return res.status(500).json({ message: 'Unable to create chat' });
    }
});
// Get all chats for a user
router.get('/userchats', (0, express_2.requireAuth)(), async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const chats = await prisma_1.default.chat.findMany({
            where: { userId: req.auth.userId },
        });
        const chatsWithTitles = chats.map((chat) => ({
            id: chat.id,
            title: chat.history && Array.isArray(chat.history) && chat.history.length > 0
                ? chat.history[0].parts[0].text.slice(0, 30)
                : 'Untitled Chat',
            history: chat.history,
            userId: chat.userId,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
        }));
        return res.json(chatsWithTitles);
    }
    catch (error) {
        console.error('Error fetching chats:', error);
        return res.status(500).json({ message: 'Unable to fetch chats' });
    }
});
// Get a specific chat by ID
router.get('/chats/:id', (0, express_2.requireAuth)(), async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const chat = await prisma_1.default.chat.findFirst({
            where: {
                userId: req.auth.userId,
                id: req.params.id,
            },
        });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        return res.json(chat);
    }
    catch (error) {
        console.error('Error fetching chat:', error);
        return res.status(500).json({ message: 'Error fetching the chat' });
    }
});
// Update a chat
router.put('/chats/:id', (0, express_2.requireAuth)(), async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { question, answer, img } = req.body;
        // Require at least question or answer
        if (!question?.trim() && !answer?.trim()) {
            return res.status(400).json({ message: 'Question or answer required' });
        }
        const chat = await prisma_1.default.chat.findUnique({
            where: { id: req.params.id },
        });
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        // Build new history items
        const newItems = [];
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
        const updatedChat = await prisma_1.default.chat.update({
            where: { id: req.params.id },
            data: {
                history: [...chat.history, ...newItems],
            },
        });
        return res.status(200).json(updatedChat);
    }
    catch (error) {
        console.error('Error updating chat:', error);
        return res.status(500).json({ message: 'Unable to update chat' });
    }
});
exports.default = router;
