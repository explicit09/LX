import React from 'react';
import { Link, useLocation } from 'wouter';
import { useUser } from '@/lib/user-context';
import { 
  Settings,
  Bell,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    path: string;
  }>;
}

const TopNav: React.FC<TopNavProps> = ({ 
  title = 'Dashboard',
  breadcrumbs = []
}) => {
  const { user, clearUser } = useUser();
  const [, setLocation] = useLocation();
  
  const handleLogout = async () => {
    await clearUser();
    setLocation('/auth');
  };

  return (
    <div className="fixed top-0 left-16 md:left-64 right-0 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10 flex items-center justify-between px-4 md:px-8">
      {/* Left side: Title & Breadcrumbs */}
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-neutral-800 dark:text-white">{title}</h1>
        
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="hidden md:flex items-center ml-4">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.path}>
                {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />}
                <Link href={crumb.path}>
                  <a className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200">
                    {crumb.label}
                  </a>
                </Link>
              </React.Fragment>
            ))}
            <ChevronRight className="h-4 w-4 mx-2 text-neutral-400" />
            <span className="text-sm text-neutral-800 dark:text-neutral-200">{title}</span>
          </div>
        )}
      </div>
      
      {/* Right side: User menu */}
      <div className="flex items-center space-x-4">
        <button className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-white">
          <Bell className="h-5 w-5" />
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="relative">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                  alt={user?.name || 'User'} 
                  className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-700"
                />
              </div>
              <span className="hidden md:block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                {user?.name || 'User'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopNav;