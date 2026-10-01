"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Check, Copy, Code2, Download, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGE_EXTENSIONS: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  csharp: "cs",
  go: "go",
  rust: "rs",
  ruby: "rb",
  php: "php",
  swift: "swift",
  kotlin: "kt",
  html: "html",
  css: "css",
  json: "json",
  markdown: "md",
  sql: "sql",
  bash: "sh",
  shell: "sh",
  yaml: "yml",
  xml: "xml",
};

interface CodeViewerProps {
  content: string;
  language: string;
  filename?: string;
}

export function CodeViewer({ content, language, filename = "code" }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const [downloadedTxt, setDownloadedTxt] = useState(false);
  const [downloadedExt, setDownloadedExt] = useState(false);

  const ext = LANGUAGE_EXTENSIONS[language.toLowerCase()] || "txt";

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (isTxt: boolean) => {
    if (isTxt) setDownloadedTxt(true);
    else setDownloadedExt(true);
    
    // Yield to main thread so UI updates immediately
    setTimeout(() => {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      let baseName = filename;
      if (baseName.includes('.')) {
        baseName = baseName.substring(0, baseName.lastIndexOf('.'));
      }
      
      const targetExt = isTxt ? "txt" : ext;
      a.download = `${baseName}.${targetExt}`;
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 10);

    setTimeout(() => {
      if (isTxt) setDownloadedTxt(false);
      else setDownloadedExt(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-125 rounded-2xl border border-border/50 overflow-hidden bg-[#1e1e1e] shadow-[0_0_30px_rgba(var(--primary),0.1)]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {ext !== "txt" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(false)}
                className="h-8 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              >
                {downloadedExt ? (
                  <Check className="h-4 w-4 text-green-500 mr-1.5" />
                ) : (
                  <Download className="h-4 w-4 mr-1.5" />
                )}
                {downloadedExt ? "Downloaded" : `Download .${ext}`}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(true)}
              className="h-8 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              {downloadedTxt ? (
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
              ) : (
                <Download className="h-4 w-4 mr-1.5" />
              )}
              {downloadedTxt ? "Downloaded" : "Download .txt"}
            </Button>
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

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground hover:text-foreground" />
              }>
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#1e1e1e] border-border/50 text-foreground">
                {ext !== "txt" && (
                  <DropdownMenuItem onClick={() => handleDownload(false)} className="hover:bg-white/10 cursor-pointer">
                    {downloadedExt ? (
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {downloadedExt ? "Downloaded" : `Download .${ext}`}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleDownload(true)} className="hover:bg-white/10 cursor-pointer">
                  {downloadedTxt ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {downloadedTxt ? "Downloaded" : "Download .txt"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy} className="hover:bg-white/10 cursor-pointer">
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied" : "Copy code"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
