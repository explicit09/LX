import AuthForm from "@/components/auth/AuthForm";
import { useLocation } from "wouter";
import { useUser } from "@/lib/user-context";
import { useEffect } from "react";

const Auth = () => {
  const [, navigate] = useLocation();
  const { user, navigateToDashboard } = useUser();

  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      navigateToDashboard();
    }
  }, [user, navigateToDashboard]);

  const handleAuthSuccess = () => {
    // The user context will handle the redirect
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <AuthForm onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Auth;
