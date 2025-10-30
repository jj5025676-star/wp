import { useState } from 'react';
import { cn } from '../common/utils';

interface ImageUploaderProps {
  maxImages: number;
}

export function ImageUploader({ maxImages }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;

    for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            setImages((prev) => [...prev, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {images.length < maxImages && (
        <label className={cn(
          'flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border bg-background transition-colors hover:bg-accent',
          images.length === 0 ? 'h-full' : ''
        )}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="text-center text-sm text-muted-foreground">
            <p>点击上传图像</p>
            <p className="text-xs">最多 {maxImages} 张</p>
          </div>
        </label>
      )}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`上传的图像 ${idx + 1}`}
                className="h-32 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
