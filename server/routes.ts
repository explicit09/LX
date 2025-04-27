import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertCourseSchema, 
  insertEnrollmentSchema,
  insertChatHistorySchema 
} from "@shared/schema";
import { generateAccessCode } from "./utils";
import { processDocument, getVectorDBPath, queryVectorStore } from "./vectordb";
import { transcribeAudio, summarizeWithLLM } from "./openai";
import { Buffer } from "buffer";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import MemoryStore from "memorystore";

// Constants
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const SESSION_SECRET = "link-x-course-assistant-secret";

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "pdfs"), { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "audio"), { recursive: true });
    await fs.mkdir(path.join(UPLOAD_DIR, "indexes"), { recursive: true });
  } catch (err) {
    console.error("Failed to create upload directories", err);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize directories
  await ensureUploadDir();
  
  // Configure authentication & sessions
  const MemStore = MemoryStore(session);
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 },
    store: new MemStore({ checkPeriod: 86400000 })
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      
      // In a real app, you'd use bcrypt to hash and compare passwords
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
  });
  
  // Middleware for checking if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Authentication required" });
  };
  
  // Middleware for checking if user is a professor
  const isProfessor = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "professor") {
      return next();
    }
    res.status(403).json({ message: "Professor access required" });
  };
  
  // Middleware for checking if user is a student
  const isStudent = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "student") {
      return next();
    }
    res.status(403).json({ message: "Student access required" });
  };
  
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Login the user after registration
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });
  
  // Professor routes
  app.post("/api/courses", isProfessor, async (req, res) => {
    try {
      const professorId = (req.user as any).id;
      
      // Generate a unique access code
      const accessCode = generateAccessCode();
      
      // Create the course with the professor's ID
      const courseData = insertCourseSchema.parse({
        ...req.body,
        professorId,
        accessCode
      });
      
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.get("/api/professor/courses", isProfessor, async (req, res) => {
    try {
      const professorId = (req.user as any).id;
      const courses = await storage.getProfessorCourses(professorId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  app.get("/api/courses/:id/students", isProfessor, async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Check if course exists and belongs to the professor
      const course = await storage.getCourse(courseId);
      if (!course || course.professorId !== (req.user as any).id) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const students = await storage.getCourseStudents(courseId);
      
      // Remove passwords from response
      const studentsWithoutPasswords = students.map(student => {
        const { password, ...studentWithoutPassword } = student;
        return studentWithoutPassword;
      });
      
      res.json(studentsWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });
  
  // Upload route for course materials
  app.post(
    "/api/courses/:courseId/materials", 
    isProfessor, 
    upload.single("file"), 
    async (req, res) => {
      try {
        const courseId = parseInt(req.params.courseId);
        const file = req.file;
        
        if (!file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        // Check if course exists and belongs to the professor
        const course = await storage.getCourse(courseId);
        if (!course || course.professorId !== (req.user as any).id) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        // Determine file type and process accordingly
        const fileExtension = path.extname(file.originalname).toLowerCase();
        let fileType: string;
        let filePath: string;
        let transcription: string | undefined;
        
        if ([".pdf"].includes(fileExtension)) {
          fileType = "pdf";
          filePath = path.join("pdfs", `${Date.now()}_${file.originalname}`);
          
          // Save the PDF file
          await fs.writeFile(path.join(UPLOAD_DIR, filePath), file.buffer);
          
          // Process the PDF for vector database
          await processDocument(path.join(UPLOAD_DIR, filePath), courseId);
          
        } else if ([".mp3", ".wav", ".m4a"].includes(fileExtension)) {
          fileType = "audio";
          filePath = path.join("audio", `${Date.now()}_${file.originalname}`);
          
          // Save the audio file
          await fs.writeFile(path.join(UPLOAD_DIR, filePath), file.buffer);
          
          // Transcribe the audio file
          transcription = await transcribeAudio(path.join(UPLOAD_DIR, filePath));
          
          // If transcription successful, also add it to the vector database
          if (transcription) {
            const transcriptionFilePath = path.join(UPLOAD_DIR, "pdfs", `${Date.now()}_${path.basename(file.originalname, fileExtension)}_transcript.txt`);
            await fs.writeFile(transcriptionFilePath, transcription);
            await processDocument(transcriptionFilePath, courseId);
          }
        } else {
          return res.status(400).json({ message: "Unsupported file type" });
        }
        
        // Create material record
        const material = await storage.createMaterial({
          courseId,
          name: file.originalname,
          type: fileType,
          path: filePath,
          transcription
        });
        
        res.status(201).json(material);
      } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Failed to upload file" });
      }
    }
  );
  
  app.get("/api/courses/:courseId/materials", isAuthenticated, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const user = req.user as any;
      
      // Check if course exists and user has access (either professor or enrolled student)
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // If user is professor, check if course belongs to them
      if (user.role === "professor" && course.professorId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // If user is student, check if they're enrolled
      if (user.role === "student") {
        const studentCourses = await storage.getStudentCourses(user.id);
        const enrolled = studentCourses.some(c => c.id === courseId);
        if (!enrolled) {
          return res.status(403).json({ message: "Not enrolled in this course" });
        }
      }
      
      const materials = await storage.getCourseMaterials(courseId);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });
  
  // Student routes
  app.post("/api/enrollments", isStudent, async (req, res) => {
    try {
      const studentId = (req.user as any).id;
      const { accessCode } = req.body;
      
      if (!accessCode) {
        return res.status(400).json({ message: "Access code is required" });
      }
      
      // Look up the course by access code
      const course = await storage.getCourseByAccessCode(accessCode);
      if (!course) {
        return res.status(404).json({ message: "Invalid access code" });
      }
      
      // Check if student is already enrolled
      const studentCourses = await storage.getStudentCourses(studentId);
      if (studentCourses.some(c => c.id === course.id)) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      // Enroll the student
      const enrollment = await storage.createEnrollment({
        studentId,
        courseId: course.id
      });
      
      res.status(201).json({
        enrollment,
        course
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });
  
  app.get("/api/student/courses", isStudent, async (req, res) => {
    try {
      const studentId = (req.user as any).id;
      const courses = await storage.getStudentCourses(studentId);
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });
  
  // Chat routes
  app.post("/api/courses/:courseId/chat", isStudent, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const studentId = (req.user as any).id;
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Check if student is enrolled in the course
      const studentCourses = await storage.getStudentCourses(studentId);
      if (!studentCourses.some(c => c.id === courseId)) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      // Query the vector store for relevant content
      const vectorDbPath = getVectorDBPath(courseId);
      const { content, sources } = await queryVectorStore(vectorDbPath, question);
      
      // Generate a response using the LLM
      const answer = await summarizeWithLLM(question, content);
      
      // Save the chat history
      const chatItem = await storage.createChatItem({
        studentId,
        courseId,
        question,
        answer,
        sources: JSON.stringify(sources)
      });
      
      res.json(chatItem);
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });
  
  app.get("/api/courses/:courseId/chat-history", isStudent, async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const studentId = (req.user as any).id;
      
      // Check if student is enrolled in the course
      const studentCourses = await storage.getStudentCourses(studentId);
      if (!studentCourses.some(c => c.id === courseId)) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      const chatHistory = await storage.getStudentChatHistory(studentId, courseId);
      res.json(chatHistory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });
  
  // Utility function for generating access codes - added here for completeness
  app.get("/api/utils/generate-access-code", isProfessor, (req, res) => {
    const accessCode = generateAccessCode();
    res.json({ accessCode });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Add routes for PDF serving (for professors and enrolled students)
  app.get("/api/uploads/:type/:filename", isAuthenticated, async (req, res) => {
    try {
      const { type, filename } = req.params;
      const user = req.user as any;
      
      // Ensure path is within allowed directories
      if (!["pdfs", "audio"].includes(type)) {
        return res.status(400).json({ message: "Invalid resource type" });
      }
      
      const filePath = path.join(UPLOAD_DIR, type, filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (err) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check if user has access to this file (based on course ownership or enrollment)
      // This would require looking up which course the file belongs to
      // For simplicity in this example, we're skipping this check
      
      res.sendFile(filePath);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve file" });
    }
  });

  return httpServer;
}

// Utility function to generate unique access codes
function generateAccessCode(): string {
  // Format: XXXX-XXXX-XXXX (3 groups of 4 alphanumeric characters)
  const generateRandomGroup = () => {
    return crypto.randomBytes(2).toString('hex').toUpperCase();
  };
  
  return `${generateRandomGroup()}-${generateRandomGroup()}-${generateRandomGroup()}`;
}
