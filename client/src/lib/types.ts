// Define all type interfaces for the application

// User-related types
export interface User {
  id: number;
  username: string;
  name: string;
  role: "professor" | "student";
  createdAt: string;
}

// Course-related types
export interface Course {
  id: number;
  name: string;
  description?: string;
  accessCode: string;
  professorId: number;
  startDate?: string;
  createdAt: string;
  studentCount?: number;
  materialCount?: number;
}

// Material-related types
export interface Material {
  id: number;
  courseId: number;
  name: string;
  type: "pdf" | "audio";
  path: string;
  uploadDate: string;
  transcription?: string;
}

// Chat-related types
export interface ChatItem {
  id: number;
  studentId: number;
  courseId: number;
  question: string;
  answer: string;
  timestamp: string;
  sources?: string;
}

// Enrollment-related types
export interface Enrollment {
  id: number;
  studentId: number;
  courseId: number;
  joinedAt: string;
}

// Course report types
export interface CourseReport {
  courseId: number;
  courseName: string;
  totalQuestions: number;
  totalStudents: number;
  commonTopics: Array<{ topic: string; count: number }>;
}

// Student interactions report types
export interface StudentInteraction {
  studentId: number;
  studentName: string;
  questionCount: number;
  lastInteraction: string;
  topics: Array<{ topic: string; count: number }>;
}

// Chat statistics
export interface ChatStats {
  totalQuestions: number;
  averageQuestionsPerStudent: number;
  topQuestionsPerDay: number;
  questionsPerDay: Array<{ date: string; count: number }>;
}

// Course material statistics
export interface MaterialStats {
  totalPdfCount: number;
  totalAudioCount: number;
  mostReferencedMaterials: Array<{ id: number; name: string; count: number }>;
}
