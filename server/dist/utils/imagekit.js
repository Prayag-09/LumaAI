"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const imagekit_1 = __importDefault(require("imagekit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { URL_ENDPOINT, PUBLIC_KEY, PRIVATE_KEY } = process.env;
if (!URL_ENDPOINT || !PUBLIC_KEY || !PRIVATE_KEY) {
    console.warn('Warning: Missing ImageKit configuration. Check environment variables.');
}
const imagekit = new imagekit_1.default({
    urlEndpoint: URL_ENDPOINT ?? '',
    publicKey: PUBLIC_KEY ?? '',
    privateKey: PRIVATE_KEY ?? '',
});
exports.default = imagekit;
