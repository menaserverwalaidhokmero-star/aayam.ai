import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  Image as ImageIcon, 
  AlertCircle, 
  Check, 
  FileImage,
  FolderOpen
} from 'lucide-react';

export interface ImageFileMeta {
  name: string;
  size: number;
  formattedSize: string;
  type: string;
  isSample?: boolean;
}

interface ImageUploaderProps {
  id: string;
  label: string;
  currentImage: string | null;
  fileMeta: ImageFileMeta | null;
  accentColor?: 'cyan' | 'pink' | 'purple';
  onImageSelected: (previewUrl: string, base64Data: string, meta: ImageFileMeta) => void;
  onImageRemoved: () => void;
  onError: (errorMessage: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  id,
  label,
  currentImage,
  fileMeta,
  accentColor = 'cyan',
  onImageSelected,
  onImageRemoved,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentObjectUrlRef = useRef<string | null>(null);

  // Helper to format bytes to human readable string
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
        currentObjectUrlRef.current = null;
      }
    };
  }, []);

  // Validate and process selected file
  const processFile = (file: File) => {
    // 1. Validate file exists
    if (!file) return;

    // 2. Validate file type: JPG, JPEG, PNG, WEBP
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    const isValidMime = allowedTypes.includes(file.type.toLowerCase()) || file.type.startsWith('image/');
    const isValidExt = allowedExtensions.includes(fileExt);

    if (!isValidMime && !isValidExt) {
      onError('Unsupported file format. Please upload a valid JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // 3. Validate size (Max 20MB)
    const MAX_SIZE = 20 * 1024 * 1024; // 20 MB
    if (file.size > MAX_SIZE) {
      onError(`File size (${formatFileSize(file.size)}) exceeds the 20MB limit. Please choose a smaller image.`);
      return;
    }

    // 4. Create object URL for instant, zero-latency local preview
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    currentObjectUrlRef.current = objectUrl;

    // 5. Read file as base64 for API transmission to Gemini server
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const meta: ImageFileMeta = {
          name: file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          type: file.type || `image/${fileExt.replace('.', '')}`,
          isSample: false,
        };
        onImageSelected(objectUrl, reader.result, meta);
      }
    };
    reader.onerror = () => {
      onError('Failed to read image file from your device. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset file input value so selecting the exact same file again will re-trigger change
    e.target.value = '';
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  // Remove Image
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (currentObjectUrlRef.current) {
      URL.revokeObjectURL(currentObjectUrlRef.current);
      currentObjectUrlRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved();
  };

  // Trigger Replace
  const handleReplaceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const colorStyles = {
    cyan: {
      borderHover: 'hover:border-cyan-400/80',
      borderActive: 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_20px_rgba(6,182,212,0.3)]',
      textAccent: 'text-cyan-400',
      badgeBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
      btnReplace: 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border-cyan-500/40',
    },
    pink: {
      borderHover: 'hover:border-pink-400/80',
      borderActive: 'border-pink-400 bg-pink-950/20 shadow-[0_0_20px_rgba(236,72,153,0.3)]',
      textAccent: 'text-pink-400',
      badgeBg: 'bg-pink-950/80 border-pink-500/40 text-pink-300',
      btnReplace: 'bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 border-pink-500/40',
    },
    purple: {
      borderHover: 'hover:border-purple-400/80',
      borderActive: 'border-purple-400 bg-purple-950/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      textAccent: 'text-purple-400',
      badgeBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
      btnReplace: 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border-purple-500/40',
    },
  }[accentColor];

  return (
    <div className="space-y-3">
      {/* Label and File Meta Summary */}
      <div className="flex items-center justify-between">
        <label 
          htmlFor={id} 
          className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-2 cursor-pointer"
        >
          <Upload className={`w-3.5 h-3.5 ${colorStyles.textAccent}`} />
          <span>{label}</span>
        </label>
        {fileMeta && (
          <span className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
            {fileMeta.name}
          </span>
        )}
      </div>

      {/* Hidden standard file input supporting Android Gallery, Photos, Camera, Files */}
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*,image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
      />

      {/* Uploader Box: switches between Upload Dropzone and Active Preview Card */}
      {!currentImage ? (
        /* Empty / Upload Dropzone */
        <label
          htmlFor={id}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full min-h-[140px] rounded-2xl border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center p-5 text-center cursor-pointer select-none group active:scale-[0.99] ${
            isDragging 
              ? colorStyles.borderActive 
              : `border-purple-500/40 hover:border-cyan-400/70 bg-black/40 hover:bg-black/60 ${colorStyles.borderHover}`
          }`}
        >
          <div className="p-3 rounded-xl bg-purple-950/60 text-cyan-300 group-hover:scale-110 transition-transform mb-2.5 shadow-inner">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">
            Tap to upload from Android or drop image
          </span>
          <span className="text-[10px] text-slate-400 mt-1 font-mono">
            Supports Gallery, Photos, Camera • JPG, PNG, WEBP (Max 20MB)
          </span>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300 group-hover:bg-white/10 transition-colors">
            <FolderOpen className="w-3 h-3 text-cyan-400" />
            <span>Browse Device</span>
          </div>
        </label>
      ) : (
        /* Image Preview Box with Details & Actions */
        <div className="glass-panel p-3.5 rounded-2xl border border-white/15 space-y-3">
          <div className="flex items-center gap-3.5">
            {/* Image Thumbnail */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-black/60 border border-white/20 flex-shrink-0 shadow-lg">
              <img
                src={currentImage}
                alt={fileMeta?.name || 'Selected image preview'}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-300 flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Ready
                </span>
              </div>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <FileImage className={`w-3.5 h-3.5 ${colorStyles.textAccent} flex-shrink-0`} />
                <h4 className="text-xs font-semibold text-white truncate" title={fileMeta?.name}>
                  {fileMeta?.name || 'Uploaded Photograph'}
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                {fileMeta?.formattedSize && (
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10">
                    {fileMeta.formattedSize}
                  </span>
                )}
                {fileMeta?.type && (
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 uppercase">
                    {fileMeta.type.replace('image/', '')}
                  </span>
                )}
                {fileMeta?.isSample && (
                  <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    Sample Preset
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-400 line-clamp-1 pt-0.5">
                Ready for neural processing.
              </p>
            </div>
          </div>

          {/* Action Buttons: Replace Image & Remove Image */}
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleReplaceClick}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95 ${colorStyles.btnReplace}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Image</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-medium flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
