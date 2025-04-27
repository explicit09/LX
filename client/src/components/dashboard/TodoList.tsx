import React, { useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, CheckCircle, FileText, Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Todo item types
interface TodoItem {
  id: number;
  title: string;
  dueDate: string;
  courseId: number;
  courseName: string;
  type: 'assignment' | 'quiz' | 'reading';
  completed: boolean;
}

interface TodoListProps {
  items?: TodoItem[];
}

const TodoList: React.FC<TodoListProps> = ({ items: propItems }) => {
  // Example items for demo (in a real app, these would come from props or an API)
  const defaultItems: TodoItem[] = [
    {
      id: 1,
      title: 'Leadership Self-Assessment',
      dueDate: '2025-05-20T23:59:00',
      courseId: 101,
      courseName: 'Introduction to Leadership',
      type: 'assignment',
      completed: false
    },
    {
      id: 2,
      title: 'Knowledge Check 1.1',
      dueDate: '2025-05-15T23:59:00',
      courseId: 101,
      courseName: 'Introduction to Leadership',
      type: 'quiz',
      completed: false
    },
    {
      id: 3,
      title: 'Chapter 15 - Leadership Ethics',
      dueDate: '2025-05-10T23:59:00',
      courseId: 102,
      courseName: 'Ethics in Modern Organizations',
      type: 'reading',
      completed: true
    },
    {
      id: 4,
      title: 'Discussion: Ethical Dilemmas',
      dueDate: '2025-05-27T23:59:00',
      courseId: 102,
      courseName: 'Ethics in Modern Organizations',
      type: 'assignment',
      completed: false
    }
  ];
  
  const [items, setItems] = useState<TodoItem[]>(propItems || defaultItems);
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  
  // Toggle item completion
  const toggleComplete = (id: number) => {
    setItems(prev => 
      prev.map(item => 
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
        {sortedItems.length > 0 ? (
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
                      <span 
                        className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate cursor-pointer"
                        onClick={() => window.location.href = `/courses/${item.courseId}`}
                      >
                        {item.courseName}
                      </span>
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
          onClick={() => window.location.href = '/todo'}
        >
          View All Tasks
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;