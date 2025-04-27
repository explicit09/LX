import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createEmbedding, summarizeDocument } from "./openai";

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
    // Check if JSON file exists
    if (!fsSync.existsSync(`${vectorDbPath}.json`)) {
      return {
        content: "No course materials have been indexed yet.",
        sources: [],
      };
    }
    
    // Load the chunks from JSON
    const data = await fs.readFile(`${vectorDbPath}.json`, 'utf8');
    const chunks: DocumentChunk[] = JSON.parse(data);
    
    if (chunks.length === 0) {
      return {
        content: "No course materials have been indexed yet.",
        sources: [],
      };
    }
    
    // Create embedding for the question
    const questionEmbedding = await createEmbedding(question);
    
    // Compute cosine similarity between question embedding and each chunk embedding
    const similarities: { index: number; score: number }[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      const chunkEmbedding = chunks[i].embedding;
      const similarity = cosineSimilarity(questionEmbedding, chunkEmbedding);
      similarities.push({ index: i, score: similarity });
    }
    
    // Sort by similarity score (descending)
    similarities.sort((a, b) => b.score - a.score);
    
    // Get top 5 most relevant chunks
    const TOP_K = 5;
    const topIndices = similarities.slice(0, TOP_K).map(item => item.index);
    const relevantChunks = topIndices.map(index => chunks[index]);
    
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

// Helper function to compute cosine similarity between two vectors
function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }
  
  return dotProduct / (mag1 * mag2);
}

/**
 * Get the path to the vector database for a course
 */
export function getVectorDBPath(courseId: number): string {
  return path.join(INDEXES_DIR, `course_${courseId}`);
}
