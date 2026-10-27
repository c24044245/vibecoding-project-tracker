import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from './Icons';
import { copyText } from '../lib/clipboard';
import { buildContextMarkdown } from '../lib/context';

/**
 * "Copy context" button (FR18). Copies the task as a Markdown briefing, then shows
 * "Copied to clipboard" next to it. The message sits in its own live region so it is
 * announced even inside the modal, where the page-level message area is hidden.
 */
export default function CopyContextButton({ task, assignee, compact = false }) {
  const [status, setStatus] = useState(''); // '', 'copied' or 'failed'
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    const ok = await copyText(buildContextMarkdown(task, assignee));
    setStatus(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(''), 3000);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 rounded-md border border-brand bg-white font-bold text-brand hover:bg-brand-soft ${
          compact ? 'min-h-[36px] px-2.5 text-sm' : 'min-h-[44px] px-4'
        }`}
      >
        {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
        Copy context
        {compact && <span className="sr-only"> for {task.title}</span>}
      </button>
      <span role="status" className={`text-sm font-bold ${status === 'failed' ? 'text-bug' : 'text-feature'}`}>
        {status === 'copied' && 'Copied to clipboard'}
        {status === 'failed' && 'Could not copy. Try again.'}
      </span>
    </span>
  );
}
