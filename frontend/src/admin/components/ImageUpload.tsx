import { useRef, useState } from 'react';
import Button from '@/components/ui/Button';
import { ImageIcon } from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { cx } from '@/lib/cx';
import { adminApi } from '../adminApi';
import { useAuth } from '../AuthContext';

const MAX_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

type ImageUploadProps = {
  value: string | null;
  onChange: (url: string | null) => void;
  error?: string;
};

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { markSignedOut } = useAuth();

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (!ACCEPTED.includes(file.type)) {
      setUploadError('Choose a JPG, PNG or WebP image.');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`That image is larger than ${MAX_MB} MB.`);
      return;
    }

    setUploading(true);
    try {
      const result = await adminApi.uploadImage(file);
      onChange(result.url);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) markSignedOut();
      setUploadError(err instanceof ApiError ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const message = uploadError ?? error;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          void upload(event.target.files?.[0]);
          event.target.value = '';
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl bg-surface-muted">
          <img src={value} alt="Cover preview" className="aspect-[16/10] w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <Spinner className="h-6 w-6" label="Uploading" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            void upload(event.dataTransfer.files[0]);
          }}
          disabled={uploading}
          className={cx(
            'flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors',
            dragging ? 'border-ink bg-brand/10' : 'border-line hover:border-ink-subtle',
          )}
        >
          {uploading ? <Spinner className="h-6 w-6" label="Uploading" /> : <ImageIcon width={28} height={28} className="text-ink-muted" />}
          <span className="text-sm font-medium">{uploading ? 'Uploading…' : 'Drop an image or click to upload'}</span>
          <span className="text-xs text-ink-muted">JPG, PNG or WebP, up to {MAX_MB} MB</span>
        </button>
      )}

      {value && (
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading}>
            Replace
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onChange(null)} disabled={uploading}>
            Remove
          </Button>
        </div>
      )}

      {message && <p className="mt-2 text-sm text-red-400">{message}</p>}
    </div>
  );
}
