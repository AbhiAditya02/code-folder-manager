"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteFileButton({ fileId, folderId }: { fileId: string; folderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const password = prompt("Enter password to delete this file:");
    if (password === null) return;
    
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/files/${fileId}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          alert("Incorrect password!");
          return;
        }
        throw new Error("Failed to delete");
      }
      
      router.push(`/folders/${folderId}`);
      router.refresh();
    } catch (error) {
      alert("Failed to delete file.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="group rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all"
    >
      {isDeleting ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 h-4 w-4" />
      )}
      Delete File
    </Button>
  );
}
