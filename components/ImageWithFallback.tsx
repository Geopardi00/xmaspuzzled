import React, { useState, useRef, useEffect } from 'react';
import { Upload, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  onImageUpdate: (originalSrc: string, newSrc: string) => void;
  overriddenSrc?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, onImageUpdate, overriddenSrc }) => {
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset error state if the src changes (e.g. moving between levels)
  useEffect(() => {
    setError(false);
  }, [src]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onImageUpdate(src, objectUrl);
      setError(false);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const displaySrc = overriddenSrc || src;

  if (error) {
    return (
      <div 
        onClick={triggerUpload}
        className={`bg-slate-900 border-2 border-dashed border-red-900/50 flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-slate-800 transition-colors group ${className}`}
      >
        <ImageOff className="w-12 h-12 text-red-700 mb-2 group-hover:scale-110 transition-transform" />
        <span className="text-red-500 font-cinzel font-bold text-lg text-center">Missing Evidence</span>
        <span className="text-slate-400 font-mono text-xs text-center mt-2 flex items-center gap-2">
          <Upload size={14} /> Click to upload local image
        </span>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <>
      <img
        src={displaySrc}
        alt={alt}
        className={className}
        onError={() => setError(true)}
      />
      {/* Hidden input in case we want to re-upload even if visible (optional, keeping minimal for now) */}
    </>
  );
};

export default ImageWithFallback;