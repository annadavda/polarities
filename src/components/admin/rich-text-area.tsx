"use client";

import { Bold, Heading2, Italic, List, Pilcrow, Type } from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

type RichTextAreaProps = {
  label: string;
  name?: string;
  value?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  minHeightClassName?: string;
  onValueChange?: (value: string) => void;
};

type FormatAction = "bold" | "italic" | "large" | "small" | "heading" | "list";

export function RichTextArea({
  label,
  name,
  value,
  defaultValue,
  rows = 8,
  required = false,
  minHeightClassName = "",
  onValueChange
}: RichTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (format: FormatAction) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = textarea.value;
    const selected = currentValue.slice(start, end);
    const fallback = selected || placeholderFor(format);
    const replacement = formatSelection(format, fallback);
    const nextValue = `${currentValue.slice(0, start)}${replacement}${currentValue.slice(end)}`;

    if (onValueChange) {
      onValueChange(nextValue);
    } else {
      textarea.value = nextValue;
    }

    window.requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = selected ? start : start + selectionOffset(format);
      const selectionEnd = selected ? start + replacement.length : selectionStart + fallback.length;
      textarea.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div className="overflow-hidden border hairline bg-white">
        <div className="flex flex-wrap items-center gap-1 border-b hairline bg-[var(--paper)] p-2">
          <ToolbarButton label="Bold" onClick={() => applyFormat("bold")}>
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => applyFormat("italic")}>
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton label="Heading" onClick={() => applyFormat("heading")}>
            <Heading2 size={16} />
          </ToolbarButton>
          <ToolbarButton label="Larger text" onClick={() => applyFormat("large")}>
            <Type size={18} />
          </ToolbarButton>
          <ToolbarButton label="Smaller text" onClick={() => applyFormat("small")}>
            <Pilcrow size={16} />
          </ToolbarButton>
          <ToolbarButton label="Bullet list" onClick={() => applyFormat("list")}>
            <List size={16} />
          </ToolbarButton>
        </div>
        <textarea
          ref={textareaRef}
          name={name}
          value={value}
          defaultValue={defaultValue}
          required={required}
          rows={rows}
          onChange={(event) => onValueChange?.(event.target.value)}
          className={`w-full bg-white px-3 py-3 leading-7 outline-none ${minHeightClassName}`}
        />
      </div>
    </label>
  );
}

function ToolbarButton({
  label,
  onClick,
  children
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-9 min-h-9 w-9 px-0 py-0 text-[var(--foreground)]"
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </Button>
  );
}

function formatSelection(format: FormatAction, text: string) {
  if (format === "bold") {
    return `**${text}**`;
  }

  if (format === "italic") {
    return `*${text}*`;
  }

  if (format === "large") {
    return `[large]${text}[/large]`;
  }

  if (format === "small") {
    return `[small]${text}[/small]`;
  }

  if (format === "heading") {
    return text
      .split("\n")
      .map((line) => (line.trim() ? `## ${line.replace(/^#{1,2}\s+/, "")}` : line))
      .join("\n");
  }

  return text
    .split("\n")
    .map((line) => (line.trim() && !/^[-*]\s+/.test(line) ? `- ${line}` : line))
    .join("\n");
}

function placeholderFor(format: FormatAction) {
  if (format === "heading") {
    return "Heading";
  }

  if (format === "list") {
    return "List item";
  }

  return "formatted text";
}

function selectionOffset(format: FormatAction) {
  if (format === "bold") {
    return 2;
  }

  if (format === "italic") {
    return 1;
  }

  if (format === "large" || format === "small") {
    return 7;
  }

  if (format === "heading") {
    return 3;
  }

  return 2;
}
