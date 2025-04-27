import { pgTable, text, serial, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User schema with role (professor or student)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(), // 'professor' or 'student'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Course schema
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  accessCode: text("access_code").notNull().unique(),
  professorId: integer("professor_id").notNull(),
  startDate: timestamp("start_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Course enrollment schema (many-to-many between students and courses)
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
}, (table) => {
  return {
    unq: unique().on(table.studentId, table.courseId),
  };
});

// Course materials schema
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'pdf' or 'audio'
  path: text("path").notNull(),
  uploadDate: timestamp("upload_date").defaultNow().notNull(),
  transcription: text("transcription"), // for audio files
});

// Chat history schema
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  courseId: integer("course_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sources: text("sources"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  name: true,
  description: true,
  accessCode: true,
  professorId: true,
  startDate: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).pick({
  studentId: true,
  courseId: true,
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  courseId: true,
  name: true,
  type: true,
  path: true,
  transcription: true,
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  studentId: true,
  courseId: true,
  question: true,
  answer: true,
  sources: true,
});

// Types
// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  courses: many(courses, { relationName: "professor_courses" }),
  enrollments: many(enrollments, { relationName: "student_enrollments" }),
  chatHistory: many(chatHistory, { relationName: "student_chat_history" }),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  professor: one(users, {
    fields: [courses.professorId],
    references: [users.id],
    relationName: "professor_courses"
  }),
  enrollments: many(enrollments),
  materials: many(materials),
  chatHistory: many(chatHistory),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  student: one(users, {
    fields: [enrollments.studentId],
    references: [users.id],
    relationName: "student_enrollments"
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
  course: one(courses, {
    fields: [materials.courseId],
    references: [courses.id],
  }),
}));

export const chatHistoryRelations = relations(chatHistory, ({ one }) => ({
  student: one(users, {
    fields: [chatHistory.studentId],
    references: [users.id],
    relationName: "student_chat_history"
  }),
  course: one(courses, {
    fields: [chatHistory.courseId],
    references: [courses.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Material = typeof materials.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;

export type ChatItem = typeof chatHistory.$inferSelect;
export type InsertChatItem = z.infer<typeof insertChatHistorySchema>;
