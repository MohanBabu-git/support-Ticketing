import { LayoutDashboard, Ticket, Users, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

function Sidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (isMobile && !isOpen) return null;

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'My Tickets',
      href: '/tickets',
      icon: Ticket,
    },
  ];
  
  if (user.isAdmin) {
    navItems.push({
      name: 'All Tickets',
      href: '/admin',
      icon: Users,
    });
  }
  
  navItems.push({
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  });

  return (
    <div
      className={`${
        isMobile
          ? 'fixed inset-0 z-40 flex md:hidden'
          : 'hidden md:flex md:flex-shrink-0'
      }`}
    >
      {/* Overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-neutral-600 bg-opacity-75"
          aria-hidden="true"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`${
          isMobile
            ? 'relative flex-1 flex flex-col max-w-xs w-full bg-primary-700'
            : 'flex flex-col w-64 bg-primary-700'
        }`}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        {/* Sidebar content */}
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 flex items-center px-4">
            <span className="text-xl font-bold text-white">Support Center</span>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-primary-800 text-white'
                      : 'text-primary-100 hover:bg-primary-600'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-white' : 'text-primary-300 group-hover:text-white'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* User profile */}
        <div className="flex-shrink-0 flex border-t border-primary-800 p-4">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div>
                {user.avatar ? (
                  <img className="h-9 w-9 rounded-full\" src={user.avatar} alt={user.name} />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    <Users className="h-5 w-5" />
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">{user.name}</p>
                <p className="text-sm font-medium text-primary-200">
                  {user.isAdmin ? 'Support Agent' : 'User'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;