import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Join a Course</DialogTitle>
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
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Access Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter course code (e.g. ABC123)"
                      autoCapitalize="characters"
                      className="uppercase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-sm text-gray-500">
              Enter the access code provided by your professor to join the course.
            </div>

            <DialogFooter className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Joining..." : "Join Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;