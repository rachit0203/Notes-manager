import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  // We change userId from a string to a reference to the User model
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const NoteSchema: Schema = new Schema({
  // This now stores the MongoDB _id of the user, not the Clerk ID string
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<INote>('Note', NoteSchema);