import React, { useState, useEffect, useRef } from 'react';
import nvsEmblemSvg from '../assets/images/nvs_emblem.svg';
import nvsLogoImg from '../assets/images/nvs_logo_1784894137818.jpg';
import { Camera, RotateCcw, UploadCloud } from 'lucide-react';

interface NvsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showText?: boolean;
  interactiveUpload?: boolean;
}

export const NvsLogo: React.FC<NvsLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  interactiveUpload = false,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem('jnv_custom_logo');
    } catch {
      return null;
    }
  });

  const [useFallback, setUseFallback] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync custom logo across instances via custom storage event
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        setCustomLogo(localStorage.getItem('jnv_custom_logo'));
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('jnv_logo_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('jnv_logo_updated', handleStorageChange);
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        try {
          localStorage.setItem('jnv_custom_logo', dataUrl);
          setCustomLogo(dataUrl);
          setUseFallback(false);
          window.dispatchEvent(new Event('jnv_logo_updated'));
        } catch (err) {
          console.error('Failed to save image:', err);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem('jnv_custom_logo');
      setCustomLogo(null);
      setUseFallback(false);
      window.dispatchEvent(new Event('jnv_logo_updated'));
    } catch {
      // ignore
    }
  };

  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24 sm:w-28 sm:h-28',
    '3xl': 'w-32 h-32 sm:w-36 sm:h-36',
  };

  // Determine active source:
  // 1. Custom uploaded logo if user uploaded one
  // 2. Vector SVG emblem (pristine high-resolution with authentic Hindi motto & crest)
  // 3. Raster image as fallback
  const activeLogoSrc = customLogo || (!useFallback ? nvsEmblemSvg : nvsLogoImg);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        id="nvs-logo-container"
        onClick={() => {
          if (interactiveUpload && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        className={`relative ${sizeMap[size]} rounded-2xl overflow-hidden bg-white p-1.5 shadow-lg border border-slate-200/90 dark:border-slate-700 ring-2 ring-amber-500/20 dark:ring-amber-400/20 shrink-0 flex items-center justify-center group ${
          interactiveUpload ? 'cursor-pointer hover:ring-amber-500/60 hover:shadow-xl transition-all duration-200' : ''
        }`}
        title={interactiveUpload ? 'Click to change or upload logo image' : 'Navodaya Vidyalaya Samiti Official Emblem'}
      >
        {/* The Exact Image Element matching CSS selector 1 */}
        <img
          id="nvs-logo-img"
          src={activeLogoSrc}
          alt="Navodaya Vidyalaya Samiti Logo"
          className="w-full h-full object-contain rounded-xl transition-transform duration-200 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
          onError={() => {
            if (!useFallback && !customLogo) {
              setUseFallback(true);
            }
          }}
        />

        {/* Interactive Overlay when hovering over Auth screen logo */}
        {interactiveUpload && isHovered && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center text-white p-1 transition-opacity animate-in fade-in duration-150">
            <Camera className="w-5 h-5 text-amber-400 mb-0.5" />
            <span className="text-[10px] font-bold text-center leading-none text-slate-100">
              {customLogo ? 'Change Image' : 'Upload Image'}
            </span>
          </div>
        )}

        {/* Hidden File Input for Custom Image Upload */}
        {interactiveUpload && (
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            aria-label="Upload custom school logo image"
          />
        )}
      </div>

      {/* Optional Reset / Helper Buttons when custom image is active */}
      {interactiveUpload && customLogo && (
        <button
          type="button"
          onClick={handleResetLogo}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors"
          title="Reset to official NVS emblem"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Official Emblem</span>
        </button>
      )}

      {interactiveUpload && !customLogo && size === '2xl' && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline transition-all"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Change / Upload Image</span>
        </button>
      )}

      {showText && (
        <div className="leading-tight text-center">
          <div className="font-black text-slate-900 dark:text-white tracking-tight text-sm sm:text-base">
            Navodaya Vidyalaya Samiti
          </div>
          <p className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">
            JNV Junagadh • JNV Best Day
          </p>
        </div>
      )}
    </div>
  );
};
