import { useState, useRef } from 'react';
import { mediaService } from '../../services/api';

/**
 * MultiImageUpload — upload several images to S3 for one news post.
 *
 * Props
 *   value     string[]            current image URLs (first = cover image)
 *   onChange  (string[]) => void  called with the full new list
 *   max       number              max images (default 10)
 *   maxMB     number              max size per file (default 10)
 *   light     boolean             light theme (UpdateNews); default dark (Admin)
 *   folder    string              S3 folder (default 'news')
 */
export default function MultiImageUpload({
  value = [], onChange, max = 10, maxMB = 10, light = false, folder = 'news',
}) {
  const [busy, setBusy]     = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError]   = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileRef = useRef(null);
  const listRef = useRef(value);
  if (!busy) listRef.current = value;

  const t = light
    ? { box: 'bg-slate-50 border-slate-300 hover:border-blue-400', text: 'text-slate-600', sub: 'text-slate-400',
        input: 'bg-white border-slate-200 text-slate-800', btn: 'bg-slate-900 text-white' }
    : { box: 'bg-slate-950 border-slate-700 hover:border-slate-500', text: 'text-slate-300', sub: 'text-slate-600',
        input: 'bg-slate-950 border-slate-800 text-slate-200', btn: 'bg-slate-700 text-white' };

  const push = (url) => {
    const next = [...listRef.current, url];
    listRef.current = next;
    onChange(next);
  };

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setError('');
    const room = max - listRef.current.length;
    if (room <= 0) { setError(`Maximum ${max} images allowed.`); return; }
    const queue = files.slice(0, room);
    if (files.length > room) setError(`Only ${room} more image(s) allowed — extra files skipped.`);

    setBusy(true);
    const failed = [];
    for (let i = 0; i < queue.length; i++) {
      const f = queue[i];
      setStatus(`Uploading ${i + 1} of ${queue.length}…`);
      if (!f.type.startsWith('image/')) { failed.push(`${f.name}: not an image`); continue; }
      if (f.size > maxMB * 1024 * 1024) { failed.push(`${f.name}: over ${maxMB}MB`); continue; }
      try {
        const res = await mediaService.uploadFile(f, folder);
        const url = res.data?.url || res.data?.imageUrl || res.data?.s3Url;
        if (!url) throw new Error('No URL returned');
        push(url);
      } catch (e) {
        failed.push(`${f.name}: ${e?.response?.status || 'network error'} ${e?.response?.data?.message || 'upload failed'}`);
      }
    }
    setBusy(false); setStatus('');
    if (failed.length) setError(failed.join(' · '));
    if (fileRef.current) fileRef.current.value = '';
  };

  const remove = (i) => {
    const next = value.filter((_, idx) => idx !== i);
    listRef.current = next; onChange(next);
  };
  const makeCover = (i) => {
    if (i === 0) return;
    const next = [value[i], ...value.filter((_, idx) => idx !== i)];
    listRef.current = next; onChange(next);
  };
  const addUrl = () => {
    const u = urlInput.trim();
    if (!/^https?:\/\//i.test(u)) { setError('Enter a valid http(s) image URL.'); return; }
    if (value.length >= max) { setError(`Maximum ${max} images allowed.`); return; }
    setError(''); push(u); setUrlInput('');
  };

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
             onChange={e => handleFiles(e.target.files)} />

      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {value.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover"
                   onError={e => { e.currentTarget.style.opacity = 0.3; }} />
              {i === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-green-600 text-white text-[9px] font-bold uppercase">Cover</span>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                {i !== 0 && (
                  <button type="button" onClick={() => makeCover(i)}
                          className="px-2 py-0.5 rounded bg-white/90 text-slate-900 text-[10px] font-bold cursor-pointer">Make cover</button>
                )}
                <button type="button" onClick={() => remove(i)}
                        className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold cursor-pointer">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < max && (
        <div
          onClick={() => !busy && fileRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          className={`rounded-xl border-2 border-dashed py-6 px-4 text-center transition-all ${t.box}
                      ${dragOver ? 'border-blue-400' : ''} ${busy ? 'cursor-wait' : 'cursor-pointer'}`}>
          {busy ? (
            <p className={`text-xs font-bold ${t.text}`}>{status}</p>
          ) : (
            <>
              <p className={`text-sm font-bold ${t.text}`}>📷 Click or drop to add images</p>
              <p className={`text-xs mt-1 ${t.sub}`}>
                Select multiple · {value.length}/{max} added · max {maxMB}MB each
              </p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-2">
        <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
               onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
               placeholder="…or paste image URL"
               className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none ${t.input}`} />
        <button type="button" onClick={addUrl}
                className={`px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${t.btn}`}>Add</button>
      </div>

      {error && <p className="mt-2 text-xs text-yellow-500 font-semibold">⚠ {error}</p>}
    </div>
  );
}
