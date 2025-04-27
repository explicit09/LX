import OpenAI from "openai";
import fs from "fs";
import path from "path";
import util from "util";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "your-api-key";
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

/**
 * Transcribe an audio file using OpenAI's Whisper model
 */
export async function transcribeAudio(audioFilePath: string): Promise<string> {
  try {
    const audioReadStream = fs.createReadStream(audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribing audio:", error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

/**
 * Generate an answer based on course materials using GPT-4o
 */
export async function summarizeWithLLM(question: string, context: string): Promise<string> {
  try {
    const prompt = `
      You are a helpful course assistant. You help students understand the course materials.
      Your task is to answer the student's question based ONLY on the provided context from course materials.
      
      If the provided context doesn't contain relevant information to answer the question,
      politely state that you don't have enough information from the course materials to answer correctly
      and suggest that the student should refer to specific course materials or ask the professor.
      
      Never make up information or offer personal opinions. Always cite the source of your information.
      
      STUDENT QUESTION: ${question}
      
      CONTEXT FROM COURSE MATERIALS:
      ${context}
      
      Provide a clear, concise, and accurate answer based only on the context above.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3, // Lower temperature for more factual and direct responses
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Sorry, I couldn't generate an answer.";
  } catch (error) {
    console.error("Error generating summary with LLM:", error);
    return "I apologize, but I'm having trouble processing your request. Please try again later.";
  }
}

/**
 * Summarize a document to create a high-quality embedding
 */
export async function summarizeDocument(text: string): Promise<string> {
  try {
    // Only summarize if the text is very long
    if (text.length < 4000) {
      return text;
    }
    
    const prompt = `
      Please summarize the following text, retaining all key information, main points, technical terms, and important details:
      
      ${text.substring(0, 15000)} ${text.length > 15000 ? '... (text truncated)' : ''}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500,
    });

    return response.choices[0].message.content || text.substring(0, 4000);
  } catch (error) {
    console.error("Error summarizing document:", error);
    return text.substring(0, 4000); // Return truncated text if summarization fails
  }
}

/**
 * Create embeddings for text using OpenAI Ada-002 model
 */
export async function createEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw new Error(`Failed to create embedding: ${error.message}`);
  }
}
