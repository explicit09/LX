import React from 'react';
import { Link, useLocation } from 'wouter';
import { useUser } from '@/lib/user-context';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  HelpCircle,
  Users,
  FileText,
  BarChart3,
  LogOut
} from 'lucide-react';

const SidebarNav = () => {
  const [location] = useLocation();
  const { user, clearUser } = useUser();
  
  const isActive = (path: string) => {
    return location.startsWith(path);
  };

  const professorNavItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/professor/dashboard' },
    { label: 'Courses', icon: <BookOpen className="h-5 w-5" />, path: '/professor/courses' },
    { label: 'Calendar', icon: <Calendar className="h-5 w-5" />, path: '/professor/calendar' },
    { label: 'Inbox', icon: <MessageSquare className="h-5 w-5" />, path: '/professor/inbox' },
    { label: 'Students', icon: <Users className="h-5 w-5" />, path: '/professor/students' },
    { label: 'Materials', icon: <FileText className="h-5 w-5" />, path: '/professor/materials' },
    { label: 'Reports', icon: <BarChart3 className="h-5 w-5" />, path: '/professor/reports' }
  ];

  const studentNavItems = [
    { label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/student/dashboard' },
    { label: 'Courses', icon: <BookOpen className="h-5 w-5" />, path: '/student/courses' },
    { label: 'Calendar', icon: <Calendar className="h-5 w-5" />, path: '/student/calendar' },
    { label: 'Inbox', icon: <MessageSquare className="h-5 w-5" />, path: '/student/inbox' },
    { label: 'Help', icon: <HelpCircle className="h-5 w-5" />, path: '/student/help' }
  ];

  const navItems = user?.role === 'professor' ? professorNavItems : studentNavItems;

  return (
    <div className="h-screen w-16 md:w-64 bg-red-700 text-white flex flex-col fixed left-0 top-0 z-10">
      {/* Logo/School Area */}
      <div className="p-4 border-b border-red-800 flex flex-col items-center">
        <div className="text-center mb-2">
          <img 
            src="https://www.iastate.edu/themes/custom/iastate_theme/logo.svg" 
            alt="School Logo" 
            className="h-12 mx-auto mb-3"
          />
          <div className="text-center">
            {user && (
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                  alt={user.name} 
                  className="w-12 h-12 rounded-full mx-auto border-2 border-white"
                />
                <span className="hidden md:block text-sm mt-2 font-medium">{user.name}</span>
                <span className="hidden md:block text-xs opacity-80">{user.role}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={`flex items-center py-3 px-4 ${
                  isActive(item.path) 
                    ? 'bg-red-800 text-white' 
                    : 'text-white hover:bg-red-800 transition-colors'
                }`}>
                  <span className="w-6">{item.icon}</span>
                  <span className="ml-3 hidden md:block">{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
          <li className="mt-8">
            <button 
              onClick={() => clearUser()}
              className="flex items-center py-2 px-4 w-full text-white hover:bg-red-800 transition-colors"
            >
              <span className="w-6"><LogOut className="h-5 w-5" /></span>
              <span className="ml-3 hidden md:block">Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* User Account Info */}
      <div className="p-4 border-t border-red-800 mt-auto">
        <div className="text-xs hidden md:block">
          <div className="font-medium">Account</div>
          <div className="opacity-80">LEARN-X Platform</div>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;