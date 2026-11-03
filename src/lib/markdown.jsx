// A small Markdown renderer for the Context preview (FR25).
// It returns React elements, never raw HTML, so nothing typed into a note can inject code.
// Supports: headings (#, ##, ###), bullet and numbered lists, `code`, **bold**, *italic*,
// code blocks fenced with ``` and paragraphs.

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;

function renderInline(text, keyPrefix) {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (/^`[^`]+`$/.test(part)) return <code key={key} className="rounded bg-surface-hover px-1 font-mono text-sm">{part.slice(1, -1)}</code>;
    if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (/^(\*[^*]+\*|_[^_]+_)$/.test(part)) return <em key={key}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export function renderMarkdown(source = '') {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i += 1;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) code.push(lines[i++]);
      i += 1; // skip closing fence
      blocks.push(
        <pre key={`b${blocks.length}`} className="overflow-x-auto rounded bg-surface-hover p-2 font-mono text-sm">
          {code.join('\n')}
        </pre>,
      );
      continue;
    }

    // Heading: shown as bold text, so it does not disturb the page's heading outline
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const size = heading[1].length === 1 ? 'text-lg' : 'text-base';
      blocks.push(
        <p key={`b${blocks.length}`} className={`mt-2 font-bold ${size}`}>
          {renderInline(heading[2], `h${i}`)}
        </p>,
      );
      i += 1;
      continue;
    }

    // Bullet or numbered list
    const bullet = /^\s*[-*]\s+/;
    const numbered = /^\s*\d+\.\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const pattern = bullet.test(line) ? bullet : numbered;
      const items = [];
      while (i < lines.length && pattern.test(lines[i])) {
        items.push(<li key={i}>{renderInline(lines[i].replace(pattern, ''), `li${i}`)}</li>);
        i += 1;
      }
      const List = pattern === bullet ? 'ul' : 'ol';
      blocks.push(
        <List key={`b${blocks.length}`} className={`ml-5 ${List === 'ul' ? 'list-disc' : 'list-decimal'}`}>
          {items}
        </List>,
      );
      continue;
    }

    // Paragraph: consecutive plain lines join into one
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3})\s/.test(lines[i]) &&
      !bullet.test(lines[i]) &&
      !numbered.test(lines[i]) &&
      !lines[i].trim().startsWith('```')
    ) {
      para.push(lines[i].trim());
      i += 1;
    }
    blocks.push(<p key={`b${blocks.length}`}>{renderInline(para.join(' '), `p${i}`)}</p>);
  }

  return blocks;
}
