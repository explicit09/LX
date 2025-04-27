import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { BookOpen, CheckCircle, FileText, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/lib/user-context';
import { TodoItem } from '@/lib/types';

interface TodoListProps {
  items?: TodoItem[];
}

const TodoList: React.FC<TodoListProps> = ({ items: propItems }) => {
  const { user } = useUser();
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  
  // Fetch todo items from the API
  const { data: items = [], isLoading, refetch } = useQuery<TodoItem[]>({
    queryKey: ['/api/todo'],
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: propItems || []
  });
  
  // Update todo item completion status mutation
  const updateTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo item');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/todo'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update todo item',
        variant: 'destructive'
      });
    }
  });
  
  // Toggle item completion
  const toggleComplete = (id: number) => {
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // Call the mutation to update the todo item
    updateTodoMutation.mutate({ 
      id, 
      completed: !item.completed 
    });
    
    // Optimistically update the UI while the mutation is in flight
    queryClient.setQueryData(['/api/todo'], (oldData: TodoItem[] = []) => 
      oldData.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  // Get icon for item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'quiz':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'reading':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-neutral-500" />;
    }
  };
  
  // Filter items
  const filteredItems = items.filter(item => {
    if (filter === 'incomplete') return !item.completed;
    if (filter === 'complete') return item.completed;
    return true;
  });
  
  // Sort by due date (closest first)
  const sortedItems = [...filteredItems].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="font-semibold text-neutral-800 dark:text-white text-lg mb-4">To Do</h2>
      
      {/* Filters */}
      <div className="mb-4">
        <Label htmlFor="filter" className="sr-only">Filter tasks</Label>
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger id="filter" className="w-full">
            <SelectValue placeholder="Filter tasks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="complete">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Todo Items */}
      <div className="space-y-3 flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="h-5 w-5 text-neutral-400 dark:text-neutral-500 animate-spin mb-2" />
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Loading tasks...</p>
          </div>
        ) : sortedItems.length > 0 ? (
          sortedItems.map((item) => {
            const dueDate = new Date(item.dueDate);
            const isOverdue = !item.completed && dueDate < new Date();
            const formattedDate = dueDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
            
            return (
              <div
                key={item.id}
                className={`rounded-lg border p-3 flex items-start ${
                  item.completed 
                    ? 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700' 
                    : isOverdue
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <div className="flex items-center h-5 mr-3 mt-0.5">
                  <Checkbox
                    id={`todo-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleComplete(item.id)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-1">
                      {getItemIcon(item.type)}
                      <Link to={`/courses/${item.courseId}`} className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate">
                        {item.courseName}
                      </Link>
                    </div>
                    
                    <label
                      htmlFor={`todo-${item.id}`}
                      className={`font-medium text-sm ${
                        item.completed 
                          ? 'text-neutral-500 dark:text-neutral-400 line-through' 
                          : 'text-neutral-800 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </label>
                    
                    <div className="flex items-center mt-1 text-xs">
                      <Clock className="h-3 w-3 mr-1 text-neutral-400 dark:text-neutral-500" />
                      <span className={
                        isOverdue
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : 'text-neutral-500 dark:text-neutral-400'
                      }>
                        Due {formattedDate}{isOverdue ? ' (Overdue)' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              {filter === 'all' 
                ? 'No todo items found' 
                : filter === 'incomplete' 
                  ? 'No incomplete tasks' 
                  : 'No completed tasks'}
            </p>
          </div>
        )}
      </div>
      
      {/* View All Link */}
      <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Button 
          variant="outline" 
          className="w-full flex justify-center items-center"
          onClick={() => navigate('/todo')}
        >
          View All Tasks
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;