// server/src/controllers/noteController.ts
import { Request, Response } from 'express';
import Note from '../models/noteModel';
import User from '../models/userModel';
import { clerkClient } from '@clerk/clerk-sdk-node'; // Corrected import
import { IUser } from '../models/userModel';

// This interface helps TypeScript understand the custom `auth` property
interface AuthenticatedRequest extends Request {
  auth?: { userId: string; };
}

/**
 * Finds a user in the local DB by their Clerk ID. If not found, it fetches
 * the user data from Clerk's API and creates a new user in the local DB.
 * This is a "just-in-time" user provisioning strategy.
 */
const getOrCreateUser = async (clerkId: string): Promise<IUser> => {
  console.log(`getOrCreateUser called for clerkId: ${clerkId}`);
  // Find the user in your local database by their Clerk ID
  let localUser = await User.findOne({ clerkId });

  // If the user doesn't exist in your local DB, create them
  if (!localUser) {
    console.log('Local user not found. Attempting to create just-in-time...');
    try {
      // Fetch the full user object from the Clerk API
      const clerkUser = await clerkClient.users.getUser(clerkId);
      console.log('Fetched user data from Clerk API:', JSON.stringify(clerkUser, null, 2));
      
      // Create a new user document
      localUser = new User({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        username: clerkUser.username,
        photo: clerkUser.imageUrl,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      });
      
      // Save the new user to your database
      await localUser.save();
      console.log(`✅ JIT SUCCESS: User ${localUser.email} created in DB.`);
    } catch (error) {
      console.error('JIT MONGO SAVE ERROR:', error);
      // If user creation fails, we cannot proceed.
      throw new Error('Failed to create user from Clerk data.');
    }
  } else {
    console.log('Found existing local user.');
  }

  // Return the local user object (either found or newly created)
  return localUser;
};

// --- CRUD Operations for Notes ---

// GET /api/notes - Fetches all notes for the authenticated user
export const getNotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const clerkId = req.auth.userId;
    const user = await getOrCreateUser(clerkId);

    // Find all notes that belong to this user using their MongoDB _id
    const notes = await Note.find({ userId: user._id }).sort({ createdAt: -1 });
    
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error in getNotes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  } 
};

// POST /api/notes - Creates a new note for the authenticated user
export const createNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Note content cannot be empty' });
    }

    const user = await getOrCreateUser(clerkId);

    const newNote = new Note({
      userId: user._id, // Use the MongoDB _id of the user
      content: content,
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error in createNote:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
};

// DELETE /api/notes/:noteId - Deletes a specific note for the authenticated user
export const deleteNote = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const clerkId = req.auth.userId;
    const { noteId } = req.params;

    const user = await getOrCreateUser(clerkId);

    // Find the note by its ID
    const note = await Note.findById(noteId);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the note belongs to the authenticated user
    if (note.userId.toString() !== user._id.toString()) {
      // Security check: prevent users from deleting others' notes
      return res.status(403).json({ message: 'Unauthorized to delete this note' });
    }

    // If all checks pass, delete the note
    await note.deleteOne(); // Use deleteOne() on the document

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in deleteNote:', error);
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};