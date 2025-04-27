import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useUser } from "@/lib/user-context";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SimpleAuth() {
  const [, navigate] = useLocation();
  const { user, setUser, navigateToDashboard } = useUser();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    name: "",
    role: "professor" as "professor" | "student"
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle role change
  const handleRoleChange = (value: "professor" | "student") => {
    setFormState(prev => ({ ...prev, role: value }));
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.username || !formState.password) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Attempting login with:", formState.username);
      
      // Test credentials directly instead of using role selection
      // tmbuwa09@gmail.com is registered as a professor
      const loginData = {
        username: formState.username,
        password: formState.password
      };
      
      console.log("Sending login request with data:", loginData);
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
        credentials: "include"
      });
      
      console.log("Login response status:", response.status, response.statusText);
      
      if (!response.ok) {
        // Handle non-200 responses
        const errorText = await response.text();
        console.error("Login error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Login failed");
        } catch (e) {
          throw new Error("Login failed: " + response.statusText);
        }
      }
      
      const userData = await response.json();
      console.log("Login successful, user data:", userData);
      
      // Update global user state
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name || "user"}!`,
      });
      
      // Use navigateToDashboard from user context
      navigateToDashboard();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.username || !formState.password) {
      toast({
        title: "Required fields missing",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log("Attempting registration with:", formState.username);
      
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name,
          username: formState.username,
          password: formState.password,
          role: formState.role
        }),
        credentials: "include"
      });
      
      console.log("Registration response status:", response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Registration error response:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Registration failed");
        } catch (e) {
          throw new Error("Registration failed: " + response.statusText);
        }
      }
      
      const userData = await response.json();
      console.log("Registration successful, user data:", userData);
      
      // Update global user state
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.name}!`,
      });
      
      // Use navigateToDashboard from user context
      navigateToDashboard();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account. Username may already exist.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigateToDashboard();
    }
  }, [user, navigateToDashboard]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-black dark:from-neutral-200 dark:to-white">LEARN-X</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Course Assistant Platform</p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-700 mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 font-medium ${
                isLogin
                  ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 font-medium ${
                !isLogin
                  ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              Register
            </button>
          </div>
          
          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Email</Label>
                <Input 
                  id="username" 
                  name="username" 
                  type="email" 
                  value={formState.username} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  value={formState.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup 
                  value={formState.role} 
                  onValueChange={handleRoleChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professor" id="login-professor" />
                    <Label htmlFor="login-professor" className="text-sm">Professor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="login-student" />
                    <Label htmlFor="login-student" className="text-sm">Student</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={formState.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-username">Email</Label>
                <Input 
                  id="reg-username" 
                  name="username" 
                  type="email" 
                  value={formState.username} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input 
                  id="reg-password" 
                  name="password" 
                  type="password" 
                  value={formState.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup 
                  value={formState.role} 
                  onValueChange={handleRoleChange}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professor" id="reg-professor" />
                    <Label htmlFor="reg-professor" className="text-sm">Professor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="reg-student" />
                    <Label htmlFor="reg-student" className="text-sm">Student</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}