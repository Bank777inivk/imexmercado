import React, { useState, useRef, useCallback } from 'react';
import { CloudArrowUp, Image, X, CheckCircle, WarningCircle, Spinner } from '@phosphor-icons/react';

// ─── CONFIGURATION CLOUDINARY (via .env.local) ───────────────────────────────
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
// ─────────────────────────────────────────────────────────────────────────────


interface CloudinaryUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  resourceType?: 'image' | 'video' | 'auto';
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function CloudinaryUploader({ 
  value, 
  onChange, 
  label = 'Média', 
  resourceType = 'auto' 
}: CloudinaryUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      setErrorMsg('Seuls les fichiers image ou vidéo sont acceptés.');
      setStatus('error');
      return;
    }

    const limit = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > limit) {
      setErrorMsg(`Le fichier dépasse la limite de ${isVideo ? '50' : '10'} Mo.`);
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    const typeToUpload = resourceType === 'auto' 
      ? (isVideo ? 'video' : 'image') 
      : resourceType;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'imexmercado/cms');

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${typeToUpload}/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          onChange(data.secure_url);
          setStatus('success');
          setProgress(100);
        } else {
          const err = JSON.parse(xhr.responseText);
          setErrorMsg(err?.error?.message || 'Erreur lors de l\'upload.');
          setStatus('error');
        }
      };

      xhr.onerror = () => {
        setErrorMsg('Erreur réseau. Vérifiez votre connexion.');
        setStatus('error');
      };

      xhr.send(formData);
    } catch {
      setErrorMsg('Erreur inattendue lors de l\'upload.');
      setStatus('error');
    }
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleReset = () => {
    onChange('');
    setStatus('idle');
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block ml-1">{label}</label>

      {/* Preview Zone */}
      {value ? (
        <div className="relative group rounded-[2rem] overflow-hidden border-2 border-gray-200 bg-gray-50 aspect-square">
          {value.includes('/video/upload/') || value.endsWith('.mp4') ? (
            <video 
              src={value} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover p-2"
            />
          ) : (
            <img src={value} alt="Aperçu" className="w-full h-full object-contain p-4 transition-opacity group-hover:opacity-60" />
          )}
          {/* Overlay on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-3 bg-white/80 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg"
            >
              <CloudArrowUp size={16} weight="bold" />
              Remplacer
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl"
            >
              <X size={16} weight="bold" />
              Supprimer
            </button>
          </div>
          {/* Status badge */}
          {status === 'success' && (
            <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-md">
              <CheckCircle size={14} weight="fill" />
            </div>
          )}
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
            ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-gray-200 bg-gray-50 hover:border-primary/40 hover:bg-primary/[0.02]'}
            ${status === 'error' ? 'border-red-300 bg-red-50' : ''}`}
        >
          {status === 'uploading' ? (
            <div className="flex flex-col items-center gap-4 px-8 w-full">
              <Spinner size={36} className="text-primary animate-spin" weight="bold" />
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Upload en cours... {progress}%</p>
            </div>
          ) : (
            <>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${status === 'error' ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'}`}>
                {status === 'error' ? <WarningCircle size={32} weight="bold" /> : <Image size={32} weight="thin" />}
              </div>
              <div className="text-center px-4">
                {status === 'error' ? (
                  <p className="text-xs font-black text-red-500">{errorMsg}</p>
                ) : (
                  <>
                    <p className="text-xs font-black text-gray-700 mb-1">Glissez un média ici</p>
                    <p className="text-[10px] text-gray-400 font-medium">ou cliquez pour parcourir</p>
                    <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-2 px-4">
                      {resourceType === 'video' ? 'MP4 — Max 50 Mo' : 'JPG, PNG, WEBP, MP4'}
                    </p>
                  </>
                )}
              </div>
              {status === 'error' && (
                <button
                  type="button"
                  className="text-[10px] font-black text-primary uppercase tracking-widest"
                  onClick={(e) => { e.stopPropagation(); setStatus('idle'); setErrorMsg(''); }}
                >
                  Réessayer
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={resourceType === 'video' ? 'video/mp4' : 'image/*,video/mp4'}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* URL field as fallback */}
      <div>
        <label className="text-[9px] font-black uppercase tracking-widest text-gray-300 block mb-1.5 ml-1">
          Ou collez un lien direct
        </label>
        <input
          type="text"
          className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-primary/10 outline-none transition-all text-gray-500 placeholder-gray-300"
          placeholder="https://res.cloudinary.com/..."
          value={value}
          onChange={(e) => { onChange(e.target.value); setStatus('idle'); }}
        />
      </div>
    </div>
  );
}
