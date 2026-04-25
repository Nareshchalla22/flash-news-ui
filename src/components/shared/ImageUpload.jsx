import { useState, useRef } from 'react';
import { mediaService } from '../../services/api';

/**
 * ImageUpload — reusable S3-connected image uploader
 *
 * Props:
 *   value       {string}   — current image URL (S3 or empty)
 *   onChange    {function} — called with new S3 URL after upload
 *   folder      {string}   — S3 folder (default: 'news')
 *   label       {string}   — field label
 *   maxMB       {number}   — max file size in MB (default: 5)
 *   height      {number}   — preview height in px (default: 140)
 *
 * Usage:
 *   <ImageUpload
 *     value={form.imageUrl}
 *     onChange={(url) => setForm(f => ({ ...f, imageUrl: url }))}
 *     folder="news"
 *     label="News Image"
 *   />
 */
export default function ImageUpload({
  value,
  onChange,
  folder  = 'news',
  label   = 'Image',
  maxMB   = 5,
  height  = 140,
}) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [progress,  setProgress]  = useState(0);
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large. Max ${maxMB}MB allowed.`);
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(10);

    try {
      // Simulate progress (real progress requires axios onUploadProgress)
      const tick = setInterval(() => setProgress(p => Math.min(p + 15, 85)), 300);

      const res = await mediaService.uploadFile(file, folder);
      clearInterval(tick);
      setProgress(100);

      // res.data.url is the public S3 URL
      onChange(res.data.url);

      setTimeout(() => setProgress(0), 800);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Upload failed. Check S3 config or file size.'
      );
      setProgress(0);
    } finally {
      setUploading(false);
      // Reset input so same file can be re-uploaded
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      await mediaService.deleteFile(value);
    } catch {
      // Silently fail delete — image might already be gone
    }
    onChange('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleFile(fakeEvent);
    }
  };

  return (
    <div>
      {/* Label */}
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 700,
        color: '#475569', textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: 6,
      }}>
        {label}
        <span style={{ color: '#334155', marginLeft: 6, fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>
          (max {maxMB}MB · S3)
        </span>
      </label>

      {/* Drop zone / preview */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        style={{
          border: `2px dashed ${error ? '#991b1b' : value ? '#22c55e40' : '#1e293b'}`,
          borderRadius: 12,
          overflow: 'hidden',
          background: value ? '#0a0f1e' : '#0a0f1e',
          transition: 'border-color 0.2s',
          cursor: uploading ? 'wait' : 'pointer',
          position: 'relative',
        }}
        onClick={() => !uploading && fileRef.current?.click()}
        onMouseEnter={e => !value && (e.currentTarget.style.borderColor = '#ef444460')}
        onMouseLeave={e => !value && (e.currentTarget.style.borderColor = error ? '#991b1b' : '#1e293b')}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />

        {/* Preview */}
        {value ? (
          <div style={{ position: 'relative', height }}>
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
            {/* Overlay on hover */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 10,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
            >
              <button
                onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: '#1e293b', border: '1px solid #334155',
                  color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  opacity: 0, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                🔄 Change
              </button>
              <button
                onClick={e => { e.stopPropagation(); handleRemove(); }}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
                  color: '#f87171', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  opacity: 0, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
              >
                🗑 Remove
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            height, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16,
          }}>
            {uploading ? (
              <>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  border: '3px solid #1e293b', borderTopColor: '#ef4444',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
                  Uploading to S3…
                </span>
              </>
            ) : (
              <>
                <div style={{ fontSize: 28, opacity: 0.4 }}>📷</div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#475569', margin: 0 }}>
                    Click or drag & drop
                  </p>
                  <p style={{ fontSize: 11, color: '#334155', margin: '3px 0 0' }}>
                    Uploads directly to AWS S3
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Progress bar */}
        {progress > 0 && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
            background: '#1e293b',
          }}>
            <div style={{
              height: '100%', borderRadius: 3,
              background: 'linear-gradient(90deg, #ef4444, #22c55e)',
              width: `${progress}%`, transition: 'width 0.3s ease',
            }} />
          </div>
        )}
      </div>

      {/* S3 URL display */}
      {value && !uploading && (
        <div style={{
          marginTop: 6, padding: '5px 10px', borderRadius: 6,
          background: '#0a0f1e', border: '1px solid #1e293b',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 700 }}>✓ S3</span>
          <span style={{
            fontSize: 10, color: '#334155', fontFamily: 'monospace',
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {value}
          </span>
          <a href={value} target="_blank" rel="noreferrer" style={{ color: '#475569', fontSize: 10 }}>↗</a>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: '#f87171', fontSize: 11, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚠ {error}
        </p>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}