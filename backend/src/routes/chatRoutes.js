import express from 'express';
import { chatMessage } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatMessage);

export default router;