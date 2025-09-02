import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { NotebookText } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-800">
          <NotebookText className="text-indigo-600" />
          QuickNotes
        </Link>
        <nav className="flex items-center gap-4">
          <SignedIn>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`
              }
            >
              Dashboard
            </NavLink>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/sign-in" className="text-sm font-medium text-slate-600 hover:text-indigo-600">
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Sign Up
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};

export default Header;