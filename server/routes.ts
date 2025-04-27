import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { createEmbedding, transcribeAudio, summarizeWithLLM } from "./openai";
import { processDocument, queryVectorStore, getVectorDBPath } from "./vectordb";
import { insertCourseSchema, insertEnrollmentSchema, insertMaterialSchema, insertChatHistorySchema } from "@shared/schema";
import { z } from "zod";

// Ensure uploads directory exists
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "uploads");
  const pdfsDir = path.join(uploadDir, "pdfs");
  const audioDir = path.join(uploadDir, "audio");
  
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.mkdir(pdfsDir, { recursive: true });
    await fs.mkdir(audioDir, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directories:", error);
  }
}

// Create a random access code
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Register all routes
export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize upload directories
  await ensureUploadDir();
  
  // Setup authentication
  const { isAuthenticated, isProfessor, isStudent } = setupAuth(app);
  
  // Configure multer for file uploads
  const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isAudio = file.mimetype.startsWith("audio/");
      const dir = isAudio ? "audio" : "pdfs";
      cb(null, path.join(process.cwd(), "uploads", dir));
    },
    filename: (req, file, cb) => {
      // Replace spaces with dashes and keep the original extension
      const fileName = file.originalname.replace(/\s+/g, "-");
      cb(null, `${Date.now()}-${fileName}`);
    }
  });
  
  const upload = multer({
    storage: fileStorage,
    limits: {
      fileSize: 25 * 1024 * 1024, // 25MB
    },
    fileFilter: (req, file, cb) => {
      // Allow PDF and audio files
      if (
        file.mimetype === "application/pdf" || 
        file.mimetype.startsWith("audio/")
      ) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type. Only PDF and audio files are allowed."));
      }
    }
  });

  // ==================
  // Professor API routes
  // ==================
  
  // Get all courses taught by the professor
  app.get("/api/professor/courses", isProfessor, async (req, res, next) => {
    try {
      const courses = await storage.getProfessorCourses(req.user!.id);
      
      // Enhance courses with student and material counts
      const enhancedCourses = await Promise.all(courses.map(async (course) => {
        const students = await storage.getCourseStudents(course.id);
        const materials = await storage.getCourseMaterials(course.id);
        
        return {
          ...course,
          studentCount: students.length,
          materialCount: materials.length
        };
      }));
      
      res.json(enhancedCourses);
    } catch (error) {
      next(error);
    }
  });
  
  // Create a new course
  app.post("/api/professor/courses", isProfessor, async (req, res, next) => {
    try {
      const validatedData = insertCourseSchema.parse({
        ...req.body,
        professorId: req.user!.id,
        accessCode: req.body.accessCode || generateAccessCode()
      });
      
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });
  
  // Get a single course by ID
  app.get("/api/professor/courses/:id", isProfessor, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.professorId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to access this course" });
      }
      
      const students = await storage.getCourseStudents(courseId);
      const materials = await storage.getCourseMaterials(courseId);
      
      res.json({
        ...course,
        studentCount: students.length,
        materialCount: materials.length
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Upload materials to a course
  app.post(
    "/api/professor/courses/:id/materials", 
    isProfessor, 
    upload.single("file"), 
    async (req, res, next) => {
      try {
        const courseId = parseInt(req.params.id);
        const course = await storage.getCourse(courseId);
        
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        
        if (course.professorId !== req.user!.id) {
          return res.status(403).json({ message: "Unauthorized to access this course" });
        }
        
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        const file = req.file;
        const isAudio = file.mimetype.startsWith("audio/");
        const fileType = isAudio ? "audio" : "pdf";
        
        let transcription = undefined;
        
        // For audio files, transcribe the content
        if (isAudio) {
          try {
            transcription = await transcribeAudio(file.path);
          } catch (transcriptionError) {
            console.error("Error transcribing audio:", transcriptionError);
          }
        }
        
        // Create the material record
        const material = await storage.createMaterial({
          courseId,
          name: file.originalname,
          type: fileType,
          path: file.path,
          transcription
        });
        
        // Process document for vector search (PDF or transcription)
        try {
          await processDocument(file.path, courseId);
        } catch (processingError) {
          console.error("Error processing document for vector search:", processingError);
        }
        
        res.status(201).json(material);
      } catch (error) {
        next(error);
      }
    }
  );
  
  // Get all materials for a course
  app.get("/api/professor/courses/:id/materials", isProfessor, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.professorId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to access this course" });
      }
      
      const materials = await storage.getCourseMaterials(courseId);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  });
  
  // Get all students enrolled in a course
  app.get("/api/professor/courses/:id/students", isProfessor, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      if (course.professorId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized to access this course" });
      }
      
      const students = await storage.getCourseStudents(courseId);
      
      // Remove passwords from student objects
      const safeStudents = students.map(student => {
        const { password, ...safeStudent } = student;
        return safeStudent;
      });
      
      res.json(safeStudents);
    } catch (error) {
      next(error);
    }
  });
  
  // ==================
  // Student API routes
  // ==================
  
  // Get all courses enrolled by the student
  app.get("/api/student/courses", isStudent, async (req, res, next) => {
    try {
      const courses = await storage.getStudentCourses(req.user!.id);
      
      // Enhance courses with material counts
      const enhancedCourses = await Promise.all(courses.map(async (course) => {
        const materials = await storage.getCourseMaterials(course.id);
        
        return {
          ...course,
          materialCount: materials.length
        };
      }));
      
      res.json(enhancedCourses);
    } catch (error) {
      next(error);
    }
  });
  
  // Enroll in a course using access code
  app.post("/api/student/enroll", isStudent, async (req, res, next) => {
    try {
      const { accessCode } = req.body;
      
      if (!accessCode) {
        return res.status(400).json({ message: "Access code is required" });
      }
      
      const course = await storage.getCourseByAccessCode(accessCode);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found with the provided access code" });
      }
      
      // Check if already enrolled
      const studentCourses = await storage.getStudentCourses(req.user!.id);
      const alreadyEnrolled = studentCourses.some(c => c.id === course.id);
      
      if (alreadyEnrolled) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }
      
      // Create enrollment
      const enrollment = await storage.createEnrollment({
        studentId: req.user!.id,
        courseId: course.id
      });
      
      res.status(201).json({
        enrollment,
        course
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Get a course by ID (for student)
  app.get("/api/student/courses/:id", isStudent, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      // Verify student is enrolled in this course
      const studentCourses = await storage.getStudentCourses(req.user!.id);
      const isEnrolled = studentCourses.some(c => c.id === courseId);
      
      if (!isEnrolled) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      const materials = await storage.getCourseMaterials(courseId);
      
      res.json({
        ...course,
        materialCount: materials.length
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Get all materials for a course (for student)
  app.get("/api/student/courses/:id/materials", isStudent, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Verify student is enrolled in this course
      const studentCourses = await storage.getStudentCourses(req.user!.id);
      const isEnrolled = studentCourses.some(c => c.id === courseId);
      
      if (!isEnrolled) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      const materials = await storage.getCourseMaterials(courseId);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  });
  
  // Get chat history for a course
  app.get("/api/student/courses/:id/chat", isStudent, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const studentId = req.user!.id;
      
      // Verify student is enrolled in this course
      const studentCourses = await storage.getStudentCourses(studentId);
      const isEnrolled = studentCourses.some(c => c.id === courseId);
      
      if (!isEnrolled) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      const chatHistory = await storage.getStudentChatHistory(studentId, courseId);
      res.json(chatHistory);
    } catch (error) {
      next(error);
    }
  });
  
  // Ask a question to the AI
  app.post("/api/student/courses/:id/ask", isStudent, async (req, res, next) => {
    try {
      const courseId = parseInt(req.params.id);
      const studentId = req.user!.id;
      const { question } = req.body;
      
      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Question is required" });
      }
      
      // Verify student is enrolled in this course
      const studentCourses = await storage.getStudentCourses(studentId);
      const isEnrolled = studentCourses.some(c => c.id === courseId);
      
      if (!isEnrolled) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      // Retrieve context from vector database
      const vectorDbPath = getVectorDBPath(courseId);
      const { content: context, sources } = await queryVectorStore(vectorDbPath, question);
      
      // Generate answer using OpenAI
      const answer = await summarizeWithLLM(question, context);
      
      // Store in chat history
      const chatItem = await storage.createChatItem({
        studentId,
        courseId,
        question,
        answer,
        sources: sources.join(",")
      });
      
      res.json(chatItem);
    } catch (error) {
      next(error);
    }
  });
  
  // Serve static files from uploads directory
  app.use("/api/uploads", express.static(path.join(process.cwd(), "uploads")));
  
  // Process sample document for testing (DEVELOPMENT ONLY)
  app.post("/api/process-sample-document", async (req, res, next) => {
    try {
      const { courseId } = req.body;
      
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }
      
      // Process the sample document
      const filePath = path.join(process.cwd(), "uploads", "leadership_ethics.txt");
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        return res.status(404).json({ message: "Sample document not found" });
      }
      
      await processDocument(filePath, parseInt(courseId));
      
      res.json({ message: "Sample document processed successfully" });
    } catch (error) {
      next(error);
    }
  });
  
  // Create and return the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
