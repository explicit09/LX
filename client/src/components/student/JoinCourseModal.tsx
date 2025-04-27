import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Laptop, Key, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema for access code validation
const formSchema = z.object({
  accessCode: z.string().min(4, "Access code must be at least 4 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface JoinCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseJoined: () => void;
}

const JoinCourseModal = ({
  open,
  onOpenChange,
  onCourseJoined,
}: JoinCourseModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Call the API to enroll in the course
      const response = await apiRequest("POST", "/api/student/enroll", {
        accessCode: values.accessCode.trim().toUpperCase(),
      });

      const data = await response.json();

      toast({
        title: "Success!",
        description: `You've successfully joined the course: ${data.course.name}`,
      });

      // Clear the form and close the modal
      form.reset();
      onOpenChange(false);
      
      // Notify parent component that a course was joined
      onCourseJoined();
    } catch (error) {
      console.error("Failed to join course:", error);
      toast({
        title: "Failed to join course",
        description: 
          error instanceof Error 
            ? error.message 
            : "The access code may be invalid or you may already be enrolled in this course.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-white hover:bg-blue-700/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="bg-white/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Laptop className="h-6 w-6" />
          </div>
          
          <DialogTitle className="text-xl font-bold mb-2">Join a Course</DialogTitle>
          <p className="text-blue-100 text-sm">
            Enter the course access code provided by your professor
          </p>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Access Code</FormLabel>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Key className="h-4 w-4" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Enter code (e.g. ABC123)"
                          autoCapitalize="characters"
                          className="pl-10 uppercase text-blue-600 font-medium bg-gray-50 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This is a unique code that gives you access to your course's materials
                    </p>
                  </FormItem>
                )}
              />

              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pb-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-200 text-gray-700"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    "Joining..." 
                  ) : (
                    <>
                      Join Course <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;