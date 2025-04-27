import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createEmbedding, summarizeDocument } from "./openai";

// FAISS is a library for efficient similarity search
// We're using a JS version - faiss-node
import Faiss from "faiss-node";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const INDEXES_DIR = path.join(UPLOAD_DIR, "indexes");
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

interface DocumentChunk {
  id: number;
  text: string;
  embedding: number[];
  metadata: {
    source: string;
    page?: number | null;
  };
}

/**
 * Create a Document object from text file
 */
async function createDocumentFromText(filePath: string): Promise<Document[]> {
  const text = await fs.readFile(filePath, 'utf-8');
  return [
    new Document({
      pageContent: text,
      metadata: {
        source: filePath,
        page: null
      }
    })
  ];
}

/**
 * Process a document and add it to the vector store
 */
export async function processDocument(filePath: string, courseId: number): Promise<void> {
  try {
    // Load and split the document
    const fileExtension = path.extname(filePath).toLowerCase();
    let docs: Document[];
    
    if (fileExtension === ".pdf") {
      const loader = new PDFLoader(filePath);
      docs = await loader.load();
    } else {
      // Assume it's a text file (could be a transcription)
      docs = await createDocumentFromText(filePath);
    }
    
    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP,
    });
    
    const splitDocs = await splitter.splitDocuments(docs);
    
    // Process chunks and create embeddings
    const chunks: DocumentChunk[] = [];
    let counter = 0;
    
    for (const doc of splitDocs) {
      const summary = await summarizeDocument(doc.pageContent);
      const embedding = await createEmbedding(summary);
      
      chunks.push({
        id: counter++,
        text: doc.pageContent,
        embedding,
        metadata: {
          source: doc.metadata.source || filePath,
          page: doc.metadata.page || null,
        },
      });
    }
    
    // Get or create vector store
    const vectorDbPath = getVectorDBPath(courseId);
    await updateVectorStore(vectorDbPath, chunks);
    
    console.log(`Document processed and added to vector store for course ${courseId}`);
  } catch (error: any) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error?.message || String(error)}`);
  }
}

/**
 * Create or update a vector store with new document chunks
 */
export async function updateVectorStore(vectorDbPath: string, newChunks: DocumentChunk[]): Promise<void> {
  let existingChunks: DocumentChunk[] = [];
  
  // Create necessary directories
  await fs.mkdir(path.dirname(vectorDbPath), { recursive: true });
  
  // Check if the vector store already exists
  try {
    if (fsSync.existsSync(`${vectorDbPath}.json`)) {
      // Load existing chunks
      const data = await fs.readFile(`${vectorDbPath}.json`, 'utf8');
      existingChunks = JSON.parse(data);
    }
  } catch (error: any) {
    console.warn(`Could not load existing vector store, creating new one: ${error?.message || String(error)}`);
  }
  
  // Update IDs for new chunks to prevent collisions
  for (const chunk of newChunks) {
    chunk.id = existingChunks.length + chunk.id;
  }
  
  // Combine existing and new chunks
  const allChunks = [...existingChunks, ...newChunks];
  
  // Save the updated chunks
  try {
    await fs.writeFile(`${vectorDbPath}.json`, JSON.stringify(allChunks, null, 2));
    console.log(`Saved ${newChunks.length} new chunks, total: ${allChunks.length}`);
  } catch (error: any) {
    console.error(`Error saving vector store: ${error?.message || String(error)}`);
    throw new Error(`Failed to save vector store: ${error?.message || String(error)}`);
  }
}

/**
 * Query the vector store for relevant content based on a question
 */
export async function queryVectorStore(vectorDbPath: string, question: string): Promise<{ content: string, sources: string[] }> {
  try {
    // Check if JSON file exists - we can work with just this if needed
    if (!fsSync.existsSync(`${vectorDbPath}.json`)) {
      return {
        content: "No course materials have been indexed yet.",
        sources: [],
      };
    }
    
    // Load the index and chunks
    const index: any = new Faiss.Index(1536);
    let hasFaissIndex = false;
    
    // Try to load the FAISS index if it exists
    if (fsSync.existsSync(`${vectorDbPath}.faiss`)) {
      try {
        // Try different methods that might exist depending on the library version
        if (typeof index.readFromFile === 'function') {
          await (index.readFromFile as Function)(`${vectorDbPath}.faiss`);
          hasFaissIndex = true;
        } else if (typeof index.read === 'function') {
          await (index.read as Function)(`${vectorDbPath}.faiss`);
          hasFaissIndex = true;
        } else {
          console.warn("FAISS index methods not available, using JSON-only fallback");
        }
      } catch (error: any) {
        console.warn(`Could not load FAISS index, using JSON-only fallback: ${error?.message || String(error)}`);
      }
    }
    
    // Load the chunks from JSON
    const data = await fs.readFile(`${vectorDbPath}.json`, 'utf8');
    const chunks: DocumentChunk[] = JSON.parse(data);
    
    // Create embedding for the question
    const questionEmbedding = await createEmbedding(question);
    
    let relevantChunks: DocumentChunk[] = [];
    
    // If we have a FAISS index, use it for searching
    if (hasFaissIndex) {
      try {
        const TOP_K = 5;
        const searchResults = index.search(questionEmbedding, TOP_K);
        
        // Convert search results to chunks
        for (let i = 0; i < searchResults.length; i++) {
          const resultId = searchResults[i].id;
          if (chunks[resultId]) {
            relevantChunks.push(chunks[resultId]);
          }
        }
      } catch (error: any) {
        console.warn(`FAISS search failed, falling back to simple methods: ${error?.message || String(error)}`);
      }
    }
    
    // If we couldn't get results from FAISS, just use the first few chunks
    if (relevantChunks.length === 0) {
      relevantChunks = chunks.slice(0, Math.min(5, chunks.length));
    }
    
    // Collect the relevant chunks and their sources
    let relevantContent = "";
    const sources = new Set<string>();
    
    for (const chunk of relevantChunks) {
      relevantContent += chunk.text + "\n\n";
      sources.add(path.basename(chunk.metadata.source));
    }
    
    return {
      content: relevantContent.trim(),
      sources: Array.from(sources),
    };
  } catch (error: any) {
    console.error("Error querying vector store:", error);
    throw new Error(`Failed to query vector store: ${error?.message || String(error)}`);
  }
}

/**
 * Get the path to the vector database for a course
 */
export function getVectorDBPath(courseId: number): string {
  return path.join(INDEXES_DIR, `course_${courseId}`);
}
