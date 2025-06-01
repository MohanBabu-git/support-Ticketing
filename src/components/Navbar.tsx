import { Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

function Navbar({ onMenuClick }: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <nav className="relative z-10 flex-shrink-0 h-16 bg-white shadow">
      <div className="px-4 flex justify-between">
        <div className="flex items-center">
          <button
            type="button"
            className="md:hidden text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={onMenuClick}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-4 md:ml-0 flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-primary-600">
              Support Center
            </Link>
          </div>
        </div>

        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-neutral-600 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                {user.avatar ? (
                  <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                )}
                <span className="ml-2 hidden md:block">{user.name}</span>
              </button>
            </div>

            {userMenuOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <div className="block px-4 py-2 text-sm text-neutral-700 border-b border-neutral-100">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-neutral-500">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  role="menuitem"
                >
                  Your Profile
                </Link>
                <button
                  type="button"
                  className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                  role="menuitem"
                  onClick={logout}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;