import { useState } from "react";
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
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "professor",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      role: "professor",
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/auth/login", values);
      const userData = await response.json();
      
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest("POST", "/api/auth/register", values);
      const userData = await response.json();
      
      setUser(userData);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${userData.name}!`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Could not create account. Username may already exist.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">LINK-X</h1>
        <p className="text-gray-600">Course Assistant Platform</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 font-medium ${
              isLogin
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 font-medium ${
              !isLogin
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>
        
        {/* Login Form */}
        {isLogin ? (
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <a href="#" className="text-xs text-primary hover:underline mt-1 inline-block">
                      Forgot password?
                    </a>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="professor" id="role-professor" />
                          <label htmlFor="role-professor" className="text-sm">I'm a Professor</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student" id="role-student" />
                          <label htmlFor="role-student" className="text-sm">I'm a Student</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <FormField
                control={registerForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={registerForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="professor" id="reg-role-professor" />
                          <label htmlFor="reg-role-professor" className="text-sm">I'm a Professor</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="student" id="reg-role-student" />
                          <label htmlFor="reg-role-student" className="text-sm">I'm a Student</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
