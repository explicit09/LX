import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  BarChart, 
  Settings,
  MessageCircle,
  History,
  School
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/lib/user-context";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavItem = ({ href, icon, children, isActive }: NavItemProps) => (
  <Link href={href}>
    <a
      className={cn(
        "flex items-center px-2 py-2 text-sm font-medium rounded-md",
        isActive
          ? "bg-blue-50 text-primary"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <span
        className={cn(
          "mr-3 text-lg",
          isActive ? "text-primary" : "text-gray-500"
        )}
      >
        {icon}
      </span>
      {children}
    </a>
  </Link>
);

interface SideNavProps {
  navItems?: Array<{
    href: string;
    icon: React.ReactNode;
    label: string;
  }>;
  courses?: Array<{
    id: number;
    name: string;
  }>;
  activeStatus?: Record<number, string>;
}

const SideNav = ({ navItems, courses, activeStatus }: SideNavProps) => {
  const [location] = useLocation();
  const { user } = useUser();

  // Default nav items if none are provided
  const defaultProfessorItems = [
    { href: "/professor/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/professor/courses", icon: <BookOpen size={20} />, label: "My Courses" },
    { href: "/professor/materials", icon: <FileText size={20} />, label: "Course Materials" },
    { href: "/professor/reports", icon: <BarChart size={20} />, label: "Student Reports" },
  ];

  const defaultStudentItems = [
    { href: "/student/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/student/courses", icon: <School size={20} />, label: "My Courses" },
    { href: "/student/chat-assistant", icon: <MessageCircle size={20} />, label: "Course Assistant" },
    { href: "/student/chat-history", icon: <History size={20} />, label: "Chat History" },
  ];

  const isActive = (href: string) => {
    // Special case for course chat paths
    if (location.startsWith('/student/course/') && href === '/student/chat-assistant') {
      return true;
    }
    return location === href;
  };

  const items = navItems 
    ? navItems 
    : (user?.role === 'professor' ? defaultProfessorItems : defaultStudentItems);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">
            {user?.role === "professor" ? "Professor Dashboard" : "Student Dashboard"}
          </h2>
        </div>

        <nav className="flex-1 px-2 py-4 bg-white space-y-1">
          {items.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={isActive(item.href)}
            >
              {item.label}
            </NavItem>
          ))}
          
          <NavItem
            href="/settings"
            icon={<Settings size={20} />}
            isActive={location === "/settings"}
          >
            Settings
          </NavItem>
        </nav>

        {user?.role === "student" && courses && courses.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Enrolled Courses</h3>
            <ul className="space-y-2">
              {courses.map((course) => (
                <li key={course.id}>
                  <Link href={`/student/course/${course.id}/chat`}>
                    <a className={cn(
                      "flex items-center text-sm font-medium hover:text-primary",
                      location === `/student/course/${course.id}/chat` 
                        ? "text-primary" 
                        : "text-gray-700"
                    )}>
                      <span 
                        className={`w-2 h-2 rounded-full mr-2 ${
                          activeStatus?.[course.id] === "active" 
                            ? "bg-green-500" 
                            : "bg-blue-500"
                        }`} 
                      />
                      {course.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideNav;
