import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useUser } from './user-context';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'professor' | 'student';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useUser();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is not authenticated
    if (!isLoading && !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to access this page',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // If requiredRole is specified, check if user has that role
    if (!isLoading && user && requiredRole && user.role !== requiredRole) {
      toast({
        title: 'Access Denied',
        description: `You need ${requiredRole} privileges to access this page`,
        variant: 'destructive',
      });
      // Redirect to appropriate dashboard based on user role
      navigate(user.role === 'professor' ? '/professor/dashboard' : '/student/dashboard');
    }
  }, [user, isLoading, requiredRole, navigate, toast]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth required message if not logged in
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="p-8 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Authentication Required</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Please log in to access this page.
          </p>
          <Button onClick={() => navigate('/auth')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // User is authenticated and has the required role, show children
  return <>{children}</>;
}