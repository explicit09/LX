import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Helper function to generate an access code based on course name and timestamp
function generateAccessCode(courseName: string = ''): string {
  // Use the first 3 characters of course name (uppercase) or placeholder if no name
  const prefix = courseName.length > 0 
    ? courseName.slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, 'X')
    : 'CRS';
    
  // Use timestamp for uniqueness - last 3 digits of current timestamp
  const timestamp = Date.now().toString().slice(-3);
  
  return `${prefix}${timestamp}`;
}

// Form schema
const formSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().optional(),
  startDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated: () => void;
}

const CreateCourseModal = ({
  open,
  onOpenChange,
  onCourseCreated,
}: CreateCourseModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // For demo purposes - simulate API request delay 
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, uncomment this API call
      // await apiRequest("POST", "/api/courses", {
      //   ...values,
      //   startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
      // });
      
      // Create a mock course object with the form values
      const newCourse = {
        id: Date.now(), // Use timestamp as a more reliable unique ID
        name: values.name,
        description: values.description || "",
        accessCode: generateAccessCode(values.name),
        professorId: 1, // Current user ID
        createdAt: new Date().toISOString(),
        startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
        studentCount: 0,
        materialCount: 0
      };
      
      // Store in localStorage for the dashboard to pick up
      localStorage.setItem('course_added', JSON.stringify(newCourse));
      
      toast({
        title: "Course created",
        description: "Your course has been created successfully.",
      });
      
      form.reset();
      onCourseCreated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Create New Course</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Course Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} className="resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseModal;
