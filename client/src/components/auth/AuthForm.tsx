import React, { useState } from 'react';
import { useLocation, useNavigate } from 'wouter';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/lib/user-context";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Login schema
const loginSchema = z.object({
  username: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["professor", "student"]),
});

// Register schema extends login schema with additional fields
const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Full name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  onLogin?: (username: string, password: string) => Promise<void>;
  onRegister?: (username: string, email: string, password: string, role: 'professor' | 'student') => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onLogin,
  onRegister,
  isLoading = false,
  error
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { setUser } = useUser();
  
  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'professor' | 'student'>('student');
  
  // Form validation states
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  
  // Check if the URL has a role query parameter
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'professor' || roleParam === 'student') {
      setRole(roleParam);
      setIsLoginMode(false);
    }
  }, []);
  
  // Validate form
  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    // Username validation
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    // Email validation (registration only)
    if (!isLoginMode) {
      if (!email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email is invalid';
      }
    }
    
    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password (registration only)
    if (!isLoginMode && password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (isLoginMode && onLogin) {
        await onLogin(username, password);
      } else if (!isLoginMode && onRegister) {
        await onRegister(username, email, password, role);
      }
    } catch (err) {
      console.error('Authentication error:', err);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 inline-block">
            LINK-X
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            {isLoginMode ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>
        
        {/* Auth card */}
        <div className="card shadow-lg border border-neutral-200 dark:border-neutral-800">
          {/* Auth tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800">
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                isLoginMode
                  ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-700 dark:hover:text-primary-400'
              }`}
              onClick={() => setIsLoginMode(true)}
              disabled={isLoading}
            >
              Log In
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                !isLoginMode
                  ? 'text-primary-700 dark:text-primary-400 border-b-2 border-primary-500'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-700 dark:hover:text-primary-400'
              }`}
              onClick={() => setIsLoginMode(false)}
              disabled={isLoading}
            >
              Register
            </button>
          </div>
          
          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Username field */}
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`input ${formErrors.username ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="Your username"
                  disabled={isLoading}
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.username}</p>
                )}
              </div>
              
              {/* Email field (registration only) */}
              {!isLoginMode && (
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`input ${formErrors.email ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Your email address"
                    disabled={isLoading}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                  )}
                </div>
              )}
              
              {/* Password field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input ${formErrors.password ? 'border-red-500 dark:border-red-400' : ''}`}
                  placeholder="Your password"
                  disabled={isLoading}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.password}</p>
                )}
              </div>
              
              {/* Confirm Password field (registration only) */}
              {!isLoginMode && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`input ${formErrors.confirmPassword ? 'border-red-500 dark:border-red-400' : ''}`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              {/* Role selection (registration only) */}
              {!isLoginMode && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    I am a:
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        checked={role === 'student'}
                        onChange={() => setRole('student')}
                        className="h-4 w-4 text-primary-600 dark:text-primary-500 border-neutral-300 dark:border-neutral-700 focus:ring-primary-500 dark:focus:ring-primary-400"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-neutral-700 dark:text-neutral-300">Student</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="role"
                        checked={role === 'professor'}
                        onChange={() => setRole('professor')}
                        className="h-4 w-4 text-primary-600 dark:text-primary-500 border-neutral-300 dark:border-neutral-700 focus:ring-primary-500 dark:focus:ring-primary-400"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-neutral-700 dark:text-neutral-300">Professor</span>
                    </label>
                  </div>
                </div>
              )}
              
              {/* Submit button */}
              <button
                type="submit"
                className="btn-primary w-full py-3 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLoginMode ? 'Log In' : 'Create Account'}
              </button>
              
              {/* Login helpers */}
              {isLoginMode && (
                <div className="mt-4 text-center">
                  <a href="#forgot-password" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                    Forgot your password?
                  </a>
                </div>
              )}
            </form>
          </div>
        </div>
        
        {/* Footer links */}
        <div className="mt-6 text-center text-sm text-neutral-600 dark:text-neutral-400">
          <div className="flex justify-center space-x-4">
            <a href="#terms" className="hover:text-primary-600 dark:hover:text-primary-400">Terms</a>
            <a href="#privacy" className="hover:text-primary-600 dark:hover:text-primary-400">Privacy</a>
            <a href="#help" className="hover:text-primary-600 dark:hover:text-primary-400">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
