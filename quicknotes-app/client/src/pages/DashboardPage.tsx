import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface Note {
  _id: string;
  content: string;
  createdAt: string;
}

const API_URL = 'http://localhost:5000/api/notes';

const DashboardPage = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = await getToken();
        const response = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(response.data);
      } catch (error) {
        toast.error('Failed to fetch notes.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [getToken]);

  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) {
        toast.warning('Note content cannot be empty.');
        return;
    }
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        API_URL,
        { content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes([response.data, ...notes]);
      setNewNote('');
      toast.success('Note created successfully!');
    } catch (error) {
      toast.error('Failed to create note.');
      console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleDeleteNote = async (noteId: string) => {
    const originalNotes = [...notes];
    setNotes(notes.filter(note => note._id !== noteId)); // Optimistic delete
    toast.success('Note deleted!');

    try {
        const token = await getToken();
        await axios.delete(`${API_URL}/${noteId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        toast.error('Failed to delete note. Restoring...');
        setNotes(originalNotes); // Revert on failure
        console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}! 👋</h1>
      <p className="text-slate-500 mb-8">Here are your notes. Create, view, and manage them all in one place.</p>

      {/* Create Note Form */}
      <form onSubmit={handleCreateNote} className="mb-8 bg-white p-6 rounded-lg shadow-sm">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          rows={4}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-6 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Plus size={18} />}
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {/* Notes List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Notes</h2>
        {isLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="bg-white p-5 rounded-lg shadow-sm flex flex-col justify-between">
                <p className="text-slate-700 mb-4 whitespace-pre-wrap">{note.content}</p>
                <div className="flex justify-between items-center text-sm text-slate-400">
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => handleDeleteNote(note._id)} className="p-2 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-slate-500">You don't have any notes yet.</p>
            <p className="text-slate-500">Use the form above to add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;