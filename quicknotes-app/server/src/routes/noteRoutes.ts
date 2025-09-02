import express from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/noteController';
import { clerkAuthMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes in this file are protected by the clerkAuthMiddleware
router.use(clerkAuthMiddleware);

router.route('/').get(getNotes).post(createNote);
router.route('/:noteId').delete(deleteNote);

export default router;