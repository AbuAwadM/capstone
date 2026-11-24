import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  /** Existing image to show before a new file is picked (e.g. the product's current image). */
  src?: string | null;
  label?: string;
  className?: string;
  onChange: (file: File | null) => void;
}

function ImageUpload({ src = null, label = "Image", className = "", onChange }: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  // Temporary browser URL for the picked file, so it can be previewed before upload.
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);

  // Free the old temporary URL whenever it's replaced, and when the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const shownImage = previewUrl ?? (removed ? null : src);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0] ?? null;
    if (!picked) return;
    setPreviewUrl(URL.createObjectURL(picked));
    setRemoved(false);
    onChange(picked);
  }

  function handleRemove() {
    setPreviewUrl(null);
    setRemoved(true);
    if (inputRef.current) inputRef.current.value = "";
    onChange(null);
  }

  return (
    <div className={className}>
      <div className="relative">
        <label
          htmlFor={inputId}
          className="flex items-center justify-center w-full overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer h-24 hover:border-blue-400 hover:bg-blue-50 focus-within:ring-2 focus-within:ring-blue-600"
        >
          {shownImage ? (
            <img src={shownImage} alt={`${label} preview`} className="object-cover w-full h-full" />
          ) : (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <ImagePlus size={20} strokeWidth={1.5} aria-hidden="true" />
              {label}
            </span>
          )}
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>

        {shownImage && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remove ${label.toLowerCase()}`}
            className="absolute p-1 text-gray-700 bg-white rounded-full shadow top-1.5 right-1.5 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
