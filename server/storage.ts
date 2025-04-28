import { 
  users, courses, enrollments, materials, chatHistory,
  type User, type InsertUser, 
  type Course, type InsertCourse,
  type Enrollment, type InsertEnrollment,
  type Material, type InsertMaterial,
  type ChatItem, type InsertChatItem
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import session from "express-session";
import { Store as SessionStore } from "express-session";

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
  getCourseChatHistory(courseId: number): Promise<ChatItem[]>;
  
  // Debug/utility operations
  getTableCount(tableName: string): Promise<number>;
  
  // Session store for express-session
  sessionStore: SessionStore;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Course operations
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(insertCourse).returning();
    return course;
  }
  
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }
  
  async getCourseByAccessCode(accessCode: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.accessCode, accessCode));
    return course;
  }
  
  async getProfessorCourses(professorId: number): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.professorId, professorId));
  }
  
  // Enrollment operations
  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(insertEnrollment).returning();
    return enrollment;
  }
  
  async getStudentCourses(studentId: number): Promise<Course[]> {
    const studentEnrollments = await db
      .select({
        courseId: enrollments.courseId
      })
      .from(enrollments)
      .where(eq(enrollments.studentId, studentId));
    
    if (studentEnrollments.length === 0) {
      return [];
    }
    
    const courseIds = studentEnrollments.map(e => e.courseId);
    return db
      .select()
      .from(courses)
      .where(
        courseIds.map(id => eq(courses.id, id)).reduce((acc, curr) => acc || curr)
      );
  }
  
  async getCourseStudents(courseId: number): Promise<User[]> {
    const courseEnrollments = await db
      .select({
        studentId: enrollments.studentId
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
    
    if (courseEnrollments.length === 0) {
      return [];
    }
    
    const studentIds = courseEnrollments.map(e => e.studentId);
    return db
      .select()
      .from(users)
      .where(
        studentIds.map(id => eq(users.id, id)).reduce((acc, curr) => acc || curr)
      );
  }
  
  // Material operations
  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db.insert(materials).values(insertMaterial).returning();
    return material;
  }
  
  async getCourseMaterials(courseId: number): Promise<Material[]> {
    return db.select().from(materials).where(eq(materials.courseId, courseId));
  }
  
  // Chat operations
  async createChatItem(insertChatItem: InsertChatItem): Promise<ChatItem> {
    const [chatItem] = await db.insert(chatHistory).values(insertChatItem).returning();
    return chatItem;
  }
  
  async getStudentChatHistory(studentId: number, courseId: number): Promise<ChatItem[]> {
    return db
      .select()
      .from(chatHistory)
      .where(
        and(
          eq(chatHistory.studentId, studentId),
          eq(chatHistory.courseId, courseId)
        )
      )
      .orderBy(chatHistory.timestamp);
  }
  
  async getCourseChatHistory(courseId: number): Promise<ChatItem[]> {
    return db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.courseId, courseId))
      .orderBy(chatHistory.timestamp);
  }
  
  // Debug/utility operations
  async getTableCount(tableName: string): Promise<number> {
    try {
      // Use a switch statement for different tables
      switch (tableName) {
        case 'users':
          const usersResult = await db.select().from(users);
          return usersResult.length;
        case 'courses':
          const coursesResult = await db.select().from(courses);
          return coursesResult.length;
        case 'enrollments':
          const enrollmentsResult = await db.select().from(enrollments);
          return enrollmentsResult.length;
        case 'materials':
          const materialsResult = await db.select().from(materials);
          return materialsResult.length;
        case 'chat_history':
          const chatResult = await db.select().from(chatHistory);
          return chatResult.length;
        default:
          return 0;
      }
    } catch (error) {
      console.error(`Error counting rows in ${tableName}:`, error);
      return 0;
    }
  }
}

export const storage = new DatabaseStorage();
