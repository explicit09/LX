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
  } catch (error) {
    console.error("Error processing document:", error);
    throw new Error(`Failed to process document: ${error.message}`);
  }
}

/**
 * Create or update a vector store with new document chunks
 */
export async function updateVectorStore(vectorDbPath: string, newChunks: DocumentChunk[]): Promise<void> {
  let existingChunks: DocumentChunk[] = [];
  let index: any = null;
  
  // Create necessary directories
  await fs.mkdir(path.dirname(vectorDbPath), { recursive: true });
  
  // Check if the vector store already exists
  try {
    if (fsSync.existsSync(`${vectorDbPath}.json`)) {
      // Load existing chunks and index
      const data = await fs.readFile(`${vectorDbPath}.json`, 'utf8');
      existingChunks = JSON.parse(data);
      
      if (fsSync.existsSync(`${vectorDbPath}.faiss`)) {
        index = new Faiss.Index(1536); // Ada-002 embeddings are 1536 dimensions
        await index.readFromFile(`${vectorDbPath}.faiss`);
      }
    }
  } catch (error) {
    console.warn(`Could not load existing vector store, creating new one: ${error.message}`);
  }
  
  if (!index) {
    index = new Faiss.Index(1536); // Ada-002 embeddings are 1536 dimensions
  }
  
  // Add new chunks
  for (const chunk of newChunks) {
    chunk.id = existingChunks.length + chunk.id;
    index.add(chunk.embedding);
  }
  
  // Combine existing and new chunks
  const allChunks = [...existingChunks, ...newChunks];
  
  // Save the updated index and metadata
  await index.writeToFile(`${vectorDbPath}.faiss`);
  await fs.writeFile(`${vectorDbPath}.json`, JSON.stringify(allChunks, null, 2));
}

/**
 * Query the vector store for relevant content based on a question
 */
export async function queryVectorStore(vectorDbPath: string, question: string): Promise<{ content: string, sources: string[] }> {
  try {
    // Check if vector store exists
    if (!fsSync.existsSync(`${vectorDbPath}.faiss`) || !fsSync.existsSync(`${vectorDbPath}.json`)) {
      return {
        content: "No course materials have been indexed yet.",
        sources: [],
      };
    }
    
    // Load the index and chunks
    const index = new Faiss.Index(1536);
    await index.readFromFile(`${vectorDbPath}.faiss`);
    
    const data = await fs.readFile(`${vectorDbPath}.json`, 'utf8');
    const chunks: DocumentChunk[] = JSON.parse(data);
    
    // Create embedding for the question
    const questionEmbedding = await createEmbedding(question);
    
    // Search for relevant chunks
    const TOP_K = 5;
    const searchResults = index.search(questionEmbedding, TOP_K);
    
    // Collect the relevant chunks and their sources
    let relevantContent = "";
    const sources = new Set<string>();
    
    for (const result of searchResults) {
      const chunk = chunks[result.id];
      if (chunk) {
        relevantContent += chunk.text + "\n\n";
        sources.add(path.basename(chunk.metadata.source));
      }
    }
    
    return {
      content: relevantContent.trim(),
      sources: Array.from(sources),
    };
  } catch (error) {
    console.error("Error querying vector store:", error);
    throw new Error(`Failed to query vector store: ${error.message}`);
  }
}

/**
 * Get the path to the vector database for a course
 */
export function getVectorDBPath(courseId: number): string {
  return path.join(INDEXES_DIR, `course_${courseId}`);
}
