"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Check, Copy, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeViewerProps {
  content: string;
  language: string;
}

export function CodeViewer({ content, language }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-125 rounded-2xl border border-border/50 overflow-hidden bg-[#1e1e1e] shadow-[0_0_30px_rgba(var(--primary),0.1)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500 mr-1.5" />
          ) : (
            <Copy className="h-4 w-4 mr-1.5" />
          )}
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={language.toLowerCase()}
          theme="vs-dark"
          value={content}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
