import React, { useState, useRef, useCallback } from 'react';

interface FileUploadProps {
  courseId: number;
  onUploadSuccess?: (fileInfo: UploadedFile) => void;
  onUploadError?: (error: string) => void;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in MB
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url: string;
}

// Default allowed file types and max size
const DEFAULT_ALLOWED_TYPES = ['.pdf', '.docx', '.pptx', '.mp3', '.mp4'];
const DEFAULT_MAX_SIZE = 50; // 50MB

const FileUpload: React.FC<FileUploadProps> = ({
  courseId,
  onUploadSuccess,
  onUploadError,
  allowedFileTypes = DEFAULT_ALLOWED_TYPES,
  maxFileSize = DEFAULT_MAX_SIZE,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    
    const file = files[0];
    
    // Check file type
    const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedFileTypes.includes(fileExt)) {
      const error = `Invalid file type. Allowed types: ${allowedFileTypes.join(', ')}`;
      setError(error);
      onUploadError?.(error);
      return;
    }
    
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      const error = `File too large. Maximum size: ${maxFileSize}MB`;
      setError(error);
      onUploadError?.(error);
      return;
    }
    
    // Begin upload process
    setIsUploading(true);
    setError(null);
    
    // Simulate upload progress
    const mockUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) {
          progress = 100;
          clearInterval(interval);
          
          // Mock successful upload
          setTimeout(() => {
            const mockFile: UploadedFile = {
              id: Math.random().toString(36).substring(2, 9),
              name: file.name,
              type: file.type,
              size: file.size,
              uploadDate: new Date(),
              url: URL.createObjectURL(file),
            };
            
            setUploadedFiles(prev => [...prev, mockFile]);
            setIsUploading(false);
            setUploadProgress(0);
            onUploadSuccess?.(mockFile);
          }, 500);
        }
        setUploadProgress(Math.floor(progress));
      }, 300);
    };
    
    // Start mock upload after a short delay
    setTimeout(mockUpload, 300);
  }, [allowedFileTypes, maxFileSize, onUploadError, onUploadSuccess]);

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Handle browse button click
  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  // Format bytes to human-readable size
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Format file type icon
  const getFileIcon = (type: string): JSX.Element => {
    if (type.includes('pdf')) {
      return (
        <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes('audio')) {
      return (
        <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    } else if (type.includes('video')) {
      return (
        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    } else if (type.includes('word') || type.includes('document')) {
      return (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else if (type.includes('presentation') || type.includes('powerpoint')) {
      return (
        <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      );
    } else {
      return (
        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
            : 'border-neutral-300 hover:border-primary-400 dark:border-neutral-700 dark:hover:border-primary-600'
        }`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={allowedFileTypes.join(',')}
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
        
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full p-3 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mb-2">
            {isDragging ? 'Drop file here' : 'Drag and drop your file here'}
          </h3>
          
          <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
            or <button
              type="button"
              className="text-primary-600 dark:text-primary-400 hover:underline focus:outline-none"
              onClick={handleBrowseClick}
              disabled={isUploading}
            >
              browse
            </button> from your computer
          </p>
          
          <div className="text-xs text-neutral-500 dark:text-neutral-500">
            Allowed file types: {allowedFileTypes.join(', ')} (Max: {maxFileSize}MB)
          </div>
        </div>
        
        {/* Upload Progress */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/90 dark:bg-neutral-900/90 flex flex-col items-center justify-center rounded-xl">
            <div className="w-48 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-primary-500 dark:bg-primary-400 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm font-medium">{uploadProgress}% Uploading...</div>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
          <ul className="space-y-3">
            {uploadedFiles.map((file) => (
              <li
                key={file.id}
                className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 flex items-center justify-between"
              >
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <div className="ml-3">
                    <div className="font-medium">{file.name}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatBytes(file.size)} • Uploaded {file.uploadDate.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    title="View file"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button 
                    className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Remove file"
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
                    }}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 