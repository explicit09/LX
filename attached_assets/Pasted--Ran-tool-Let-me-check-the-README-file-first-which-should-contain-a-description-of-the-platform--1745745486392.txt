

Ran tool
Let me check the README file first, which should contain a description of the platform.

Read file: README.md
Now let's look at the backend architecture by checking the docker-compose file and the run_backend.sh script:

Read file: docker-compose.yml

Read file: run_backend.sh
Let's check the requirements.txt file to see the Python dependencies:

Read file: requirements.txt
Let's also look at the frontend structure:

Ran tool

Read file: coralx-frontend/package.json
LINK-X is an AI-powered platform with a focus on RAG (Retrieval-Augmented Generation) capabilities, specifically designed for document processing and knowledge extraction. Here's a detailed overview:

## Platform Description

LINK-X is an open-source AI chatbot platform built with a modern tech stack that combines Next.js frontend with a Python-based backend for powerful document processing and retrieval capabilities. The platform specializes in creating searchable vector databases from PDF documents and providing an interactive question-answering interface.

## Technology Stack

### Frontend:
- **Framework**: Next.js 15 with App Router
- **UI Components**: shadcn/ui and Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Authentication**: NextAuth.js
- **Editor**: CodeMirror and ProseMirror for code and text editing
- **AI Integration**: Vercel AI SDK for unified LLM API access

### Backend:
- **Language**: Python 3.10+
- **Vector Database**: FAISS (Facebook AI Similarity Search)
- **AI Models**: OpenAI models (GPT-4o, GPT-4o-mini, Ada-002 for embeddings)
- **Document Processing**: LangChain for document handling
- **Web Interface**: Streamlit for RAG testing UI
- **PDF Processing**: PyPDF2 and related libraries
- **Container**: Docker for deployment
- **Database**: Vercel Postgres (powered by Neon)
- **File Storage**: Vercel Blob

## Core Features

1. **Document Processing Pipeline**:
   - Loads PDF documents
   - Splits documents into manageable chunks
   - Creates vector embeddings using OpenAI's Ada-002
   - Stores vectors in FAISS database

2. **RAG System**:
   - Generates APA citations for source documents
   - Processes user queries with semantic matching
   - Retrieves relevant document chunks based on similarity
   - Creates context-aware responses with proper citations

3. **User Interface**:
   - Web-based chat interface
   - AI-powered question answering
   - Source citation display
   - Document exploration capabilities

4. **Authentication & Data Persistence**:
   - User authentication through NextAuth.js
   - Chat history storage in Postgres
   - File storage with Vercel Blob

## Architecture

The system follows a containerized approach with Docker, separating the frontend and backend services:

1. **Frontend Container**: Next.js application with React components
2. **Backend Container**: Python-based RAG system and API endpoints

Data flows through several processing stages:
1. Document ingestion and chunking
2. Vector embedding generation
3. Storage in FAISS index
4. Query processing with similarity search
5. Context-aware response generation with LLM
6. Response delivery to user interface

## Development Setup

The platform can be run locally with:
1. Frontend: `bash run_frontend.sh` (runs on localhost:3000)
2. Backend: `docker-compose up --build` (runs on localhost:8080 with Streamlit UI on localhost:8501)

For FAISS database generation and testing, the system provides several utility scripts to process PDFs and create searchable knowledge bases.
