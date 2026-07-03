import type { ReactNode } from "react";

const inlinePattern = /(\*\*[\s\S]+?\*\*|\*[^*\n\r]+?\*|\[large\][\s\S]+?\[\/large\]|\[small\][\s\S]+?\[\/small\])/g;

export function RichText({ text }: { text: string }) {
  return <>{renderRichTextBlocks(text)}</>;
}

export function InlineRichText({ text }: { text: string }) {
  return <>{renderInlineRichText(text)}</>;
}

export function renderRichTextBlocks(text: string) {
  const blocks = normalizeLineBreaks(text)
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const isList = lines.every((line) => /^[-*]\s+/.test(line));

    if (isList) {
      return (
        <ul key={index}>
          {lines.map((line) => (
            <li key={line}>{renderInlineRichText(line.replace(/^[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }

    if (block.startsWith("## ")) {
      return (
        <h3 key={index} className="serif text-3xl leading-tight text-[var(--foreground)]">
          {renderInlineRichText(block.replace(/^##\s+/, ""))}
        </h3>
      );
    }

    if (block.startsWith("# ")) {
      return (
        <h2 key={index} className="serif text-4xl leading-tight text-[var(--foreground)]">
          {renderInlineRichText(block.replace(/^#\s+/, ""))}
        </h2>
      );
    }

    return <p key={index}>{renderInlineRichText(block)}</p>;
  });
}

export function renderInlineRichText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const normalizedText = normalizeLineBreaks(text);

  for (const match of normalizedText.matchAll(inlinePattern)) {
    if (match.index === undefined) {
      continue;
    }

    if (match.index > lastIndex) {
      parts.push(normalizedText.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${match.index}-${token}`;

    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={key}>{renderInlineRichText(token.slice(2, -2).trim())}</strong>);
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(<em key={key}>{renderInlineRichText(token.slice(1, -1).trim())}</em>);
    } else if (token.startsWith("[large]") && token.endsWith("[/large]")) {
      parts.push(
        <span key={key} className="text-xl leading-9">
          {renderInlineRichText(token.slice(7, -8))}
        </span>
      );
    } else if (token.startsWith("[small]") && token.endsWith("[/small]")) {
      parts.push(
        <span key={key} className="text-sm leading-6">
          {renderInlineRichText(token.slice(7, -8))}
        </span>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < normalizedText.length) {
    parts.push(normalizedText.slice(lastIndex));
  }

  return parts;
}

export function plainTextFromRichText(text: string) {
  return normalizeLineBreaks(text)
    .replace(/\*\*([\s\S]+?)\*\*/g, "$1")
    .replace(/\*([^*\n\r]+?)\*/g, "$1")
    .replace(/\[large\]([\s\S]+?)\[\/large\]/g, "$1")
    .replace(/\[small\]([\s\S]+?)\[\/small\]/g, "$1")
    .replace(/^#{1,2}\s+/gm, "")
    .trim();
}

function normalizeLineBreaks(text: string) {
  return text.replace(/\r\n?/g, "\n");
}
