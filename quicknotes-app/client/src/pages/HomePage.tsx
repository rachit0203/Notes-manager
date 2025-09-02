import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const HomePage = () => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
      <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4">
        Welcome to QuickNotes
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl">
        The simplest way to capture your thoughts, ideas, and reminders. Sign in to start creating your notes instantly.
      </p>
      <SignedOut>
        <Link
          to="/sign-up"
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Get Started for Free
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          to="/dashboard"
          className="px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Go to Your Dashboard
        </Link>
      </SignedIn>
    </div>
  );
};

export default HomePage;