import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  text: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split text by LaTeX delimiters $ ... $ or $$ ... $$
  const parts: React.ReactNode[] = [];
  const regex = /(\$\$[\s\S]+?\$\$|\$[^\$]+?\$)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text preceding the match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</span>
      );
    }

    const rawFormula = match[0];
    const isBlock = rawFormula.startsWith('$$');
    const formula = isBlock
      ? rawFormula.slice(2, -2).trim()
      : rawFormula.slice(1, -1).trim();

    try {
      const html = katex.renderToString(formula, {
        displayMode: isBlock,
        throwOnError: false,
      });

      parts.push(
        <span
          key={`math-${match.index}`}
          className={`inline-block mx-0.5 ${isBlock ? 'my-2 block text-center' : ''}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (e) {
      parts.push(
        <code key={`err-${match.index}`} className="bg-red-100 text-red-700 px-1 rounded text-sm">
          {rawFormula}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
  }

  return <span className={`math-content ${className}`}>{parts}</span>;
};
