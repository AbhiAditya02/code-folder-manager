"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { Save, Loader2, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddFileForm({ folderId }: { folderId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    heading: "",
    language: "javascript",
    content: "// Write your code here",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/folders/${folderId}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create file");
      }

      router.push(`/folders/${folderId}`);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const languages = [
    "javascript", "typescript", "python", "java", "c", "cpp", "csharp", "go", "rust", "php", "ruby", "sql", "html", "css", "markdown"
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-12rem)] min-h-125 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-border/50">
        <div className="space-y-2">
          <Label htmlFor="heading">File Heading</Label>
          <Input
            id="heading"
            placeholder="e.g. Binary Search Implementation"
            required
            value={formData.heading}
            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
            className="bg-black/50 border-border/50 focus-visible:ring-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select 
            value={formData.language} 
            onValueChange={(val) => setFormData({ ...formData, language: val || "javascript" })}
          >
            <SelectTrigger id="language" className="bg-black/50 border-border/50 focus-visible:ring-primary/50">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-border/50 backdrop-blur-xl">
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang} className="capitalize">
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl border border-border/50 overflow-hidden bg-[#1e1e1e] shadow-[0_0_30px_rgba(var(--primary),0.1)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">Editor</span>
        </div>
        <div className="flex-1 min-h-0 relative">
          <Editor
            height="100%"
            language={formData.language}
            theme="vs-dark"
            value={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val || "" })}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
            }}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={isLoading}
          size="lg"
          className="rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(var(--primary),0.5)]"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Save File
        </Button>
      </div>
    </form>
  );
}
