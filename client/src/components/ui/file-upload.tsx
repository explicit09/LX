import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Upload, FileText, Music } from "lucide-react";

interface FileWithPreview extends File {
  id: string;
  preview?: string;
}

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload = ({
  onFilesChange,
  accept = ".pdf,.mp3,.wav",
  multiple = true,
  maxSize = 50, // 50MB default
  className = "",
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      
      // Check file type (if accept is specified)
      if (accept) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = accept.split(',').map(type => 
          type.trim().replace('.', '').toLowerCase()
        );
        
        if (fileExtension && !acceptedTypes.includes(fileExtension)) {
          alert(`File ${file.name} is not an accepted file type.`);
          return false;
        }
      }
      
      return true;
    });

    const newFilesWithId = validFiles.map((file) => ({
      ...file,
      id: crypto.randomUUID(),
    }));

    setFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...newFilesWithId];
      // Update parent component
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const removeFile = (id: string) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== id);
      // Update parent component
      onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    
    if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6 text-primary" />;
    } else if (fileType.includes('audio')) {
      return <Music className="h-6 w-6 text-accent" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500 mb-1">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-xs text-gray-400">
          Accepted formats: {accept.split(",").join(", ")}
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-gray-50 rounded-md p-3 border border-gray-200 file-card"
            >
              <div className="flex items-center">
                {getFileIcon(file)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
