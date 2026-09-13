import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import Markdown from '@/components/blog/Markdown';
import {
  BoldIcon,
  HeadingIcon,
  type Icon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
} from '@/components/ui/icons';
import Spinner from '@/components/ui/Spinner';
import { ApiError } from '@/lib/api';
import { cx } from '@/lib/cx';

type Mode = 'write' | 'split' | 'preview';

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  error?: string;
};

const modes: { id: Mode; label: string }[] = [
  { id: 'write', label: 'Write' },
  { id: 'split', label: 'Split' },
  { id: 'preview', label: 'Preview' },
];

export default function MarkdownEditor({ value, onChange, onUploadImage, error }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const [mode, setMode] = useState<Mode>('split');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /** Replaces the current selection and re-selects part of the inserted text. */
  const replaceSelection = (start: number, end: number, build: (selected: string) => { text: string; from: number; to: number }) => {
    const current = valueRef.current;
    const { text, from, to } = build(current.slice(start, end));
    onChange(current.slice(0, start) + text + current.slice(end));
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(start + from, start + to);
    });
  };

  const selection = () => {
    const el = textareaRef.current;
    return el ? [el.selectionStart, el.selectionEnd] : [valueRef.current.length, valueRef.current.length];
  };

  const wrap = (before: string, after: string, placeholder: string) => {
    const [start, end] = selection();
    replaceSelection(start, end, (selected) => {
      const inner = selected || placeholder;
      return { text: `${before}${inner}${after}`, from: before.length, to: before.length + inner.length };
    });
  };

  const prefixLines = (prefix: (index: number) => string, placeholder: string) => {
    const [selStart, selEnd] = selection();
    const current = valueRef.current;
    const start = current.lastIndexOf('\n', selStart - 1) + 1;
    const lineEnd = current.indexOf('\n', selEnd);
    const end = lineEnd === -1 ? current.length : lineEnd;
    replaceSelection(start, end, (selected) => {
      const text = (selected || placeholder)
        .split('\n')
        .map((line, index) => prefix(index) + line.replace(/^(#{1,6}\s|>\s|[-*]\s|\d+\.\s)/, ''))
        .join('\n');
      return { text, from: 0, to: text.length };
    });
  };

  const insertLink = () => {
    const [start, end] = selection();
    replaceSelection(start, end, (selected) => {
      const label = selected || 'link text';
      const text = `[${label}](https://)`;
      return { text, from: label.length + 3, to: text.length - 1 };
    });
  };

  const tools: { label: string; icon: Icon; run: () => void; shortcut?: string }[] = [
    { label: 'Bold', icon: BoldIcon, run: () => wrap('**', '**', 'bold text'), shortcut: 'Ctrl+B' },
    { label: 'Italic', icon: ItalicIcon, run: () => wrap('_', '_', 'italic text'), shortcut: 'Ctrl+I' },
    { label: 'Heading', icon: HeadingIcon, run: () => prefixLines(() => '## ', 'Heading') },
    { label: 'Link', icon: LinkIcon, run: insertLink, shortcut: 'Ctrl+K' },
    { label: 'Bulleted list', icon: ListIcon, run: () => prefixLines(() => '- ', 'List item') },
    { label: 'Numbered list', icon: ListOrderedIcon, run: () => prefixLines((index) => `${index + 1}. `, 'List item') },
    { label: 'Quote', icon: QuoteIcon, run: () => prefixLines(() => '> ', 'Quote') },
  ];

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const key = event.key.toLowerCase();
    const action = key === 'b' ? tools[0] : key === 'i' ? tools[1] : key === 'k' ? tools[3] : null;
    if (action) {
      event.preventDefault();
      action.run();
    }
  };

  const onPickImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const [, cursor] = selection();
    setUploading(true);
    setUploadError(null);
    try {
      const url = await onUploadImage(file);
      const alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      const snippet = `\n![${alt}](${url})\n`;
      const current = valueRef.current;
      onChange(current.slice(0, cursor) + snippet + current.slice(cursor));
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : 'The image could not be uploaded.');
    } finally {
      setUploading(false);
    }
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(value.length / 1100));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-2xl border border-line bg-surface-muted px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5" role="toolbar" aria-label="Formatting">
          {tools.map(({ label, icon: ToolIcon, run, shortcut }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              disabled={mode === 'preview'}
              title={shortcut ? `${label} (${shortcut})` : label}
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:opacity-40"
            >
              <ToolIcon width={17} height={17} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || mode === 'preview'}
            title="Insert image"
            aria-label="Insert image"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink disabled:opacity-40"
          >
            {uploading ? <Spinner label="Uploading image" /> : <ImageIcon width={17} height={17} />}
          </button>
        </div>

        <div className="flex rounded-lg bg-surface-sunken p-0.5 text-sm" role="tablist" aria-label="Editor view">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              onClick={() => setMode(item.id)}
              className={cx(
                'rounded-md px-3 py-1.5 transition-colors',
                mode === item.id ? 'bg-white text-onbrand' : 'text-ink-muted hover:text-ink',
                item.id === 'split' && 'hidden lg:block',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cx('grid overflow-hidden rounded-b-2xl border-x border-b', error ? 'border-red-500' : 'border-line', mode === 'split' && 'lg:grid-cols-2')}>
        {mode !== 'preview' && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Post body in Markdown"
            aria-invalid={error ? true : undefined}
            placeholder={'Write your post in Markdown…\n\n## A heading\n\nA paragraph with **bold** text and a [link](https://example.com).'}
            spellCheck
            className={cx(
              'block min-h-[32rem] w-full resize-y border-0 bg-surface-sunken p-5 font-mono text-sm leading-relaxed text-ink placeholder:text-ink-subtle focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
              mode === 'split' && 'lg:border-r lg:border-line',
            )}
          />
        )}
        {mode !== 'write' && (
          <div className={cx('max-h-[48rem] min-h-[32rem] overflow-y-auto bg-surface-sunken p-6', mode === 'split' && 'hidden lg:block')} aria-label="Preview">
            {value.trim() ? <Markdown size="base">{value}</Markdown> : <p className="text-ink-subtle">Nothing to preview yet.</p>}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
        <span>
          {words} words · about {minutes} min read
        </span>
        <span>Markdown supported: headings, lists, links, images, tables and quotes.</span>
      </div>
      {(error || uploadError) && <p className="mt-2 text-sm text-red-400">{uploadError ?? error}</p>}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onPickImage} />
    </div>
  );
}
