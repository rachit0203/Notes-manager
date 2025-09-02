import express from 'express';
import { handleClerkWebhook } from '../controllers/webhookController';

const router = express.Router();

// Use express.raw() to get the raw body needed for signature verification
router.post('/clerk', express.raw({ type: 'application/json' }), handleClerkWebhook);

export default router;