import ReactMarkdown, { type Components } from 'react-markdown';
import { Link } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import { cx } from '@/lib/cx';

const components: Components = {
  a: ({ href = '', children, node, ...props }) =>
    href.startsWith('/') && !href.startsWith('//') ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    ),
  img: ({ alt = '', node, ...props }) => <img alt={alt} loading="lazy" {...props} />,
  table: ({ node, ...props }) => (
    <div className="not-prose my-8 overflow-x-auto rounded-2xl border border-line">
      <table
        className="w-full min-w-[32rem] text-left text-sm [&_td]:border-t [&_td]:border-line [&_td]:px-4 [&_td]:py-3 [&_th]:bg-surface-muted [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium"
        {...props}
      />
    </div>
  ),
};

type MarkdownProps = {
  children: string;
  size?: 'base' | 'lg';
  className?: string;
};

/** Renders post bodies. Raw HTML in the markdown is ignored and unsafe link protocols are stripped. */
export default function Markdown({ children, size = 'lg', className }: MarkdownProps) {
  return (
    <div
      className={cx(
        'prose max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:underline-offset-4 prose-img:rounded-3xl',
        size === 'lg' ? 'prose-lg prose-h2:mt-12' : 'prose-base',
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
