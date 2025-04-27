import { 
  users, courses, enrollments, materials, chatHistory,
  type User, type InsertUser, 
  type Course, type InsertCourse,
  type Enrollment, type InsertEnrollment,
  type Material, type InsertMaterial,
  type ChatItem, type InsertChatItem
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Course operations
  createCourse(course: InsertCourse): Promise<Course>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseByAccessCode(accessCode: string): Promise<Course | undefined>;
  getProfessorCourses(professorId: number): Promise<Course[]>;
  
  // Enrollment operations
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getStudentCourses(studentId: number): Promise<Course[]>;
  getCourseStudents(courseId: number): Promise<User[]>;
  
  // Material operations
  createMaterial(material: InsertMaterial): Promise<Material>;
  getCourseMaterials(courseId: number): Promise<Material[]>;
  
  // Chat operations
  createChatItem(chatItem: InsertChatItem): Promise<ChatItem>;
  getStudentChatHistory(studentId: number, courseId: number): Promise<ChatItem[]>;
}

export class MemStorage implements IStorage {
  private userStore: Map<number, User>;
  private courseStore: Map<number, Course>;
  private enrollmentStore: Map<number, Enrollment>;
  private materialStore: Map<number, Material>;
  private chatHistoryStore: Map<number, ChatItem>;
  
  private currentUserId: number;
  private currentCourseId: number;
  private currentEnrollmentId: number;
  private currentMaterialId: number;
  private currentChatHistoryId: number;

  constructor() {
    this.userStore = new Map();
    this.courseStore = new Map();
    this.enrollmentStore = new Map();
    this.materialStore = new Map();
    this.chatHistoryStore = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentEnrollmentId = 1;
    this.currentMaterialId = 1;
    this.currentChatHistoryId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.userStore.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.userStore.set(id, user);
    return user;
  }
  
  // Course operations
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const now = new Date();
    const course: Course = { ...insertCourse, id, createdAt: now };
    this.courseStore.set(id, course);
    return course;
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courseStore.get(id);
  }
  
  async getCourseByAccessCode(accessCode: string): Promise<Course | undefined> {
    return Array.from(this.courseStore.values()).find(
      (course) => course.accessCode === accessCode,
    );
  }
  
  async getProfessorCourses(professorId: number): Promise<Course[]> {
    return Array.from(this.courseStore.values()).filter(
      (course) => course.professorId === professorId,
    );
  }
  
  // Enrollment operations
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.currentEnrollmentId++;
    const now = new Date();
    const enrollment: Enrollment = { ...insertEnrollment, id, joinedAt: now };
    this.enrollmentStore.set(id, enrollment);
    return enrollment;
  }
  
  async getStudentCourses(studentId: number): Promise<Course[]> {
    const enrollments = Array.from(this.enrollmentStore.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
    
    return enrollments.map(
      (enrollment) => this.courseStore.get(enrollment.courseId)!
    ).filter(Boolean);
  }
  
  async getCourseStudents(courseId: number): Promise<User[]> {
    const enrollments = Array.from(this.enrollmentStore.values()).filter(
      (enrollment) => enrollment.courseId === courseId,
    );
    
    return enrollments.map(
      (enrollment) => this.userStore.get(enrollment.studentId)!
    ).filter(Boolean);
  }
  
  // Material operations
  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const id = this.currentMaterialId++;
    const now = new Date();
    const material: Material = { ...insertMaterial, id, uploadDate: now };
    this.materialStore.set(id, material);
    return material;
  }
  
  async getCourseMaterials(courseId: number): Promise<Material[]> {
    return Array.from(this.materialStore.values()).filter(
      (material) => material.courseId === courseId,
    );
  }
  
  // Chat operations
  async createChatItem(insertChatItem: InsertChatItem): Promise<ChatItem> {
    const id = this.currentChatHistoryId++;
    const now = new Date();
    const chatItem: ChatItem = { ...insertChatItem, id, timestamp: now };
    this.chatHistoryStore.set(id, chatItem);
    return chatItem;
  }
  
  async getStudentChatHistory(studentId: number, courseId: number): Promise<ChatItem[]> {
    return Array.from(this.chatHistoryStore.values())
      .filter(
        (chatItem) => chatItem.studentId === studentId && chatItem.courseId === courseId,
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}

export const storage = new MemStorage();
