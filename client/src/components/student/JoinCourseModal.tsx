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
import { Button } from "@/components/ui/button";

// Form schema
const formSchema = z.object({
  accessCode: z.string().min(1, "Access code is required"),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      await apiRequest("POST", "/api/enrollments", {
        accessCode: values.accessCode,
      });
      
      toast({
        title: "Success",
        description: "You have joined the course successfully.",
      });
      
      form.reset();
      onCourseJoined();
      onOpenChange(false);
    } catch (error) {
      console.error("Error joining course:", error);
      toast({
        title: "Error",
        description: "Failed to join course. The access code may be invalid.",
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
                  <FormLabel className="text-sm font-medium text-gray-700">Enter Access Code</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="w-full font-mono" 
                      placeholder="XXXX-XXXX-XXXX" 
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">
                    This code was provided by your professor
                  </p>
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
                {isSubmitting ? "Joining..." : "Join Course"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;
