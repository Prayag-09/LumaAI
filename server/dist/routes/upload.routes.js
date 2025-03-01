"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const router = express_1.default.Router();
router.get('/upload', async (req, res) => {
    try {
        const { signature, expire, token } = imagekit_1.default.getAuthenticationParameters();
        res.json({ signature, expire, token });
    }
    catch (error) {
        console.error('Error generating authentication parameters:', error);
        res.status(500).json({
            message: 'Failed to generate authentication parameters',
            error: error.message,
        });
    }
});
exports.default = router;
