import React from 'react';
import { Link } from 'wouter';
import { CheckCircle, Circle, Calendar, BookOpen, FileText } from 'lucide-react';

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

const TodoList: React.FC<TodoListProps> = ({ items = [] }) => {
  // Placeholder data if no items are provided
  const placeholderItems: TodoItem[] = [
    {
      id: 1,
      title: 'Midterm Exam',
      dueDate: '2025-05-15T23:59:00',
      courseId: 101,
      courseName: 'Introduction to Economics',
      type: 'assignment',
      completed: false
    },
    {
      id: 2,
      title: 'Chapter 5 Reading',
      dueDate: '2025-05-05T23:59:00',
      courseId: 102,
      courseName: 'World History',
      type: 'reading',
      completed: false
    },
    {
      id: 3,
      title: 'Week 7 Quiz',
      dueDate: '2025-04-30T23:59:00',
      courseId: 103,
      courseName: 'Biology 101',
      type: 'quiz',
      completed: true
    }
  ];

  const displayItems = items.length > 0 ? items : placeholderItems;
  
  // Function to get icon based on type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-3 w-3" />;
      case 'quiz':
        return <Circle className="h-3 w-3" />;
      case 'reading':
        return <BookOpen className="h-3 w-3" />;
      default:
        return <FileText className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-neutral-800 dark:text-white">To Do</h2>
        <Link href="/calendar">
          <a className="text-sm text-blue-600 dark:text-blue-400">View Calendar</a>
        </Link>
      </div>
      
      {displayItems.length > 0 ? (
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div 
              key={item.id}
              className={`p-3 rounded-lg border ${item.completed 
                ? 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'}`}
            >
              <div className="flex items-start">
                <div className="mt-0.5">
                  {item.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-neutral-400" />
                  )}
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <h3 className={`font-medium text-sm ${item.completed 
                    ? 'text-neutral-500 dark:text-neutral-400 line-through' 
                    : 'text-neutral-800 dark:text-white'}`}>
                    {item.title}
                  </h3>
                  <div className="flex items-center mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(item.dueDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400">
                      {getTypeIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </div>
                    <span className="mx-1 text-xs text-neutral-300 dark:text-neutral-600">•</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {item.courseName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-neutral-500 dark:text-neutral-400">No upcoming tasks</p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Recent Feedback</h3>
        
        <div className="space-y-2 mt-3">
          <div className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs text-left">
            <div className="flex items-start">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
              <div className="ml-2">
                <div className="font-medium text-neutral-800 dark:text-white">Quiz: Week 13</div>
                <div className="text-neutral-500 dark:text-neutral-400">10 out of 10</div>
              </div>
            </div>
          </div>
          
          <div className="p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-xs text-left">
            <div className="flex items-start">
              <CheckCircle className="h-3 w-3 text-green-500 mt-0.5" />
              <div className="ml-2">
                <div className="font-medium text-neutral-800 dark:text-white">Quiz: Week 12</div>
                <div className="text-neutral-500 dark:text-neutral-400">8 out of 10</div>
              </div>
            </div>
          </div>
        </div>
        
        <button className="mt-4 text-sm text-blue-600 dark:text-blue-400">
          View Grades
        </button>
      </div>
    </div>
  );
};

export default TodoList;